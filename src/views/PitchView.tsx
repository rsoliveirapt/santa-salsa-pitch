import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  Plus,
  Database,
  Smartphone,
  CheckCircle2,
  Disc,
  Eye,
  EyeOff
} from 'lucide-react';
import { HotDogVisualizer } from '../components/HotDogVisualizer';
import {
  INGREDIENTS,
  getNivelCaracasLabel,
  calculateNivelCaracas,
  type PerroRecord
} from '../types/hotdog';
import {
  getSupabaseClient,
  getStoredSupabaseCredentials,
  saveSupabaseCredentials,
  localBroadcast
} from '../lib/supabase';
import { soundFx } from '../utils/audio';

interface PitchViewProps {
  onNavigateToMobile?: () => void;
}

export const PitchView: React.FC<PitchViewProps> = ({ onNavigateToMobile }) => {
  const [perros, setPerros] = useState<PerroRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [appUrl, setAppUrl] = useState<string>('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [, setIsFullscreen] = useState(false);

  // Config modal state
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen change listener & auto-collapse option
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = Boolean(document.fullscreenElement);
      setIsFullscreen(isFS);
      if (isFS) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Initialize app URL for QR Code & Supabase listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname.replace('/pitch', '')}`;
      setAppUrl(url);

      const creds = getStoredSupabaseCredentials();
      setInputUrl(creds.url);
      setInputKey(creds.key);
    }
  }, []);

  // Fetch initial records and subscribe to Supabase Realtime + Local Broadcast fallback
  useEffect(() => {
    let supabaseChannel: any = null;

    // Load initial cached demo records from localStorage
    const savedLocal = localStorage.getItem('SANTA_SALSA_PERROS_DB');
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        setPerros(parsed);
      } catch (e) {
        console.error('Error parsing local perros:', e);
      }
    }

    // Try Supabase fetch & subscription
    const supabase = getSupabaseClient();
    if (supabase) {
      setSupabaseConnected(true);

      // Fetch existing records from Supabase
      supabase
        .from('cachorros_pitch')
        .select('*')
        .order('criado_em', { ascending: false })
        .limit(50)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setPerros(data as PerroRecord[]);
          }
        });

      // Subscribe to Realtime INSERT events
      supabaseChannel = supabase
        .channel('public:cachorros_pitch')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'cachorros_pitch' },
          (payload) => {
            const newRecord = payload.new as PerroRecord;
            handleNewPerroArrived(newRecord);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('⚡ Connected to Supabase Realtime postgres_changes!');
          }
        });
    } else {
      setSupabaseConnected(false);
    }

    // Also listen to local BroadcastChannel fallback for multi-tab testing
    const handleBroadcastMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NEW_PERRO') {
        const newRecord = event.data.payload as PerroRecord;
        handleNewPerroArrived(newRecord);
      }
    };

    if (localBroadcast) {
      localBroadcast.addEventListener('message', handleBroadcastMessage);
    }

    return () => {
      if (supabaseChannel && supabase) {
        supabase.removeChannel(supabaseChannel);
      }
      if (localBroadcast) {
        localBroadcast.removeEventListener('message', handleBroadcastMessage);
      }
    };
  }, []);

  // Handle new incoming hot dog
  const handleNewPerroArrived = (newRecord: PerroRecord) => {
    soundFx.playPitchChime();
    setPerros((prev) => {
      if (prev.some((item) => item.id === newRecord.id)) return prev;
      return [newRecord, ...prev];
    });
  };

  // Toggle Sound SFX
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  // Simulate incoming hot dog for pitch demo
  const handleSimulatePerro = () => {
    const randomCount = Math.floor(Math.random() * 6) + 1;
    const shuffled = [...INGREDIENTS].sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, randomCount).map((i) => i.id);
    const nivel = calculateNivelCaracas(selectedIds);

    const simulated: PerroRecord = {
      id: `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ingredientes: selectedIds,
      nivel_caracas: nivel,
      criado_em: new Date().toISOString()
    };

    handleNewPerroArrived(simulated);
  };

  // Clear wall
  const handleClearWall = () => {
    if (confirm('Tem a certeza que deseja limpar o ecrã do Pitch?')) {
      setPerros([]);
      localStorage.removeItem('SANTA_SALSA_PERROS_DB');
    }
  };

  // Save Supabase credentials from modal
  const handleSaveConfig = () => {
    saveSupabaseCredentials(inputUrl, inputKey);
    setConfigMessage('Definições guardadas! A recarregar página...');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Calculate statistics
  const totalCount = perros.length;
  const avgNivel = totalCount
    ? Math.round(perros.reduce((acc, p) => acc + p.nivel_caracas, 0) / totalCount)
    : 0;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0F0F0F] text-slate-100 p-4 lg:p-6 flex flex-col justify-between select-none relative"
    >
      {/* Floating Restore Header Button when Header is Hidden */}
      {!showHeader && (
        <button
          onClick={() => setShowHeader(true)}
          className="fixed top-14 right-4 z-40 bg-[#1A1A1A]/95 border-2 border-amber-400 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-black shadow-2xl hover:bg-zinc-800 flex items-center gap-1.5 backdrop-blur-md transition-all hover:scale-105"
          title="Mostrar Banner Superior"
        >
          <Eye className="w-4 h-4 text-[#DC2626]" />
          <span>Mostrar Banner</span>
        </button>
      )}


      {/* Physical Venue Overhead Header Banner (Collapsible) */}
      {showHeader && (
        <header className="relative bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#7F1D1D] border-4 border-amber-500 rounded-2xl p-4 lg:p-6 shadow-[0_10px_0_#000] mb-6 flex flex-wrap items-center justify-between gap-4 overflow-hidden">
          {/* Overhead String Lights Accent */}
          <div className="absolute top-0 left-0 w-full flex justify-around px-2 pointer-events-none opacity-80">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-string-light" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-0.5 h-2.5 bg-zinc-900"></div>
                <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_8px_#F59E0B]"></div>
              </div>
            ))}
          </div>

          {/* Disco Ball Icon Accent */}
          <div className="absolute right-4 top-2 opacity-30 pointer-events-none">
            <Disc className="w-20 h-20 text-cyan-300 animate-disco" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            {/* Hand-Painted Sign Board Header Logo */}
            <div className="sign-board-white rounded-2xl px-5 py-2.5 shadow-[4px_4px_0_#000] transform -rotate-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#991B1B] font-mono">
                BROOKLYN • NEW YORK
              </div>
              <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#171717] leading-none font-display">
                SANTA SALSA
              </h1>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 border-t border-zinc-900/40 pt-0.5 mt-0.5 font-mono">
                VENEZUELAN STREET FOOD
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#DC2626] border border-amber-400 text-white shadow-sm">
                  PITCH LIVE SCREEN
                </span>
                <button
                  onClick={() => setShowConfigModal(true)}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border-2 flex items-center gap-1 ${
                    supabaseConnected
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : 'bg-amber-950 border-amber-500 text-amber-300'
                  }`}
                >
                  <Database className="w-3 h-3" />
                  <span>{supabaseConnected ? 'Supabase Connected' : 'Local Realtime Mode'}</span>
                </button>
              </div>
              <p className="text-xs font-hand text-amber-300">
                Live Perros Menu Wall from Brooklyn NYC 🌭
              </p>
            </div>
          </div>

          {/* Live Counter & Action Toolbar */}
          <div className="flex flex-wrap items-center gap-4 relative z-10">
            {/* Live Counter Badge */}
            <div className="bg-[#0F0F0F] border-4 border-amber-400 rounded-2xl px-5 py-2 flex items-center gap-3 shadow-[0_6px_0_#000]">
              <Flame className="w-7 h-7 text-[#DC2626] animate-bounce fill-[#DC2626]" />
              <div>
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none font-mono">
                  PERROS NO MENU AO VIVO
                </div>
                <div className="text-3xl font-black text-white font-mono leading-tight">
                  {totalCount}{' '}
                  <span className="text-xs font-normal text-amber-400 font-sans">Perros</span>
                </div>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 bg-[#0F0F0F] p-1.5 rounded-xl border-3 border-zinc-800 shadow-md">
              <button
                onClick={handleSimulatePerro}
                className="p-2.5 rounded-lg bg-[#DC2626] text-white border-2 border-amber-400 hover:bg-red-700 transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#000]"
                title="Simular Novo Perro"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Simular Perro</span>
              </button>

              <button
                onClick={toggleSound}
                className={`p-2.5 rounded-lg border-2 transition-all ${
                  soundEnabled
                    ? 'bg-zinc-800 text-emerald-400 border-emerald-500'
                    : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                }`}
                title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowHeader(false)}
                className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 border-2 border-amber-500/60 transition-all"
                title="Ocultar Banner Superior"
              >
                <EyeOff className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-zinc-700 transition-all"
                title="Ecrã Inteiro (Oculta Banner Automaticamente)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleClearWall}
                className="p-2.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 border-2 border-zinc-800 transition-all"
                title="Limpar Grelha"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {onNavigateToMobile && (
                <button
                  onClick={onNavigateToMobile}
                  className="p-2.5 rounded-lg bg-[#F59E0B] text-zinc-950 border-2 border-zinc-950 font-black text-xs uppercase transition-all flex items-center gap-1"
                  title="Ir para Vista Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden md:inline">Vista Mobile</span>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Pitch Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* LEFT COLUMN: QR Code & Audience Call to Action (4 cols on lg) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* QR Code Presentation Box */}
          <div className="bg-[#1A1A1A] border-4 border-amber-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_8px_0_#000]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#991B1B] border-2 border-amber-400 text-amber-300 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Participa no Pitch</span>
            </div>

            <h2 className="text-2xl font-black uppercase text-white tracking-wide mb-1 font-display">
              APONTA O TELEMÓVEL
            </h2>
            <p className="text-sm font-hand text-amber-400 mb-5">
              e adiciona o teu Perro ao Menu! 🌭🔥
            </p>

            {/* QR Code Solid Board Frame */}
            <div className="p-4 bg-[#FDF6E2] rounded-2xl shadow-[0_6px_0_#000] border-4 border-zinc-950 mb-5 transform hover:scale-105 transition-transform cursor-pointer">
              {appUrl && (
                <QRCodeSVG
                  value={appUrl}
                  size={190}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌭</text></svg>',
                    x: undefined,
                    y: undefined,
                    height: 36,
                    width: 36,
                    excavate: true
                  }}
                />
              )}
            </div>

            <div className="bg-[#0D0D0D] px-4 py-2 rounded-xl border-2 border-zinc-800 text-xs font-mono text-amber-300 break-all select-all font-bold">
              {appUrl}
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-[#1A1A1A] border-3 border-zinc-800 rounded-2xl p-5 shadow-[0_6px_0_#000] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono flex items-center justify-between">
              <span>ESTATÍSTICAS DA RUA</span>
              <span className="text-emerald-400">● LIVE</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#0D0D0D] p-3 rounded-xl border-2 border-zinc-800">
                <div className="text-2xl font-black text-amber-400 font-mono">{avgNivel}%</div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Média Caracas
                </div>
              </div>

              <div className="bg-[#0D0D0D] p-3 rounded-xl border-2 border-zinc-800">
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {perros.filter((p) => p.nivel_caracas === 100).length}
                </div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Perros "Con Todo"
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: RESTAURANT MENU BOARD LIVE WALL (8 cols on lg) */}
        <main className="lg:col-span-8 relative bg-[#500000] border-4 border-amber-500 rounded-2xl shadow-[0_10px_0_#000] flex flex-col justify-between overflow-hidden min-h-[580px]">
          {/* Menu Board Background Image Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-95 z-0"
            style={{ backgroundImage: `url('/menu-board.png')` }}
          />

          {/* Semi-transparent dark overlay for high contrast menu reading */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/50 z-0 pointer-events-none" />

          {/* PERROS CALIENTES HOT DOGS Graphic Header Logo */}
          <div className="relative z-10 pt-5 pb-3 px-6 flex justify-center items-center border-b-2 border-amber-400/40 bg-gradient-to-b from-black/70 to-transparent">
            <img
              src="/perros-logo.png"
              alt="Perros Calientes Hot Dogs"
              className="h-16 sm:h-20 lg:h-24 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transform hover:scale-105 transition-transform"
            />
          </div>

          {/* Grid Container inside Restaurant Menu Board */}
          <div className="relative z-10 flex-1 p-4 lg:p-6 overflow-y-auto max-h-[640px]">
            {totalCount === 0 ? (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8 border-4 border-dashed border-amber-400/60 rounded-2xl bg-black/75">
                <div className="w-16 h-16 rounded-full bg-[#78350F]/80 border-2 border-amber-400 flex items-center justify-center mb-4 text-amber-300">
                  <Flame className="w-8 h-8 animate-bounce text-amber-400 fill-amber-400" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2 font-display">
                  O MENU ESTÁ A AGUARDAR PEDIDOS!
                </h3>
                <p className="text-xs text-amber-200/90 max-w-sm font-hand">
                  Aponta o telemóvel ao QR Code à esquerda e cria a tua combinação para apareceres aqui no Menu do Santa Salsa! 🌭
                </p>
                <button
                  onClick={handleSimulatePerro}
                  className="mt-6 px-5 py-3 rounded-xl bg-[#DC2626] text-white border-2 border-amber-400 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_4px_0_#000] hover:scale-105"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Adicionar Perro ao Menu</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                {perros.map((perro: PerroRecord, idx: number) => {
                  const nivelLabel = getNivelCaracasLabel(perro.nivel_caracas);
                  const isFirst = idx === 0;

                  return (
                    <div
                      key={perro.id}
                      className={`bg-[#0F0F0F]/95 backdrop-brightness-75 border-4 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_0_#000] transition-all duration-300 ${
                        isFirst
                          ? 'border-amber-400 ring-4 ring-amber-400/30 animate-pop-in'
                          : 'border-zinc-900 hover:border-amber-500/60'
                      }`}
                    >
                      {/* Menu Item Header */}
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-black text-amber-400 uppercase bg-[#991B1B] px-1.5 py-0.5 rounded border border-amber-500/50">
                            #{perro.id.slice(0, 5)}
                          </span>
                          {isFirst && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#DC2626] text-white animate-pulse">
                              NOVO NO MENU!
                            </span>
                          )}
                        </div>

                        {/* Caracas Gauge Badge */}
                        <span
                          className={`text-xs font-black font-mono px-2.5 py-0.5 rounded border-2 ${
                            perro.nivel_caracas === 100
                              ? 'bg-red-950 border-red-500 text-red-400'
                              : 'bg-zinc-950 border-amber-500 text-amber-400'
                          }`}
                        >
                          {perro.nivel_caracas}%
                        </span>
                      </div>

                      {/* Hot Dog Mini Visualizer */}
                      <div className="my-2 flex justify-center bg-black/80 rounded-xl py-3 border-2 border-zinc-800">
                        <HotDogVisualizer selectedIngredients={perro.ingredientes} size="sm" />
                      </div>

                      {/* Caracas Level Label */}
                      <div className="text-center mb-2">
                        <div className={`text-xs font-black uppercase font-display ${nivelLabel.colorClass}`}>
                          {nivelLabel.title}
                        </div>
                      </div>

                      {/* Ingredient Pills (Menu Item Ingredients) */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {perro.ingredientes.map((ingId) => {
                          const def = INGREDIENTS.find((i) => i.id === ingId);
                          if (!def) return null;
                          return (
                            <span
                              key={ingId}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded border ${def.badgeBg} ${def.badgeBorder} ${def.badgeText}`}
                            >
                              {def.name}
                            </span>
                          );
                        })}
                      </div>

                      {/* Footer Timestamp */}
                      <div className="pt-2 border-t border-zinc-800/80 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span>{perro.ingredientes.length} ingredientes</span>
                        <span>
                          {new Date(perro.criado_em).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Menu Board Footer Bar (Original Graphic Footer: Contains Meat / @santasalsastreet / Veg) */}
          <div className="relative z-10 bg-black/90 px-6 py-2 border-t-2 border-amber-400 flex flex-wrap justify-between items-center text-[11px] font-bold text-amber-300 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-400 inline-block"></span>
              <span>Contains Meat / Con Todo</span>
            </span>

            <span className="text-white font-hand">@santasalsastreet</span>

            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 bg-emerald-400 inline-block"></span>
              <span>Vegetarian or Vegan Option</span>
            </span>
          </div>
        </main>
      </div>

      {/* Supabase Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border-4 border-amber-500 rounded-2xl max-w-md w-full p-6 shadow-[0_10px_0_#000]">
            <div className="flex justify-between items-center pb-3 border-b-2 border-zinc-800 mb-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2 font-display">
                <Database className="w-5 h-5 text-amber-400" />
                <span>Definições do Supabase</span>
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-zinc-400 hover:text-white font-black text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Insere as credenciais da tua base de dados Supabase para ligar o Realtime nativo
              com a tabela <code className="text-amber-400 font-mono">cachorros_pitch</code>.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-amber-400 mb-1 font-mono">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full bg-[#0D0D0D] border-2 border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-400 mb-1 font-mono">
                  Supabase Anon Key
                </label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full bg-[#0D0D0D] border-2 border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {configMessage && (
              <div className="mb-4 p-3 bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{configMessage}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0D0D0D] text-zinc-400 hover:text-white font-bold text-xs uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex-1 py-3 px-4 rounded-xl bg-[#DC2626] text-white border-2 border-amber-400 font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#000] hover:bg-red-600"
              >
                Guardar & Ligar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
