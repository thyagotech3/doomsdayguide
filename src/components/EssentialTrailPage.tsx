import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowDown, 
  CheckCircle, 
  Circle, 
  Sparkles, 
  Clock, 
  Flame, 
  ShieldCheck,
  ChevronDown,
  Layers,
  Zap,
  Filter,
  Film,
  Tv,
  Calendar,
  Compass,
  Info,
  RotateCcw
} from 'lucide-react';
import { DoomMaskEmblem } from './DoomMaskEmblem';
import { CountdownCard } from './CountdownCard';
import { 
  MCU_CATALOG, 
  FAST_DOOMSDAY_TRAIL_IDS, 
  ESSENTIAL_DOOMSDAY_TRAIL_IDS 
} from '../data/marvelData';
import { MCUItem, PageTab, TrailMode } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface EssentialTrailPageProps {
  onSelectTab: (tab: PageTab) => void;
  watchedIds: string[];
  onToggleWatched: (id: string) => void;
  onResetProgress?: () => void;
}

const TRAIL_MODES: {
  id: TrailMode;
  name: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  subtitle: string;
}[] = [
  {
    id: 'rapida',
    name: 'TRILHA RÁPIDA',
    badge: '8 OBRAS CRUCIAIS',
    icon: Zap,
    description: 'Somente os filmes e séries mais indispensáveis para entender a ascensão do Dr. Destino e o colapso multiversal no menor tempo possível.',
    subtitle: 'Direto ao ponto para entender Doomsday'
  },
  {
    id: 'essencial',
    name: 'TRILHA ESSENCIAL',
    badge: 'LISTA OFICIAL DISNEY+',
    icon: Sparkles,
    description: 'A lista oficial e definitiva da Disney com todas as Incursões, TVA, Mutantes Fox, Guerra Infinita e o caminho para o Mundo Bélico.',
    subtitle: 'Lista oficial Disney+: do legado Fox a Doomsday'
  },
  {
    id: 'completa',
    name: 'TRILHA COMPLETA',
    badge: 'UNIVERSO MCU (49 OBRAS)',
    icon: Layers,
    description: 'Todos os filmes e séries do MCU em ordem cronológica dos acontecimentos, organizados e divididos em Fases.',
    subtitle: 'Todos os filmes e séries em ordem cronológica por Fases'
  }
];

const PHASE_METADATA: Record<number, { title: string; subtitle: string; period: string }> = {
  0: { title: 'Multiverso Fox / Legado', subtitle: 'Conexão Mutante com o MCU', period: '2000 - 2003' },
  1: { title: 'Fase 1: O Início dos Heróis', subtitle: 'A Formação dos Vingadores', period: '1942 - 2012' },
  2: { title: 'Fase 2: Expansão do Universo', subtitle: 'A Queda da S.H.I.E.L.D. e Novas Fronteiras', period: '2013 - 2015' },
  3: { title: 'Fase 3: A Saga do Infinito', subtitle: 'Guerra Civil, As Joias e o Estalo', period: '2016 - 2023' },
  4: { title: 'Fase 4: O Despertar do Multiverso', subtitle: 'Rupturas Dimensionais, TVA e Incursões', period: '2021 - 2025' },
  5: { title: 'Fase 5: A Crise Dimensional', subtitle: 'Conselho dos Kangs e Colapso das Âncoras', period: '2023 - 2026' },
  6: { title: 'Fase 6: Doomsday & Guerras Secretas', subtitle: 'A Incursão Final e o Battleworld', period: '2025 - 2026+' }
};

