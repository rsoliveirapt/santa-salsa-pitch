import { useState, useEffect } from 'react';
import { MobileView } from './views/MobileView';
import { PitchView } from './views/PitchView';
import { Smartphone, Tv, ExternalLink, Layers } from 'lucide-react';

export function App() {
  // Track current route based on window.location.pathname or state switcher
  const [currentRoute, setCurrentRoute] = useState<'mobile' | 'pitch'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.includes('/pitch') ? 'pitch' : 'mobile';
    }
    return 'mobile';
  });

  const [showNav, setShowNav] = useState(true);

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

  const openPitchInNewTab = () => {
    const pitchUrl = `${window.location.origin}/pitch`;
    window.open(pitchUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col font-sans">
      {/* Top Route Switcher Banner for Easy Presenter Testing */}
      {showNav && (
        <nav className="bg-zinc-950 border-b border-zinc-800/80 px-4 py-2 flex items-center justify-between text-xs select-none sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-3">
            <span className="font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Santa Salsa Navigation</span>
            </span>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                onClick={() => navigateTo('mobile')}
                className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                  currentRoute === 'mobile'
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (Audiência)</span>
              </button>

              <button
                onClick={() => navigateTo('pitch')}
                className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                  currentRoute === 'pitch'
                    ? 'bg-gradient-to-r from-[#E50914] to-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Pitch (Projetor / Wall)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openPitchInNewTab}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 font-bold transition-colors"
            >
              <span>Abrir Pitch em Novo Separador</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            <button
              onClick={() => setShowNav(false)}
              className="text-zinc-500 hover:text-zinc-300 text-[11px]"
              title="Esconder barra de navegação"
            >
              Ocultar
            </button>
          </div>
        </nav>
      )}

      {/* Floating Restore Navigation Button if hidden */}
      {!showNav && (
        <button
          onClick={() => setShowNav(true)}
          className="fixed top-3 right-3 z-50 bg-zinc-900/90 border border-zinc-700 text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold shadow-xl hover:bg-zinc-800 flex items-center gap-1"
        >
          <Layers className="w-3 h-3 text-[#E50914]" />
          <span>Nav</span>
        </button>
      )}

      {/* Render Current View */}
      <div className="flex-1">
        {currentRoute === 'mobile' ? (
          <MobileView onNavigateToPitch={() => navigateTo('pitch')} />
        ) : (
          <PitchView onNavigateToMobile={() => navigateTo('mobile')} />
        )}
      </div>
    </div>
  );
}
