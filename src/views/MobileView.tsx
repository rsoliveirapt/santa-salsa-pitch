import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Check,
  Send,
  RotateCcw
} from 'lucide-react';
import { HotDogVisualizer } from '../components/HotDogVisualizer';
import { IngredientIcon } from '../components/IngredientIcons';
import { VenueHeaderDecor } from '../components/VenueHeaderDecor';
import {
  INGREDIENTS,
  calculateNivelCaracas,
  getNivelCaracasLabel,
  type IngredientDefinition
} from '../types/hotdog';
import { getSupabaseClient, localBroadcast } from '../lib/supabase';
import { soundFx } from '../utils/audio';

export const MobileView: React.FC = () => {
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
    if (isSubmitting) return;

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
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#F59E0B', '#16A34A', '#FDF6E2', '#EC4899']
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
    <div className="max-w-md mx-auto min-h-screen bg-[#0F0F0F] text-slate-100 flex flex-col justify-between pb-8 px-4 relative select-none">
      {/* Physical Venue Header Decorator (Red Ceiling, String Lights, Surfboard Sign) */}
      <VenueHeaderDecor subtitle="Cria o teu Perro Con Todo 🌭🔥" />

      {/* Confirmation Screen Modal when Submitted */}
      {isSubmitted ? (
        <main className="flex-1 flex flex-col items-center justify-center text-center px-2 animate-pop-in py-4">
          <div className="w-20 h-20 bg-[#DC2626] border-4 border-amber-400 p-1 mb-6 animate-bounce shadow-[0_8px_0_#000]">
            <div className="w-full h-full bg-[#0F0F0F] flex items-center justify-center">
              <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2 font-display">
            ¡PERRO NO AR! 🎉
          </h2>

          <div className="bg-[#1A1A1A] border-4 border-emerald-500 p-6 mb-6 shadow-[0_8px_0_#000] w-full max-w-sm">
            <p className="text-emerald-400 font-black text-lg mb-4 uppercase tracking-wide">
              O TEU PERRO JÁ ESTÁ NO ECRÃ DO PITCH!
            </p>

            <div className="my-4 bg-[#0D0D0D] p-3 border-2 border-zinc-800">
              <HotDogVisualizer selectedIngredients={selectedIngredients} size="md" />
            </div>

            <div className="mt-4 pt-4 border-t-2 border-zinc-800 flex justify-between items-center text-sm">
              <span className="text-zinc-400 font-bold uppercase text-xs">Nível Caracas:</span>
              <span className={`font-black text-base ${nivelInfo.colorClass}`}>
                {nivelCaracas}% — {nivelInfo.title}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={handleCreateAnother}
              className="w-full py-4 px-6 font-black text-lg bg-[#F59E0B] text-zinc-950 border-4 border-zinc-950 uppercase tracking-wider shadow-[0_6px_0_#78350F] hover:bg-amber-400 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>Criar Outro Perro 🌭</span>
            </button>
          </div>

        </main>
      ) : (
        /* Main Hot Dog Builder Form */
        <main className="flex-1 flex flex-col justify-between gap-4">
          {/* Dynamic Visual Hot Dog Display Frame */}
          <div className="bg-[#1A1A1A] border-4 border-amber-500 p-4 flex flex-col items-center justify-center relative shadow-[0_8px_0_#000]">
            <div className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-[#991B1B] text-amber-300 px-2 py-0.5 border border-amber-400/60 flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-400 animate-pulse"></span>
              <span>LIVE PREVIEW</span>
            </div>

            <div className="my-2 py-2">
              <HotDogVisualizer selectedIngredients={selectedIngredients} size="lg" />
            </div>

            {/* Quick Actions (Con Todo / Limpar) */}
            <div className="w-full flex justify-between items-center pt-3 border-t-2 border-zinc-800 text-xs">
              <button
                onClick={handleClearAll}
                className="text-zinc-400 hover:text-white font-bold uppercase tracking-wider text-[11px] underline underline-offset-4"
              >
                Limpar Tudo
              </button>
              <button
                onClick={handleSelectAll}
                className="bg-[#DC2626] text-white px-3 py-1.5 border-2 border-amber-400 font-black text-xs uppercase tracking-wider flex items-center gap-1 hover:bg-red-700 active:scale-95 transition-all shadow-[0_4px_0_#000]"
              >
                <Flame className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span>Con Todo! (Todos)</span>
              </button>
            </div>
          </div>

          {/* Progress Bar ("Nível Caracas") */}
          <div className="bg-[#1A1A1A] border-3 border-zinc-800 p-4 shadow-[0_6px_0_#000]">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400">
                  MEDIDOR DE SABOR
                </span>
                <h3 className={`text-base font-black uppercase font-display ${nivelInfo.colorClass}`}>
                  {nivelInfo.title}
                </h3>
              </div>
              <span className="text-2xl font-black text-amber-400 font-mono">{nivelCaracas}%</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-3.5 bg-[#0D0D0D] overflow-hidden p-0.5 border-2 border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#DC2626] transition-all duration-500 ease-out"
                style={{ width: `${nivelCaracas}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-2 italic font-light">{nivelInfo.subtitle}</p>
          </div>

          {/* Ingredient Toggle Panel (6 Buttons inspired by storefront menu stack) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">
                INGREDIENTES DISPONÍVEIS
              </h3>
              <span className="text-xs font-bold text-zinc-400 font-mono">
                ({selectedIngredients.length}/6)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {INGREDIENTS.map((ing: IngredientDefinition) => {
                const isSelected = selectedIngredients.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => toggleIngredient(ing.id)}
                    className={`p-3 border-3 text-left flex items-center justify-between transition-all duration-150 active:translate-y-0.5 ${
                      isSelected
                        ? 'bg-[#1A1A1A] border-amber-400 shadow-[0_4px_0_#F59E0B] text-white'
                        : 'bg-[#141414] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div
                        className={`p-1.5 font-bold ${
                          isSelected ? ing.badgeText : 'text-zinc-500'
                        }`}
                      >
                        <IngredientIcon name={ing.iconName} className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p
                          className={`text-xs font-bold truncate leading-tight ${
                            isSelected ? 'text-amber-300' : 'text-zinc-300'
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
                      className={`w-5 h-5 border-2 flex items-center justify-center font-bold transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400 text-zinc-950 scale-100'
                          : 'border-zinc-700 bg-zinc-900 scale-90'
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
              disabled={isSubmitting}
              className={`w-full py-4 px-6 font-black text-xl uppercase tracking-wider font-display transition-all duration-200 flex items-center justify-center gap-3 ${
                !isSubmitting
                  ? 'bg-[#DC2626] text-white border-4 border-amber-400 shadow-[0_6px_0_#78350F] hover:bg-red-600 active:translate-y-1 active:shadow-none cursor-pointer'
                  : 'bg-zinc-800 text-zinc-600 border-2 border-zinc-700 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <Send className="w-6 h-6 stroke-[2.5]" />
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
