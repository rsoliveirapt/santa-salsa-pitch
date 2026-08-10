import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Disc,
  Eye,
  EyeOff,
  Trash2,
  Database,
  ZoomIn,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { HotDogVisualizer } from '../components/HotDogVisualizer';
import { IngredientIcon } from '../components/IngredientIcons';
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

interface StoryMilestone {
  id: string;
  year: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  text: string;
  highlight: string;
  video?: string;
}

const STORY_MILESTONES: StoryMilestone[] = [
  {
    id: 'storefront',
    year: '#1 • VENUE',
    badge: 'HISTÓRIA #1',
    title: 'O Contraste Cultural',
    subtitle: 'De Caracas para Brooklyn: A Fusão de Sabores',
    image: '/story-storefront.png',
    text: 'Com uma fachada icónica repleta de arte urbana e stickers, o restaurante Santa Salsa em Brooklyn tornou-se um marco em Nova Iorque. Um espaço de encontro onde gastronomia, cocktails e o espírito de comunidade se unem.',
    highlight: 'Um espaço de culto em Nova Iorque com ambiente urbano inimitável.'
  },
  {
    id: 'founder',
    year: '#2 • PITCH',
    badge: 'HISTÓRIA #2',
    title: 'Sergio Leiva & A Alma do Santa Salsa',
    subtitle: 'Perros Calientes com a Cultura Skate de Brooklyn',
    image: '/story-founder.png',
    text: "O Criador ('El Hace') - O Prato como Tela de Arte, Evolução da Marca",
    highlight: 'Uma fusão perfeita de Street Food de Caracas com a cultura urbana de Brooklyn.'
  },
  {
    id: 'perro-real',
    year: '#3 • RECEITA',
    badge: 'HISTÓRIA #3',
    title: 'O Autêntico Perro Caliente "Con Todo"',
    subtitle: 'A Experiência Gastronómica de Caracas',
    image: '/story-perro-real.png',
    text: 'O ritual do Perro Caliente real: pão artesanal tostado, repolho crocante, queijo fresco ralado, batata palha crocante e a trilogia irresistível de molhos — alho, milho doce e salsa rosada.',
    highlight: 'A verdadeira street food venezuelana servida com máxima qualidade.',
    video: '/diana.mp4'
  }
];

interface PitchViewProps {
  onNavigateToMobile?: () => void;
  showHeader?: boolean;
  onToggleHeader?: () => void;
  onRegisterControls?: (controls: {
    simulate: () => void;
    openConfig: () => void;
    isConnected: boolean;
  }) => void;
}

