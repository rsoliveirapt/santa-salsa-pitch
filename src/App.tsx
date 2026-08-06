import { useState, useEffect } from 'react';
import { MobileView } from './views/MobileView';
import { PitchView } from './views/PitchView';
import { Smartphone, Tv, Layers, Eye, EyeOff, Database, Plus } from 'lucide-react';

export function App() {
  // Track current route based on window.location.pathname or state switcher
  const [currentRoute, setCurrentRoute] = useState<'mobile' | 'pitch'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.includes('/pitch') ? 'pitch' : 'mobile';
    }
    return 'mobile';
  });

  const [showNav, setShowNav] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  // Registered controls from PitchView
  const [pitchControls, setPitchControls] = useState<{
    simulate: () => void;
    openConfig: () => void;
    isConnected: boolean;
  } | null>(null);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      const isPitch = window.location.pathname.includes('/pitch');
      setCurrentRoute(isPitch ? 'pitch' : 'mobile');
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (route: 'mobile' | 'pitch') => {
    setCurrentRoute(route);
    const path = route === 'pitch' ? '/pitch' : '/';
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar ONLY shown on Pitch View */}
      {currentRoute === 'pitch' && showNav && (
        <nav className="bg-[#0D0D0D] border-b-4 border-[#991B1B] px-4 py-2 flex items-center justify-between text-xs select-none sticky top-0 z-40 shadow-xl">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-extrabold uppercase tracking-wider text-[#FFEB01] font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#DC2626]" />
              <span>SANTA SALSA NAV</span>
            </span>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-xl border-2 border-zinc-800">
              <button
                onClick={() => navigateTo('mobile')}
                className="px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (Audiência)</span>
              </button>

              <button
                onClick={() => navigateTo('pitch')}
                className="px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 bg-[#FFEB01] text-zinc-950 shadow-sm border border-zinc-950 font-black"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Pitch (Projetor / Wall)</span>
              </button>
            </div>

            {/* Badges & Simular Perro Button moved here to left navbar */}
            <div className="flex items-center gap-2 border-l-2 border-zinc-800 pl-3">
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#DC2626] border border-[#FFEB01] text-white shadow-sm">
                PITCH LIVE SCREEN
              </span>

              {pitchControls && (
                <>
                  <button
                    onClick={pitchControls.openConfig}
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border-2 flex items-center gap-1 transition-all ${
                      pitchControls.isConnected
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-400 hover:bg-emerald-900'
                        : 'bg-amber-950 border-amber-500 text-amber-300 hover:bg-amber-900'
                    }`}
                    title="Configurar Supabase Realtime"
                  >
                    <Database className="w-3 h-3" />
                    <span>{pitchControls.isConnected ? 'Supabase Connected' : 'Local Realtime Mode'}</span>
                  </button>

                  <button
                    onClick={pitchControls.simulate}
                    className="px-2.5 py-1 rounded-lg bg-[#DC2626] text-white border-2 border-[#FFEB01] hover:bg-red-700 transition-all flex items-center gap-1 text-xs font-black uppercase tracking-wider shadow-[0_2px_0_#000]"
                    title="Simular Novo Perro"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Simular Perro</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHeader((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1A1A1A] hover:bg-zinc-800 text-[#FFEB01] border-2 border-[#FFEB01] font-black transition-all shadow-sm"
              title={showHeader ? 'Ocultar Banner Superior' : 'Mostrar Banner Superior'}
            >
              {showHeader ? (
                <EyeOff className="w-3.5 h-3.5 text-[#DC2626]" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{showHeader ? 'Ocultar Banner' : 'Mostrar Banner'}</span>
            </button>

            <button
              onClick={() => setShowNav(false)}
              className="text-zinc-500 hover:text-zinc-300 text-[11px] font-bold"
              title="Esconder barra de navegação"
            >
              Ocultar
            </button>
          </div>
        </nav>
      )}

      {/* Floating Restore Navigation Button if navbar hidden on Pitch */}
      {currentRoute === 'pitch' && !showNav && (
        <button
          onClick={() => setShowNav(true)}
          className="fixed top-3 left-4 z-50 bg-[#1A1A1A] border-2 border-[#FFEB01] text-[#FFEB01] px-3 py-1 rounded-xl text-xs font-black shadow-2xl hover:bg-zinc-800 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>Restaurar Barra Nav</span>
        </button>
      )}

      {/* Render Current View */}
      <div className="flex-1">
        {currentRoute === 'mobile' ? (
          <MobileView />
        ) : (
          <PitchView
            onNavigateToMobile={() => navigateTo('mobile')}
            showHeader={showHeader}
            onToggleHeader={() => setShowHeader((prev) => !prev)}
            onRegisterControls={(controls) => setPitchControls(controls)}
          />
        )}
      </div>
    </div>
  );
}
