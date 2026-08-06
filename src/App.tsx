import { useState, useEffect } from 'react';
import { MobileView } from './views/MobileView';
import { PitchView } from './views/PitchView';
import { Smartphone, Tv, Layers, Eye, EyeOff } from 'lucide-react';

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
          <div className="flex items-center gap-3">
            <span className="font-extrabold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
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
                className="px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 bg-[#F59E0B] text-zinc-950 shadow-sm border border-zinc-950 font-black"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Pitch (Projetor / Wall)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Replace "Abrir Pitch em Novo Separador" with "Mostrar / Ocultar Banner" button directly inside navbar */}
            <button
              onClick={() => setShowHeader((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1A1A1A] hover:bg-zinc-800 text-amber-400 border-2 border-amber-500/60 font-black transition-all shadow-sm"
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
          className="fixed top-3 left-4 z-50 bg-[#1A1A1A] border-2 border-amber-400 text-amber-400 px-3 py-1 rounded-xl text-xs font-black shadow-2xl hover:bg-zinc-800 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-all"
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
          />
        )}
      </div>
    </div>
  );
}
