import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Check,
  Send,
  RotateCcw,
  Smartphone,
  Tv,
  ExternalLink
} from 'lucide-react';
import { HotDogVisualizer } from '../components/HotDogVisualizer';
import { IngredientIcon } from '../components/IngredientIcons';
import {
  INGREDIENTS,
  calculateNivelCaracas,
  getNivelCaracasLabel,
  type IngredientDefinition
} from '../types/hotdog';
import { getSupabaseClient, localBroadcast } from '../lib/supabase';
import { soundFx } from '../utils/audio';

interface MobileViewProps {
  onNavigateToPitch?: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({ onNavigateToPitch }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['cabbage', 'queso_blanco', 'papas_fosforito']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nivelCaracas = calculateNivelCaracas(selectedIngredients);
  const nivelInfo = getNivelCaracasLabel(nivelCaracas);

  // Toggle ingredient selection
  const toggleIngredient = (id: string) => {
    soundFx.playPop();
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all or reset
  const handleSelectAll = () => {
    soundFx.playPop();
    setSelectedIngredients(INGREDIENTS.map((i) => i.id));
  };

  const handleClearAll = () => {
    soundFx.playPop();
    setSelectedIngredients([]);
  };

  // Submit hot dog to Supabase / Realtime
  const handleSubmit = async () => {
    if (selectedIngredients.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    soundFx.playSuccess();

    const recordData = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `perro-${Date.now()}`,
      ingredientes: selectedIngredients,
      nivel_caracas: nivelCaracas,
      criado_em: new Date().toISOString()
    };

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('cachorros_pitch').insert([
          {
            ingredientes: selectedIngredients,
            nivel_caracas: nivelCaracas,
            criado_em: recordData.criado_em
          }
        ]);
        if (error) {
          console.warn('Supabase insert error, falling back to local sync:', error);
        }
      }

      // Always send local broadcast fallback so dual tab preview syncs immediately
      if (localBroadcast) {
        localBroadcast.postMessage({
          type: 'NEW_PERRO',
          payload: recordData
        });
      }

      // Also persist to localStorage array for persistence in demo mode
      const existingStr = localStorage.getItem('SANTA_SALSA_PERROS_DB') || '[]';
      try {
        const existing = JSON.parse(existingStr);
        existing.unshift(recordData);
        localStorage.setItem('SANTA_SALSA_PERROS_DB', JSON.stringify(existing.slice(0, 100)));
      } catch {
        localStorage.setItem('SANTA_SALSA_PERROS_DB', JSON.stringify([recordData]));
      }

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E50914', '#FFC107', '#4E9F3D', '#FFFFFF', '#EC4899']
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting perro:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset for creating another hot dog
  const handleCreateAnother = () => {
    setIsSubmitted(false);
    setSelectedIngredients(['cabbage', 'queso_blanco', 'papas_fosforito']);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#121212] text-slate-100 flex flex-col justify-between pb-8 px-4 relative">
      {/* Header Banner */}
      <header className="pt-5 pb-3 text-center border-b border-zinc-800/80 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Audiência — Telemóvel</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-2">
          <span className="text-[#E50914]">Santa Salsa</span> Brooklyn
        </h1>
        <p className="text-sm font-medium text-amber-400/90 font-hand tracking-wide">
          Cria o teu Perro Con Todo 🌭🔥
        </p>
      </header>

      {/* Confirmation Screen Modal when Submitted */}
      {isSubmitted ? (
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-pop-in py-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E50914] to-amber-400 p-1 mb-6 animate-bounce shadow-2xl">
            <div className="w-full h-full bg-[#121212] rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
            ¡Perro no Ar! 🎉
          </h2>

          <div className="bg-zinc-900/90 border-2 border-emerald-500/50 rounded-2xl p-6 mb-6 shadow-xl w-full max-w-sm neon-glow-green">
            <p className="text-emerald-400 font-bold text-lg mb-4">
              O teu Perro já está no ecrã do Pitch!
            </p>

            <div className="my-4">
              <HotDogVisualizer selectedIngredients={selectedIngredients} size="md" />
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center text-sm">
              <span className="text-zinc-400 font-medium">Nível Caracas:</span>
              <span className={`font-black text-base ${nivelInfo.colorClass}`}>
                {nivelCaracas}% — {nivelInfo.title}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={handleCreateAnother}
              className="w-full py-4 px-6 rounded-xl font-black text-lg bg-gradient-to-r from-[#E50914] via-amber-500 to-[#FFC107] text-zinc-950 uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Criar Outro Perro 🌭</span>
            </button>

            {onNavigateToPitch && (
              <button
                onClick={onNavigateToPitch}
                className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <Tv className="w-4 h-4 text-amber-400" />
                <span>Ver Ecrã do Pitch (/pitch)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}
          </div>
        </main>
      ) : (
        /* Main Hot Dog Builder Form */
        <main className="flex-1 flex flex-col justify-between gap-4">
          {/* Dynamic Visual Hot Dog Display */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-3 left-3 text-xs font-mono text-zinc-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE PREVIEW</span>
            </div>

            <div className="my-2 py-2">
              <HotDogVisualizer selectedIngredients={selectedIngredients} size="lg" />
            </div>

            {/* Quick Actions (Con Todo / Limpar) */}
            <div className="w-full flex justify-between items-center pt-2 border-t border-zinc-800/60 text-xs">
              <button
                onClick={handleClearAll}
                className="text-zinc-400 hover:text-zinc-200 transition-colors font-medium"
              >
                Limpar
              </button>
              <button
                onClick={handleSelectAll}
                className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Con Todo! (Todos)</span>
              </button>
            </div>
          </div>

          {/* Progress Bar ("Nível Caracas") */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-lg">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-zinc-400">
                  Medidor de Sabor
                </span>
                <h3 className={`text-base font-black uppercase ${nivelInfo.colorClass}`}>
                  {nivelInfo.title}
                </h3>
              </div>
              <span className="text-2xl font-black text-white font-mono">{nivelCaracas}%</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#E50914] rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${nivelCaracas}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-2 italic font-light">{nivelInfo.subtitle}</p>
          </div>

          {/* Ingredient Toggle Panel (6 Buttons) */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-1">
              <span>Selecciona os teus Ingredientes</span>
              <span className="text-amber-400 font-normal">({selectedIngredients.length}/6)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {INGREDIENTS.map((ing: IngredientDefinition) => {
                const isSelected = selectedIngredients.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => toggleIngredient(ing.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? `${ing.badgeBg} ${ing.badgeBorder} shadow-lg ring-1 ring-amber-400/30`
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/60 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSelected ? ing.badgeText : 'text-zinc-500'
                        }`}
                      >
                        <IngredientIcon name={ing.iconName} className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p
                          className={`text-xs font-bold truncate leading-tight ${
                            isSelected ? 'text-white' : 'text-zinc-300'
                          }`}
                        >
                          {ing.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate leading-tight">
                          {ing.nameEn}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 font-bold scale-100'
                          : 'border border-zinc-700 bg-zinc-950/40 scale-90'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Send Action CTA Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={selectedIngredients.length === 0 || isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-black text-lg uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                selectedIngredients.length > 0
                  ? 'bg-gradient-to-r from-[#E50914] via-amber-500 to-[#FFC107] text-zinc-950 hover:brightness-110 active:scale-98 cursor-pointer neon-glow-yellow'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 stroke-[2.5]" />
                  <span>Enviar para o Pitch</span>
                </>
              )}
            </button>
          </div>
        </main>
      )}
    </div>
  );
};
