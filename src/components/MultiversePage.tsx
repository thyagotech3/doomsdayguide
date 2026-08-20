import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Zap, 
  Layers
} from 'lucide-react';
import { MULTIVERSE_LORE } from '../data/marvelData';
import { MultiverseConcept, PageTab } from '../types';
import { sound } from '../utils/audio';
import { IncursionSimulator } from './IncursionSimulator';

interface MultiversePageProps {
  onSelectTab?: (tab: PageTab) => void;
}

export const MultiversePage: React.FC<MultiversePageProps> = () => {
  const [selectedConcept, setSelectedConcept] = useState<MultiverseConcept>(MULTIVERSE_LORE[0]);

  return (
    <div className="w-full flex flex-col items-center pb-28 pt-2 px-3 sm:px-4 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between py-2 text-slate-300 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-100">
              MULTIVERSO & INCURSÕES
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              Regras cósmicas, aproximação de mundos e o colapso das realidades
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Incursion Interactive Simulator */}
      <IncursionSimulator />

      {/* Multiverse Core Rules & Lore Cards */}
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 self-start mb-3 flex items-center gap-2">
        <Layers className="w-4 h-4 text-emerald-400" />
        CONCEITOS VITAIS PARA ENTENDER DOOMSDAY
      </h3>

      <div className="w-full space-y-3">
        {MULTIVERSE_LORE.map((concept) => {
          const isSelected = selectedConcept.id === concept.id;
          return (
            <motion.div
              key={concept.id}
              layout
              onClick={() => {
                sound.playClick();
                setSelectedConcept(concept);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                isSelected
                  ? 'bg-[#03060a]/95 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-[#03060a]/70 border-slate-800/80 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span className="text-emerald-400 font-mono font-bold">•</span>
                    {concept.title}
                  </h4>
                  <p className="text-xs text-emerald-400/90 font-mono mt-0.5">
                    {concept.subtitle}
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#020306] text-slate-400 border border-slate-800">
                  {concept.mcuFirstSeen.split('(')[0]}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
                {concept.description}
              </p>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-3 border-t border-slate-800/80 space-y-2.5 text-xs"
                >
                  <div className="p-2.5 rounded-xl bg-[#020306] border border-slate-800">
                    <span className="font-mono font-bold text-slate-400 uppercase text-[10px] block mb-1">
                      Regra Fundamental da Física Dimensional:
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      {concept.rule}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                    <span className="font-mono font-bold text-emerald-400 uppercase text-[10px] block mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Como o Doutor Destino Usará Isso em Doomsday:
                    </span>
                    <p className="text-emerald-100 text-[11px]">
                      {concept.threatForDoomsday}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