export const PitchView: React.FC<PitchViewProps> = ({
  onNavigateToMobile,
  showHeader = true,
  onToggleHeader,
  onRegisterControls
}) => {
  const [perros, setPerros] = useState<PerroRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [appUrl, setAppUrl] = useState<string>('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showStoryDeck, setShowStoryDeck] = useState(true);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [, setIsFullscreen] = useState(false);

  // Config modal state
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuBoardRef = useRef<HTMLDivElement>(null);

  // Fullscreen change listener & auto-show 3D story cutouts
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = Boolean(document.fullscreenElement);
      setIsFullscreen(isFS);
      if (isFS) {
        setShowStoryDeck(true);
        if (showHeader && onToggleHeader) {
          onToggleHeader();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [showHeader, onToggleHeader]);

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

      // Subscribe to Realtime INSERT & DELETE events
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
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'cachorros_pitch' },
          () => {
            setPerros([]);
            localStorage.removeItem('SANTA_SALSA_PERROS_DB');
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
      } else if (event.data && event.data.type === 'CLEAR_PERROS') {
        setPerros([]);
        localStorage.removeItem('SANTA_SALSA_PERROS_DB');
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

    // Auto-scroll menu board to top to reveal incoming item
    setTimeout(() => {
      menuBoardRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
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

  // Register controls to top Navbar in App.tsx
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        simulate: handleSimulatePerro,
        openConfig: () => setShowConfigModal(true),
        isConnected: supabaseConnected
      });
    }
  }, [supabaseConnected, onRegisterControls]);

  // Clear wall & database
  const handleClearWall = async () => {
    if (confirm('Tem a certeza que deseja limpar todos os Perros do menu ao vivo?')) {
      setPerros([]);
      localStorage.setItem('SANTA_SALSA_PERROS_DB', '[]');
      localStorage.removeItem('SANTA_SALSA_PERROS_DB');

      // Clear local broadcast
      if (localBroadcast) {
        localBroadcast.postMessage({ type: 'CLEAR_PERROS' });
      }

      // Also clear Supabase database table if connected
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { error } = await supabase
            .from('cachorros_pitch')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

          if (error) {
            console.error('Erro ao eliminar no Supabase:', error);
          } else {
            console.log('✅ Tabela cachorros_pitch no Supabase limpa com sucesso!');
          }
        } catch (e) {
          console.warn('Could not delete from Supabase:', e);
        }
      }
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

  // Dynamic grid classes based on total item count
  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-xl mx-auto';
    if (count <= 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'; // 4+ items: 4 columns in expanded 75% menu board!
  };

  const selectedStory = selectedStoryIndex !== null ? STORY_MILESTONES[selectedStoryIndex] : null;

  return (
    <div
      ref={containerRef}
      className="min-h-screen lg:h-[calc(100vh-42px)] lg:max-h-screen bg-[#0F0F0F] text-slate-100 p-2 sm:p-3 lg:p-4 flex flex-col justify-between select-none relative overflow-y-auto lg:overflow-hidden"
    >
      {/* Physical Venue Overhead Header Banner (Collapsible) */}
      {showHeader && (
        <header className="relative bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#7F1D1D] border-4 border-amber-500 rounded-2xl p-3 lg:p-4 shadow-[0_8px_0_#000] mb-3 flex flex-wrap items-center justify-between gap-3 overflow-hidden flex-shrink-0">
          {/* Overhead String Lights Accent */}
          <div className="absolute top-0 left-0 w-full flex justify-around px-2 pointer-events-none opacity-80">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-string-light" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-0.5 h-2 bg-zinc-900"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#F59E0B]"></div>
              </div>
            ))}
          </div>

          {/* Disco Ball Icon Accent */}
          <div className="absolute right-4 top-1 opacity-25 pointer-events-none">
            <Disc className="w-16 h-16 text-cyan-300 animate-disco" />
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* Hand-Painted Sign Board Header Logo */}
            <div className="sign-board-white rounded-xl px-4 py-2 shadow-[3px_3px_0_#000] transform -rotate-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#991B1B] font-mono">
                BROOKLYN • NEW YORK
              </div>
              <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-[#171717] leading-none font-display">
                SANTA SALSA
              </h1>
              <div className="text-[9px] font-black uppercase tracking-widest text-amber-600 border-t border-zinc-900/40 pt-0.5 mt-0.5 font-mono">
                VENEZUELAN STREET FOOD
              </div>
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-hand text-amber-300">
                Live Perros Menu Wall from Brooklyn NYC 🌭
              </p>
            </div>
          </div>

          {/* Integrated Live Counter & Street Stats */}
          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            {/* Total Live Perros Badge */}
            <div className="bg-[#0F0F0F] border-3 border-amber-400 rounded-xl px-3.5 py-1.5 flex items-center gap-2.5 shadow-[0_4px_0_#000]">
              <Flame className="w-6 h-6 text-[#DC2626] animate-bounce fill-[#DC2626]" />
              <div>
                <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-none font-mono">
                  PERROS AO VIVO
                </div>
                <div className="text-xl font-black text-white font-mono leading-tight">
                  {totalCount} <span className="text-[10px] font-normal text-amber-400 font-sans">Perros</span>
                </div>
              </div>
            </div>

            {/* Street Stats - Média Caracas */}
            <div className="bg-[#0F0F0F] border-2 border-zinc-800 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-md">
              <div className="text-center">
                <div className="text-xl font-black text-amber-400 font-mono leading-none">{avgNivel}%</div>
                <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                  Média Caracas
                </div>
              </div>
            </div>

            {/* Street Stats - Perros Con Todo */}
            <div className="bg-[#0F0F0F] border-2 border-zinc-800 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-md">
              <div className="text-center">
                <div className="text-xl font-black text-emerald-400 font-mono leading-none">
                  {perros.filter((p) => p.nivel_caracas === 100).length}
                </div>
                <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                  "Con Todo" 🚀
                </div>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-1.5 bg-[#0F0F0F] p-1 rounded-xl border-2 border-zinc-800 shadow-md ml-auto">
              {/* TOGGLE 3D STORY CARDS BUTTON */}
              <button
                onClick={() => setShowStoryDeck((prev) => !prev)}
                className={`p-2 rounded-lg border-2 transition-all flex items-center gap-1 text-xs font-black uppercase tracking-wider ${showStoryDeck
                  ? 'bg-[#FFEB01] text-zinc-950 border-zinc-950 font-black shadow-sm'
                  : 'bg-zinc-800 text-amber-300 border-amber-500/60 hover:bg-zinc-700'
                  }`}
                title="Mostrar/Ocultar Imagens 3D de História no Pitch"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Cartões 3D</span>
              </button>

              <button
                onClick={toggleSound}
                className={`p-2 rounded-lg border-2 transition-all ${soundEnabled
                  ? 'bg-zinc-800 text-emerald-400 border-emerald-500'
                  : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                  }`}
                title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {onToggleHeader && (
                <button
                  onClick={onToggleHeader}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 border-2 border-amber-500/60 transition-all"
                  title={showHeader ? 'Ocultar Banner Superior' : 'Mostrar Banner Superior'}
                >
                  {showHeader ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              )}

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-zinc-700 transition-all"
                title="Ecrã Inteiro"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* CLEAR MENU BUTTON WITH TRASH ICON & PROMINENT TEXT */}
              <button
                onClick={handleClearWall}
                className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border-2 border-red-600 transition-all flex items-center gap-1 text-xs font-black uppercase tracking-wider shadow-sm"
                title="Limpar todos os Perros do Menu"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400 stroke-[2.5]" />
                <span className="hidden sm:inline">Limpar Menu</span>
              </button>

              {onNavigateToMobile && (
                <button
                  onClick={onNavigateToMobile}
                  className="p-2 rounded-lg bg-[#F59E0B] text-zinc-950 border-2 border-zinc-950 font-black text-xs uppercase transition-all flex items-center gap-1"
                  title="Ir para Vista Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Vista Mobile</span>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Pitch Split Screen Layout (Maximizing Menu Board to 9/12 cols, QR Sidebar to 3/12 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 relative">
        {/* LEFT COLUMN: COMPACT FOCUSED QR CODE SIDEBAR (3 cols on lg) */}
        <aside className="lg:col-span-3 flex flex-col lg:h-full">
          {/* Compact QR Code Presentation Box */}
          <div className="bg-[#1A1A1A] border-4 border-amber-500 rounded-2xl p-3.5 sm:p-4 lg:p-6 flex flex-col sm:flex-row lg:flex-col items-center justify-between lg:justify-center lg:gap-6 text-center sm:text-left lg:text-center shadow-[0_8px_0_#000] lg:h-full">
            <div className="flex flex-col items-center sm:items-start lg:items-center">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#991B1B] border border-amber-400 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-2 shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>PITCH AO VIVO</span>
              </div>

              <h2 className="text-xl lg:text-2xl font-black uppercase text-white tracking-wide mb-0.5 font-display leading-tight">
                APONTA O TELEMÓVEL
              </h2>
              <p className="text-[11px] font-hand text-amber-400 mb-2">
                e adiciona o teu Perro ao Menu! 🌭🔥
              </p>
            </div>

            {/* Clickable QR Code Frame (Opens Zoomed Modal) */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full sm:w-auto">
              <div
                onClick={() => setShowQrModal(true)}
                className="p-3 bg-[#FDF6E2] rounded-2xl shadow-[0_6px_0_#000] border-4 border-zinc-950 transform hover:scale-105 transition-transform cursor-pointer flex flex-col items-center justify-center group relative flex-shrink-0"
                title="Clica para ampliar o Código QR"
              >
                {appUrl && (
                  <QRCodeSVG
                    value={appUrl}
                    size={165}
                    level="H"
                    includeMargin={true}
                    className="w-28 h-28 lg:w-44 lg:h-44"
                    imageSettings={{
                      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌭</text></svg>',
                      x: undefined,
                      y: undefined,
                      height: 32,
                      width: 32,
                      excavate: true
                    }}
                  />
                )}
                {/* Zoom Hover Badge */}
                <div className="mt-1.5 flex items-center gap-1 text-[9px] font-mono font-bold text-zinc-900 bg-amber-400 px-2 py-0.5 rounded-full border border-zinc-950 shadow-sm group-hover:bg-amber-300">
                  <ZoomIn className="w-3 h-3" />
                  <span>Ampliar QR</span>
                </div>
              </div>

              {/* Direct URL Box */}
              <div className="w-full sm:w-48 lg:w-full mt-0 lg:mt-2">
                <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5 font-mono text-center sm:text-left lg:text-center">
                  LINK DA AUDIÊNCIA
                </div>
                <div className="bg-[#0D0D0D] px-2.5 py-1.5 rounded-xl border-2 border-amber-400/80 text-[10px] sm:text-[11px] font-mono text-amber-300 break-all select-all font-black text-center shadow-inner">
                  {appUrl}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: EXPANDED RESTAURANT MENU BOARD LIVE WALL (9 cols on lg - 75% Width!) */}
        <main className="lg:col-span-9 relative bg-[#500000] border-4 border-amber-500 rounded-2xl shadow-[0_8px_0_#000] flex flex-col justify-between overflow-hidden min-h-[450px] lg:h-full">
          {/* Menu Board Background Image Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-95 z-0"
            style={{ backgroundImage: `url('/menu-board.png')` }}
          />

          {/* Semi-transparent dark overlay for high contrast menu reading */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/50 z-0 pointer-events-none" />

          {/* PERROS CALIENTES HOT DOGS Graphic Header Logo & Quick Clear Button */}
          <div className="relative z-10 pt-3 pb-2 px-5 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
            <div className="w-20"></div>

            <img
              src="/perros-logo.png"
              alt="Perros Calientes Hot Dogs"
              className="h-14 sm:h-16 lg:h-18 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transform hover:scale-105 transition-transform"
            />

            {/* Quick Clear Menu Button inside Board */}
            <div className="w-20 flex justify-end">
              {totalCount > 0 && (
                <button
                  onClick={handleClearWall}
                  className="px-2 py-0.5 rounded-lg bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-900 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-md"
                  title="Limpar todos os Perros do Menu"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                  <span>Limpar</span>
                </button>
              )}
            </div>
          </div>

          {/* MOBILE STORY CHIPS BAR (Visible only on screens < lg) */}
          {showStoryDeck && (
            <div className="flex lg:hidden overflow-x-auto gap-2 p-2 bg-[#0D0D0D]/95 border-b-2 border-amber-500/60 relative z-20 justify-start sm:justify-center items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedStoryIndex(0)}
                className="flex-none flex items-center gap-1.5 bg-[#1A1A1A] border-2 border-[#FFEB01] px-2.5 py-1 rounded-xl active:scale-95 transition-all shadow-md group"
              >
                <img src="/story-storefront.png" alt="História #1" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-black uppercase text-[#FFEB01] font-mono whitespace-nowrap">#1 BROOKLYN</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStoryIndex(1)}
                className="flex-none flex items-center gap-1.5 bg-[#1A1A1A] border-2 border-[#FFEB01] px-2.5 py-1 rounded-xl active:scale-95 transition-all shadow-md group"
              >
                <img src="/story-founder.png" alt="História #2" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-black uppercase text-[#FFEB01] font-mono whitespace-nowrap">#2 FUNDADOR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStoryIndex(2)}
                className="flex-none flex items-center gap-1.5 bg-[#1A1A1A] border-2 border-[#FFEB01] px-2.5 py-1 rounded-xl active:scale-95 transition-all shadow-md group"
              >
                <img src="/story-perro-real.png" alt="História #3" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-black uppercase text-[#FFEB01] font-mono whitespace-nowrap">#3 CON TODO! 🌭</span>
              </button>
            </div>
          )}

          {/* Grid Container inside Restaurant Menu Board */}
          <div
            ref={menuBoardRef}
            className="relative z-10 flex-1 p-3 lg:p-4 overflow-y-auto min-h-0 custom-scrollbar"
          >
            {totalCount === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-4 border-dashed border-amber-400/60 rounded-2xl bg-black/75">
                <div className="w-14 h-14 rounded-full bg-[#78350F]/80 border-2 border-amber-400 flex items-center justify-center mb-3 text-amber-300">
                  <Flame className="w-7 h-7 animate-bounce text-amber-400 fill-amber-400" />
                </div>
                <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wider mb-1 font-display">
                  O MENU ESTÁ A AGUARDAR PEDIDOS!
                </h3>
                <p className="text-xs text-amber-200/90 max-w-sm font-hand mb-4">
                  Aponta o telemóvel ao QR Code à esquerda e cria a tua combinação para apareceres aqui no Menu do Santa Salsa! 🌭
                </p>
              </div>
            ) : (
              <div className={`grid gap-3 pb-2 ${getGridClass(totalCount)}`}>
                {perros.map((perro: PerroRecord, idx: number) => {
                  const nivelLabel = getNivelCaracasLabel(perro.nivel_caracas);
                  const isFirst = idx === 0;

                  return (
                    <div
                      key={perro.id}
                      className={`bg-[#0F0F0F]/95 backdrop-brightness-75 border-3 rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_8px_0_#000] transition-all duration-300 ${isFirst
                        ? 'border-[#FFEB01] ring-4 ring-[#FFEB01]/40 animate-pop-in'
                        : 'border-zinc-900 hover:border-amber-500/60'
                        }`}
                    >
                      {/* Menu Item Header: NOVO badge on left if newest, % on right */}
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <div>
                          {isFirst && (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-[#DC2626] text-white animate-pulse shadow-sm">
                              NOVO!
                            </span>
                          )}
                        </div>

                        {/* Caracas Gauge Badge */}
                        <span
                          className={`text-xs font-black font-mono px-2.5 py-0.5 rounded-lg border-2 ${perro.nivel_caracas === 100
                            ? 'bg-red-950 border-red-500 text-red-400'
                            : perro.nivel_caracas === 0
                              ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                              : 'bg-zinc-950 border-amber-500 text-[#FFEB01]'
                            }`}
                        >
                          {perro.nivel_caracas}%
                        </span>
                      </div>

                      {/* Hot Dog Visualizer Showcase (Clean floating graphic) */}
                      <div className="my-1 flex justify-center py-2">
                        <HotDogVisualizer
                          selectedIngredients={perro.ingredientes}
                          size={totalCount === 1 ? 'md' : 'sm'}
                        />
                      </div>

                      {/* Caracas Level Title - BIG, BOLD & READABLE */}
                      <div className="text-center my-1">
                        <h4 className={`text-base sm:text-lg font-black uppercase font-display tracking-wide leading-tight ${nivelLabel.colorClass}`}>
                          {nivelLabel.title}
                        </h4>
                      </div>

                      {/* Sleek Ingredient Icon Badges Bar (Icons only with title tooltips) */}
                      <div className="flex flex-wrap justify-center gap-1.5 mt-2 min-h-[28px] items-center">
                        {perro.ingredientes.length === 0 ? (
                          <span className="text-[11px] text-zinc-400 italic font-mono bg-zinc-900/80 px-2.5 py-0.5 rounded-full border border-zinc-700">
                            Sem toppings (Simples)
                          </span>
                        ) : (
                          perro.ingredientes.map((ingId) => {
                            const def = INGREDIENTS.find((i) => i.id === ingId);
                            if (!def) return null;
                            return (
                              <div
                                key={ingId}
                                className={`p-1.5 rounded-xl border-2 flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${def.badgeBg} ${def.badgeBorder} ${def.badgeText}`}
                                title={def.name}
                              >
                                <IngredientIcon name={def.iconName} className="w-4 h-4" />
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3D FLOATING STORY CUTOUT CARDS ON RIGHT SIDE OF MENU BOARD (#1, #2, #3) - DESKTOP ONLY */}
          {showStoryDeck && (
            <div className="hidden lg:flex absolute inset-y-0 right-2 sm:right-6 z-30 pointer-events-none flex-col justify-between py-6">
              {/* IMAGE #1: SANTA SALSA BROOKLYN STOREFRONT (TOP RIGHT) */}
              <div
                onClick={() => setSelectedStoryIndex(0)}
                className="pointer-events-auto cursor-pointer transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.9)] animate-pop-in group"
                title="Clica para ler História #1"
              >
                <div className="relative">
                  <img
                    src="/story-storefront.png"
                    alt="#1 Santa Salsa Brooklyn Storefront"
                    className="w-32 sm:w-40 lg:w-48 object-contain"
                  />
                  {/* Floating Badge #1 */}
                  <div className="absolute top-1 left-1 bg-[#991B1B] text-[#FFEB01] border-2 border-[#FFEB01] px-2 py-0.5 rounded-lg shadow-lg flex items-center gap-1 font-mono text-[9px] font-black uppercase tracking-wider group-hover:bg-[#DC2626]">
                    <Sparkles className="w-2.5 h-2.5 animate-spin" />
                    <span>#1 BROOKLYN NYC</span>
                  </div>
                </div>
              </div>

              {/* IMAGE #2: FOUNDER HOLDING SKATEBOARDS (MIDDLE RIGHT) */}
              <div
                onClick={() => setSelectedStoryIndex(1)}
                className="pointer-events-auto cursor-pointer transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.9)] animate-pop-in group"
                title="Clica para ler História #2"
              >
                <div className="relative">
                  <img
                    src="/story-founder.png"
                    alt="#2 Sergio Leiva & Santa Salsa"
                    className="w-28 sm:w-36 lg:w-44 object-contain"
                  />
                  {/* Floating Badge #2 */}
                  <div className="absolute top-1 left-1 bg-[#991B1B] text-[#FFEB01] border-2 border-[#FFEB01] px-2 py-0.5 rounded-lg shadow-lg flex items-center gap-1 font-mono text-[9px] font-black uppercase tracking-wider group-hover:bg-[#DC2626]">
                    <Sparkles className="w-2.5 h-2.5 animate-spin" />
                    <span>#2 FUNDADOR</span>
                  </div>
                </div>
              </div>

              {/* IMAGE #3: REAL PERRO CALIENTES CON TODO (BOTTOM RIGHT) */}
              <div
                onClick={() => setSelectedStoryIndex(2)}
                className="pointer-events-auto cursor-pointer transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.9)] animate-pop-in group"
                title="Clica para ler História #3"
              >
                <div className="relative">
                  <img
                    src="/story-perro-real.png"
                    alt="#3 Real Perro Caliente Con Todo"
                    className="w-32 sm:w-40 lg:w-48 object-contain"
                  />
                  {/* Floating Badge #3 */}
                  <div className="absolute top-1 left-1 bg-[#991B1B] text-[#FFEB01] border-2 border-[#FFEB01] px-2 py-0.5 rounded-lg shadow-lg flex items-center gap-1 font-mono text-[9px] font-black uppercase tracking-wider group-hover:bg-[#DC2626]">
                    <Sparkles className="w-2.5 h-2.5 animate-spin" />
                    <span>#3 CON TODO! 🌭</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Board Footer Bar (Original Graphic Footer: Contains Meat / @santasalsastreet / Veg) */}
          <div className="relative z-10 bg-black/90 px-4 py-1.5 border-t-2 border-amber-400 flex flex-wrap justify-between items-center text-[10px] font-bold text-amber-300 font-mono flex-shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-amber-400 inline-block"></span>
              <span>Contains Meat / Con Todo</span>
            </span>

            <span className="text-white font-hand">@santasalsastreet</span>

            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 bg-emerald-400 inline-block"></span>
              <span>Vegetarian or Vegan Option</span>
            </span>
          </div>
        </main>
      </div>

      {/* STORY DETAIL PRESENTATION MODAL */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in"
          onClick={() => setSelectedStoryIndex(null)}
        >
          <div
            className="bg-[#1A1A1A] border-4 border-[#FFEB01] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_16px_0_#000] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedStoryIndex(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-black text-xl bg-[#0D0D0D] border-2 border-zinc-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md z-20"
            >
              ✕
            </button>

            {/* Modal Body */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Left Column: Big Story Image Frame */}
              <div className="sm:col-span-5 relative flex justify-center">
                <div className="p-2.5 bg-[#FDF6E2] rounded-2xl shadow-[0_8px_0_#000] border-4 border-zinc-950 transform -rotate-1 max-w-xs">
                  <img
                    src={selectedStory.image}
                    alt={selectedStory.title}
                    className="w-full h-56 sm:h-64 object-contain rounded-xl"
                  />
                  <div className="text-center mt-2">
                    <span className="text-xs font-black uppercase text-zinc-900 font-mono tracking-widest">
                      SANTA SALSA • {selectedStory.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Story Text Content */}
              <div className="sm:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#991B1B] border-2 border-[#FFEB01] text-[#FFEB01] text-xs font-black uppercase tracking-wider shadow-sm">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{selectedStory.badge}</span>
                </div>

                <h2 className="text-3xl font-black uppercase text-white tracking-wide font-display leading-tight">
                  {selectedStory.title}
                </h2>

                <p className="text-xs font-hand text-[#FFEB01]">
                  {selectedStory.subtitle}
                </p>

                {selectedStory.video ? (
                  <div className="rounded-xl border-2 border-[#FFEB01] overflow-hidden bg-black shadow-lg">
                    <video
                      src={selectedStory.video}
                      controls
                      playsInline
                      className="w-full max-h-56 object-contain mx-auto"
                    >
                      O seu navegador não suporta a reprodução de vídeo.
                    </video>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans bg-[#0D0D0D] p-3.5 rounded-xl border border-zinc-800">
                    {selectedStory.text}
                  </p>
                )}

                <div className="p-3 bg-[#78350F]/40 border-l-4 border-[#FFEB01] rounded-r-xl">
                  <p className="text-xs font-bold text-amber-200 italic font-mono">
                    "{selectedStory.highlight}"
                  </p>
                </div>
              </div>
            </div>

            {/* Story Modal Navigation Controls */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
              <button
                onClick={() =>
                  setSelectedStoryIndex((prev) =>
                    prev !== null ? (prev - 1 + STORY_MILESTONES.length) % STORY_MILESTONES.length : 0
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#0D0D0D] text-amber-300 hover:text-white border-2 border-zinc-800 text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="flex gap-1.5">
                {STORY_MILESTONES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedStoryIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${i === selectedStoryIndex ? 'bg-[#FFEB01] scale-125' : 'bg-zinc-700'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setSelectedStoryIndex((prev) =>
                    prev !== null ? (prev + 1) % STORY_MILESTONES.length : 0
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#DC2626] text-[#FFEB01] hover:bg-red-700 border-2 border-[#FFEB01] text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-[0_3px_0_#000]"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Giant QR Code Modal for Presentation Audience */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-[#1A1A1A] border-4 border-[#FFEB01] rounded-3xl max-w-md sm:max-w-lg w-full p-6 sm:p-8 text-center shadow-[0_12px_0_#000] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-black text-xl bg-[#0D0D0D] border-2 border-zinc-800 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#991B1B] border-2 border-[#FFEB01] text-[#FFEB01] text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>AUDIÊNCIA DO PITCH</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wide mb-1 font-display">
              APONTA O TELEMÓVEL
            </h2>
            <p className="text-sm font-hand text-[#FFEB01] mb-6">
              e adiciona o teu Perro ao vivo no menu do restaurante! 🌭🔥
            </p>

            {/* Giant 320px QR Code Board Frame */}
            <div className="p-6 bg-[#FDF6E2] rounded-3xl shadow-[0_8px_0_#000] border-4 border-zinc-950 inline-block mb-6 transform hover:scale-102 transition-transform">
              {appUrl && (
                <QRCodeSVG
                  value={appUrl}
                  size={320}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌭</text></svg>',
                    x: undefined,
                    y: undefined,
                    height: 50,
                    width: 50,
                    excavate: true
                  }}
                />
              )}
            </div>

            <div className="bg-[#0D0D0D] px-4 py-3 rounded-2xl border-2 border-[#FFEB01] text-sm font-mono text-[#FFEB01] break-all select-all font-black shadow-inner">
              {appUrl}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#DC2626] text-[#FFEB01] border-2 border-[#FFEB01] text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0_#000] hover:scale-105"
            >
              Fechar Ecrã
            </button>
          </div>
        </div>
      )}

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
