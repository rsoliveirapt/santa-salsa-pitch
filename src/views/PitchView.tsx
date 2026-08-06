import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Tv,
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  Plus,
  Database,
  Smartphone,
  CheckCircle2
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

  // Config modal state
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

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
      // Prevent duplicates
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
      className="min-h-screen bg-[#121212] text-slate-100 p-4 lg:p-8 flex flex-col justify-between selection:bg-[#E50914]"
    >
      {/* Pitch Header Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 lg:p-6 shadow-2xl mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E50914] via-amber-500 to-[#FFC107] p-0.5 shadow-lg flex-shrink-0 animate-pulse">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Tv className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E50914]/20 border border-[#E50914]/50 text-red-400">
                PITCH LIVE SCREEN
              </span>
              <button
                onClick={() => setShowConfigModal(true)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 border ${
                  supabaseConnected
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                }`}
              >
                <Database className="w-3 h-3" />
                <span>{supabaseConnected ? 'Supabase Connected' : 'Local Realtime Mode'}</span>
              </button>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#E50914]">Santa Salsa</span> Brooklyn
            </h1>
          </div>
        </div>

        {/* Live Counter & Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Animated Counter Badge */}
          <div className="bg-zinc-950/90 border-2 border-amber-500/60 rounded-2xl px-6 py-2.5 flex items-center gap-3 shadow-xl neon-glow-yellow">
            <Flame className="w-7 h-7 text-[#E50914] animate-bounce" />
            <div>
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                PERROS CRIADOS AO VIVO
              </div>
              <div className="text-3xl font-black text-white font-mono leading-tight">
                {totalCount}{' '}
                <span className="text-sm font-normal text-amber-400">Perros</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            <button
              onClick={handleSimulatePerro}
              className="p-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Simular Novo Perro"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Simular Perro</span>
            </button>

            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-zinc-800 text-emerald-400 border-zinc-700'
                  : 'bg-zinc-900 text-zinc-600 border-zinc-800'
              }`}
              title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-all"
              title="Ecrã Inteiro"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleClearWall}
              className="p-2.5 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-all"
              title="Limpar Grelha"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {onNavigateToMobile && (
              <button
                onClick={onNavigateToMobile}
                className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 transition-all flex items-center gap-1 text-xs font-bold"
                title="Ir para Vista Mobile"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden md:inline">Vista Mobile</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Pitch Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* LEFT COLUMN: QR Code & Audience Call to Action (4 cols on lg) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* QR Code Presentation Box */}
          <div className="bg-zinc-900/90 border-2 border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl transition-all">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Participa no Pitch</span>
            </div>

            <h2 className="text-2xl font-black uppercase text-white tracking-wide mb-1">
              Aponta o Telemóvel
            </h2>
            <p className="text-sm font-hand text-amber-400 mb-6">
              e cria o teu Perro Con Todo! 🌭🔥
            </p>

            {/* QR Code Frame */}
            <div className="p-4 bg-white rounded-2xl shadow-2xl border-4 border-amber-400 mb-6 transform hover:scale-105 transition-transform cursor-pointer">
              {appUrl && (
                <QRCodeSVG
                  value={appUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌭</text></svg>',
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true
                  }}
                />
              )}
            </div>

            <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400 break-all select-all">
              {appUrl}
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Estatísticas em Tempo Real</span>
              <span className="text-emerald-400">● LIVE</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div className="text-2xl font-black text-amber-400 font-mono">{avgNivel}%</div>
                <div className="text-[11px] text-zinc-500 font-medium uppercase">
                  Média Caracas
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {perros.filter((p) => p.nivel_caracas === 100).length}
                </div>
                <div className="text-[11px] text-zinc-500 font-medium uppercase">
                  Perros "Con Todo"
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Live Wall of Perros Grid (8 cols on lg) */}
        <main className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 lg:p-6 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
            <h2 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#E50914]" />
              <span>Live Wall of Perros</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">({totalCount})</span>
            </h2>

            {totalCount > 0 && (
              <span className="text-xs text-zinc-400 font-mono">
                A atualizar em tempo real via Supabase Realtime
              </span>
            )}
          </div>

          {/* Grid Container */}
          {totalCount === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-800 rounded-xl my-4">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600">
                <Flame className="w-8 h-8 animate-pulse text-amber-500/50" />
              </div>
              <h3 className="text-xl font-black text-zinc-300 uppercase tracking-wider mb-2">
                A aguardar os primeiros Perros!
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                Aponta o telemóvel ao QR Code à esquerda e cria a tua primeira combinação para veres aqui ao vivo!
              </p>
              <button
                onClick={handleSimulatePerro}
                className="mt-6 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Simular Perro de Teste</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto max-h-[680px] pr-2 pb-4">
              {perros.map((perro: PerroRecord, idx: number) => {
                const nivelLabel = getNivelCaracasLabel(perro.nivel_caracas);
                const isFirst = idx === 0;

                return (
                  <div
                    key={perro.id}
                    className={`bg-zinc-900 border rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-300 ${
                      isFirst
                        ? 'border-amber-400/80 ring-2 ring-amber-400/30 animate-pop-in neon-glow-yellow'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Card Top Row */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                          #{perro.id.slice(0, 6)}
                        </span>
                        {isFirst && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#E50914] text-white animate-pulse">
                            NOVO!
                          </span>
                        )}
                      </div>

                      {/* Caracas Gauge Badge */}
                      <span
                        className={`text-xs font-black font-mono px-2.5 py-0.5 rounded-full border ${
                          perro.nivel_caracas === 100
                            ? 'bg-red-950 border-red-500 text-red-400'
                            : 'bg-zinc-950 border-zinc-800 text-amber-400'
                        }`}
                      >
                        {perro.nivel_caracas}%
                      </span>
                    </div>

                    {/* Hot Dog Mini Preview */}
                    <div className="my-2 flex justify-center bg-zinc-950/60 rounded-xl py-3 border border-zinc-800/60">
                      <HotDogVisualizer selectedIngredients={perro.ingredientes} size="sm" />
                    </div>

                    {/* Caracas Level Label */}
                    <div className="text-center mb-3">
                      <div className={`text-xs font-black uppercase ${nivelLabel.colorClass}`}>
                        {nivelLabel.title}
                      </div>
                    </div>

                    {/* Ingredient Pills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {perro.ingredientes.map((ingId) => {
                        const def = INGREDIENTS.find((i) => i.id === ingId);
                        if (!def) return null;
                        return (
                          <span
                            key={ingId}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${def.badgeBg} ${def.badgeBorder} ${def.badgeText}`}
                          >
                            {def.name}
                          </span>
                        );
                      })}
                    </div>

                    {/* Footer Timestamp */}
                    <div className="pt-2 border-t border-zinc-800/60 flex justify-between items-center text-[10px] font-mono text-zinc-500">
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
        </main>
      </div>

      {/* Supabase Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <span>Definições do Supabase</span>
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-zinc-500 hover:text-white font-bold"
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
                <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                  Supabase Anon Key
                </label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {configMessage && (
              <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{configMessage}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E50914] to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110"
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