export const EssentialTrailPage: React.FC<EssentialTrailPageProps> = ({
  watchedIds,
  onToggleWatched,
  onResetProgress
}) => {
  const trailRef = useRef<HTMLDivElement>(null);
  const [trailMode, setTrailMode] = useState<TrailMode>('essencial');
  const [selectedMovie, setSelectedMovie] = useState<MCUItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unwatched'>('all');
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'series'>('all');

  const currentModeIndex = TRAIL_MODES.findIndex(m => m.id === trailMode);
  const currentMode = TRAIL_MODES[currentModeIndex] || TRAIL_MODES[0];

  const handlePrevMode = () => {
    sound.playClick();
    const nextIdx = (currentModeIndex - 1 + TRAIL_MODES.length) % TRAIL_MODES.length;
    setTrailMode(TRAIL_MODES[nextIdx].id);
    setPhaseFilter('all');
  };

  const handleNextMode = () => {
    sound.playClick();
    const nextIdx = (currentModeIndex + 1) % TRAIL_MODES.length;
    setTrailMode(TRAIL_MODES[nextIdx].id);
    setPhaseFilter('all');
  };

  // Get active items according to mode
  const currentItems = useMemo(() => {
    let items: MCUItem[] = [];
    if (trailMode === 'rapida') {
      items = FAST_DOOMSDAY_TRAIL_IDS
        .map(id => MCU_CATALOG.find(item => item.id === id))
        .filter((item): item is MCUItem => Boolean(item));
    } else if (trailMode === 'essencial') {
      items = ESSENTIAL_DOOMSDAY_TRAIL_IDS
        .map(id => MCU_CATALOG.find(item => item.id === id))
        .filter((item): item is MCUItem => Boolean(item));
    } else {
      // Completa: Sorted strictly by chronologicalOrder
      items = [...MCU_CATALOG].sort((a, b) => (a.chronologicalOrder || 0) - (b.chronologicalOrder || 0));
    }
    return items;
  }, [trailMode]);

  // Watched stats
  const watchedCount = currentItems.filter(item => watchedIds.includes(item.id)).length;
  const progressPercent = currentItems.length > 0 ? Math.round((watchedCount / currentItems.length) * 100) : 0;
  const totalMinutes = currentItems.reduce((acc, curr) => acc + curr.runtimeMinutes, 0);
  const totalHours = Math.round(totalMinutes / 60);

  const handleStartJourney = () => {
    sound.playDoomWoosh();
    if (trailRef.current) {
      trailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    onToggleWatched(id);

    const willBeWatched = !watchedIds.includes(id);
    if (willBeWatched) {
      sound.playSuccess();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#cbd5e1', '#e2e8f0']
      });
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return currentItems.filter(item => {
      if (statusFilter === 'unwatched' && watchedIds.includes(item.id)) return false;
      if (phaseFilter !== 'all' && item.phase !== phaseFilter) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      return true;
    });
  }, [currentItems, statusFilter, phaseFilter, typeFilter, watchedIds]);

  // Group items by phase for Complete trail
  const groupedByPhase = useMemo(() => {
    if (trailMode !== 'completa') return null;
    const groups: { phase: number; metadata: { title: string; subtitle: string; period: string }; items: MCUItem[] }[] = [];
    
    // Group in order 1, 2, 3, 4, 5, 6, 0 (or 0 first)
    const phases = [0, 1, 2, 3, 4, 5, 6];
    phases.forEach(phaseNum => {
      const items = filteredItems.filter(item => item.phase === phaseNum);
      if (items.length > 0) {
        groups.push({
          phase: phaseNum,
          metadata: PHASE_METADATA[phaseNum] || { title: `Fase ${phaseNum}`, subtitle: '', period: '' },
          items
        });
      }
    });
    return groups;
  }, [trailMode, filteredItems]);

  return (
    <div className="w-full flex flex-col items-center pb-28 pt-1 px-3 sm:px-4 max-w-2xl mx-auto">
      
      {/* Hero Circular Center Piece - Ultra Compact & Optimized for Mobile Viewport */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col items-center justify-center my-1 sm:my-2 text-center"
      >
        <DoomMaskEmblem onInteract={() => sound.playArcanePulse()} />

        {/* INTERACTIVE TRAIL SELECTOR WITH LEFT AND RIGHT ARROWS */}
        <div className="w-full max-w-md mt-2 px-1">
          <div className="bg-[#03060a]/95 border-2 border-emerald-500/40 rounded-2xl p-2.5 sm:p-3 shadow-[0_0_20px_rgba(0,0,0,0.7)] backdrop-blur-md">
            
            {/* Navigation selector with Arrows */}
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={handlePrevMode}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#06080d] hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all active:scale-90 cursor-pointer group shadow-sm shrink-0"
                id="btn-prev-trail-mode"
                aria-label="Trilha Anterior"
                title="Ver trilha anterior"
              >
                <ChevronLeft className="w-5 h-5 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMode.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center flex-1 px-1 text-center"
                >
                  <div className="flex items-center gap-1.5 justify-center mb-0.5">
                    <currentMode.icon className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {currentMode.badge}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                    {currentMode.name}
                  </h2>
                  <p className="text-[10.5px] text-slate-400 line-clamp-1 font-mono mt-0.5">
                    {currentMode.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={handleNextMode}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#06080d] hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all active:scale-90 cursor-pointer group shadow-sm shrink-0"
                id="btn-next-trail-mode"
                aria-label="Próxima Trilha"
                title="Ver próxima trilha"
              >
                <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Quick 3 Mode Selector Pills */}
            <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-slate-800/80">
              {TRAIL_MODES.map((m) => {
                const isSelected = trailMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      sound.playClick();
                      setTrailMode(m.id);
                      setPhaseFilter('all');
                    }}
                    className={`py-1 px-1 rounded-lg text-[9.5px] font-mono font-bold tracking-wider uppercase transition-all truncate ${
                      isSelected
                        ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                        : 'bg-[#020306] text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {m.id === 'rapida' ? '⚡ Rápida' : m.id === 'essencial' ? '✨ Essencial Disney' : '📚 Completa (Fases)'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start Journey Call to Action Button - 100% visible on initial mobile fold */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStartJourney}
          className="mt-2.5 sm:mt-3 w-full max-w-sm py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-widest text-black flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.6)] transition-all cursor-pointer uppercase touch-manipulation group"
          id="btn-start-journey"
        >
          <span>COMEÇAR JORNADA</span>
          <ArrowDown className="w-4 h-4 text-black stroke-[3] group-hover:translate-y-0.5 transition-transform" />
        </motion.button>

        {/* Quick Stats Pill */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-slate-300">
          <div className="px-2.5 py-1 rounded-full bg-[#06090e] border border-slate-800 flex items-center gap-1.5 shadow-sm">
            <Flame className="w-3 h-3 text-emerald-400" />
            <span className="font-mono">{currentItems.length} Obras</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#06090e] border border-slate-800 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="font-mono">~{totalHours}h</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#06090e] border border-emerald-900/80 text-emerald-300 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="font-mono">{watchedCount}/{currentItems.length} ({progressPercent}%)</span>
          </div>
        </div>
      </motion.div>

      {/* Official Brazil Countdown Banner */}
      <div className="w-full my-1.5">
        <CountdownCard compact />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#04060a]/90 border border-slate-800/80 rounded-2xl p-3 my-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Progresso da {currentMode.name}
          </span>
          <div className="flex items-center gap-2">
            {watchedCount > 0 && onResetProgress && (
              <button
                onClick={() => {
                  sound.playClick();
                  onResetProgress();
                }}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-[9.5px] font-mono text-slate-400 hover:text-red-300 flex items-center gap-1 transition-all touch-manipulation cursor-pointer"
                title="Zerar status de progresso salvo"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Zerar</span>
              </button>
            )}
            <span className="text-emerald-400 font-mono font-bold">{progressPercent}%</span>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/90">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
          />
        </div>
      </div>

      {/* Anchor Section: The Timeline */}
      <div ref={trailRef} id="trilha-ancora" className="w-full pt-2">
        
        {/* Header with Title and Filter Controls */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                {trailMode === 'completa' ? 'Ordem Cronológica por Fases' : 'Ordem da Trilha'} ({filteredItems.length})
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentMode.subtitle}
              </p>
            </div>

            {/* Quick Status Filter */}
            <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10.5px]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  statusFilter === 'all'
                    ? 'bg-emerald-600 text-black font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos ({currentItems.length})
              </button>
              <button
                onClick={() => setStatusFilter('unwatched')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  statusFilter === 'unwatched'
                    ? 'bg-emerald-600 text-black font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pendentes ({currentItems.length - watchedCount})
              </button>
            </div>
          </div>

          {/* Phase Filter Tabs (Specifically for Completa mode or any mode) */}
          {trailMode === 'completa' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1 no-scrollbar text-[10px]">
              <span className="text-slate-500 font-mono uppercase text-[9px] mr-1 shrink-0">Fase:</span>
              <button
                onClick={() => setPhaseFilter('all')}
                className={`px-2 py-1 rounded-lg font-mono font-bold shrink-0 transition-all ${
                  phaseFilter === 'all'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'bg-[#06080d] text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                Todas
              </button>
              {[0, 1, 2, 3, 4, 5, 6].map((p) => (
                <button
                  key={p}
                  onClick={() => setPhaseFilter(p)}
                  className={`px-2 py-1 rounded-lg font-mono font-bold shrink-0 transition-all ${
                    phaseFilter === p
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'bg-[#06080d] text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {p === 0 ? 'Legado Fox' : `Fase ${p}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* TIMELINE STREAM WITH MINIMIZED CARDS (KEY PHRASE ONLY)   */}
        {/* ======================================================== */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500/30 space-y-3 sm:space-y-4">
          
          {trailMode === 'completa' && groupedByPhase && phaseFilter === 'all' ? (
            // Render Grouped by Phases
            groupedByPhase.map((group) => (
              <div key={group.phase} className="space-y-3 pt-2 first:pt-0">
                {/* Phase Header Divider */}
                <div className="relative -ml-6 sm:-ml-8 my-3">
                  <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-950/80 via-[#060b10] to-[#020306] border border-emerald-500/30 flex items-center justify-between shadow-md">
                    <div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {group.metadata.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {group.metadata.subtitle} • <span className="text-slate-300">{group.metadata.period}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      {group.items.length} obras
                    </span>
                  </div>
                </div>

                {/* Phase items */}
                {group.items.map((item, index) => (
                  <TimelineCard
                    key={item.id}
                    item={item}
                    index={index}
                    isWatched={watchedIds.includes(item.id)}
                    onToggle={handleToggle}
                    onSelect={() => setSelectedMovie(item)}
                  />
                ))}
              </div>
            ))
          ) : (
            // Render Flat list for Rapida, Essencial, or single Phase filtered
            filteredItems.map((item, index) => (
              <TimelineCard
                key={item.id}
                item={item}
                index={index}
                isWatched={watchedIds.includes(item.id)}
                onToggle={handleToggle}
                onSelect={() => setSelectedMovie(item)}
              />
            ))
          )}

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL DETALHADO DO FILME/SÉRIE AO CLICAR NO CARD          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4"
            onClick={() => setSelectedMovie(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#03060a] border border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_30px_rgba(16,185,129,0.25)] max-h-[85vh] overflow-y-auto text-slate-200 space-y-3.5"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-slate-900 border border-slate-800">{selectedMovie.posterEmoji}</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {selectedMovie.title}
                    </h3>
                    <p className="text-xs text-slate-400 italic font-mono">
                      {selectedMovie.originalTitle} ({selectedMovie.releaseYear})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Status and metadata */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  {selectedMovie.phase === 0 ? 'Legado Fox' : `Fase ${selectedMovie.phase}`}
                </span>
                {selectedMovie.timelinePeriod && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                    Linha: {selectedMovie.timelinePeriod}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  {selectedMovie.type === 'movie' ? 'Filme' : 'Série'} • {selectedMovie.runtimeMinutes} min
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  {selectedMovie.streaming}
                </span>
              </div>

              {/* Frase Chave */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-emerald-400 block mb-1">
                  Frase Chave / Síntese:
                </span>
                <p className="text-xs font-semibold text-slate-100">
                  {selectedMovie.keyPhrase}
                </p>
              </div>

              {/* Sinopse */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Sinopse</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedMovie.synopsis}
                </p>
              </div>

              {/* Impacto Direto em Doomsday */}
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  Conexão com Doomsday & Destino
                </h4>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  {selectedMovie.doomsdayConnection}
                </p>
              </div>

              {/* Elementos chave */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                  Conceitos & Elementos Chave
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMovie.keyElements.map((elem, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono"
                    >
                      {elem}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleToggle(selectedMovie.id)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    watchedIds.includes(selectedMovie.id)
                      ? 'bg-slate-900 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {watchedIds.includes(selectedMovie.id) ? 'Já Assistido (Desmarcar)' : 'Marcar como Assistido'}
                </button>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// ========================================================
// REUSABLE TIMELINE CARD COMPONENT WITH INLINE EXPANSION
// ========================================================
interface TimelineCardProps {
  item: MCUItem;
  index: number;
  isWatched: boolean;
  onToggle: (id: string, e?: React.MouseEvent) => void;
  onSelect: () => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  item,
  index,
  isWatched,
  onToggle,
  onSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDoomsdayClimax = item.id === 'avengers-doomsday';

  const handleCardClick = () => {
    sound.playClick();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.25 }}
      className="relative group"
    >
      {/* Node circle on vertical timeline line */}
      <div
        onClick={(e) => onToggle(item.id, e)}
        className={`absolute -left-[31px] sm:-left-[39px] top-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 z-10 touch-manipulation ${
          isWatched
            ? 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_10px_rgba(16,185,129,0.8)]'
            : isDoomsdayClimax
            ? 'bg-[#060a0f] border-emerald-400 text-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            : 'bg-[#020407] border-slate-700 text-slate-400 hover:border-emerald-400 hover:text-emerald-400'
        }`}
        title={isWatched ? 'Desmarcar' : 'Marcar como visto'}
      >
        {isWatched ? (
          <CheckCircle className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <span className="text-[10px] font-mono font-bold">
            {item.chronologicalOrder || index + 1}
          </span>
        )}
      </div>

      {/* CARD CONTAINER */}
      <div
        onClick={handleCardClick}
        className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer backdrop-blur-md touch-manipulation ${
          isDoomsdayClimax
            ? 'bg-gradient-to-br from-emerald-950/70 via-[#03060a] to-[#010204] border-emerald-500/80 shadow-[0_0_18px_rgba(16,185,129,0.25)]'
            : isWatched
            ? 'bg-[#030509]/80 border-slate-800/80 hover:border-emerald-500/40'
            : 'bg-[#03060a]/90 border-slate-800/90 hover:border-emerald-500/50 hover:shadow-[0_0_14px_rgba(16,185,129,0.12)]'
        }`}
      >
        {/* TOP ROW: Badge/Emoji on Left & 'Marcar'/'Lido' Button on Top-Right */}
        <div className="flex items-start justify-between gap-2">
          
          {/* Left: Emoji + Badges + Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-inner shrink-0">
              {item.posterEmoji}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.type === 'movie' ? 'Filme' : 'Série'} • {item.releaseYear}
                </span>
                {item.timelinePeriod && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {item.timelinePeriod}
                  </span>
                )}
                {item.phase !== undefined && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hidden xs:inline-block">
                    {item.phase === 0 ? 'Fox' : `F${item.phase}`}
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight truncate mt-1">
                {item.title}
              </h4>
            </div>
          </div>

          {/* RIGHT: Top-Right 'Marcar' / 'Lido' Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id, e);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer shrink-0 ${
              isWatched
                ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-emerald-500/60 hover:text-emerald-400 hover:bg-slate-850'
            }`}
            title={isWatched ? 'Marcar como não lido' : 'Marcar como lido'}
            id={`btn-toggle-watched-${item.id}`}
          >
            <span>{isWatched ? 'Lido' : 'Marcar'}</span>
            {isWatched ? (
              <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

        </div>

        {/* 3-LINE EXPLANATORY TEXT BLOCK */}
        <div className="mt-2 text-xs leading-relaxed text-slate-300">
          {!isExpanded ? (
            <p className="line-clamp-3 text-[11.5px] sm:text-xs text-slate-300/90 font-normal">
              <span className="text-emerald-400 font-semibold mr-1">✦</span>
              <span className="text-emerald-300 font-semibold">{item.keyPhrase}</span>{' '}
              <span className="text-slate-400">— {item.doomsdayConnection}</span>
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5 pt-1 text-[11.5px] sm:text-xs"
            >
              {/* Full Key Phrase */}
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[9.5px] font-mono uppercase font-bold text-emerald-400 block mb-0.5">
                  ✦ Síntese Chave:
                </span>
                <p className="text-emerald-200 font-medium leading-relaxed">
                  {item.keyPhrase}
                </p>
              </div>

              {/* Full Doomsday Connection */}
              <div className="space-y-1">
                <span className="text-[9.5px] font-mono uppercase font-bold text-slate-400 block">
                  Conexão com Doomsday:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {item.doomsdayConnection}
                </p>
              </div>

              {/* Key Elements Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {item.keyElements.map((elem, i) => (
                  <span
                    key={i}
                    className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {elem}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* BOTTOM CARD FOOTER (Expand / Collapse + 'Ver tudo' Action) */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px] font-mono">
          <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            <span>{isExpanded ? 'Recolher' : 'Toque para expandir'}</span>
          </div>

          {/* 'VER TUDO' BUTTON TO OPEN FULL MODAL DOSSIER */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onSelect();
            }}
            className="px-2.5 py-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold hover:text-emerald-200 flex items-center gap-1 transition-all touch-manipulation cursor-pointer group"
            title="Abrir detalhes completos com sinopse"
          >
            <span>Ver tudo</span>
            <Sparkles className="w-3 h-3 text-emerald-400 group-hover:rotate-12 transition-transform" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};
