import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  AlertTriangle, 
  Zap, 
  Shield, 
  Clock, 
  Compass, 
  Sparkles,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

interface IncursionPhase {
  step: number;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  timeLeft: string;
  stability: number; // Percentage
  stabilityLabel: string;
  distanceLabel: string;
  earth1Pos: number; // X offset in px
  earth2Pos: number; // X offset in px
  scale: number;
  description: string;
  comicLore: string;
  mcuImpact: string;
}

const INCURSION_PHASES: IncursionPhase[] = [
  {
    step: 1,
    title: 'Fase 1: Ponto de Contato & Céus Sobrepostos',
    subtitle: 'Ruptura da barreira entre duas realidades distintas',
    badge: 'ALERTA DIMENSIONAL',
    badgeColor: 'border-blue-500/50 bg-blue-950/60 text-blue-300',
    timeLeft: '08:00:00',
    stability: 95,
    stabilityLabel: 'Instável (Incursão Detectada)',
    distanceLabel: '500.000 km (Início da Convergência)',
    earth1Pos: -120,
    earth2Pos: 120,
    scale: 1,
    description: 'A barreira dimensional se rompe no ponto focal de cada universo: a Terra. De repente, os habitantes de ambos os mundos olham para o céu e veem um planeta inteiro pairando no horizonte como uma segunda lua gigante.',
    comicLore: 'Nos quadrinhos de Jonathan Hickman, a janela de uma incursão dura exatamente 8 horas antes da aniquilação total de ambos os universos.',
    mcuImpact: 'Mostrado em Doutor Estranho no Multiverso da Loucura e nas cenas pós-créditos de As Marvels com a fenda aberta.'
  },
  {
    step: 2,
    title: 'Fase 2: Atração Gravitacional & Fenda Espaço-Temporal',
    subtitle: 'A gravidade de dois mundos começa a colidir',
    badge: 'COLAPSO EM CURSO',
    badgeColor: 'border-amber-500/50 bg-amber-950/60 text-amber-300',
    timeLeft: '04:30:00',
    stability: 62,
    stabilityLabel: 'Distorção Severa',
    distanceLabel: '220.000 km (Marés Gravitacionais)',
    earth1Pos: -75,
    earth2Pos: 75,
    scale: 1.05,
    description: 'À medida que as Terras se aproximam, as forças gravitacionais causam cataclismos mundiais, terremotos oceânicos e auroras cósmicas avermelhadas. O espaço entre os dois mundos começa a queimar com radiação quântica.',
    comicLore: 'Os Illuminati tentaram construir armas de antimatéria e bombas planetárias na tentativa desesperada de destruir o outro mundo.',
    mcuImpact: 'Em Deadpool & Wolverine, o conceito de morte de linhas temporais e colapso de âncoras acelera as fendas dimensionais.'
  },
  {
    step: 3,
    title: 'Fase 3: Ponto Crítico & O Dilema Moral de Destruição',
    subtitle: 'Atrito atmosférico: Destruir a outra Terra ou morrer',
    badge: 'IMPACTO IMINENTE',
    badgeColor: 'border-red-500/50 bg-red-950/60 text-red-300',
    timeLeft: '00:45:00',
    stability: 20,
    stabilityLabel: 'Colapso Crítico do Tecido Cósmico',
    distanceLabel: '40.000 km (Atrito de Atmosferas)',
    earth1Pos: -28,
    earth2Pos: 28,
    scale: 1.15,
    description: 'As atmosferas entram em combustão por atrito. Se as duas Terras colidirem, NÃO SOBRA NADA: os dois universos inteiros (galáxias, estrelas e linhas do tempo) são totalmente apagados da existência para sempre.',
    comicLore: 'A regra cruel do Multiverso: Se uma das Terras for destruída antes do fim das 8 horas, o universo sobrevivente é salvo da incursão.',
    mcuImpact: 'Coloca heróis contra heróis. Os Vingadores do 616 terão que decidir se destroem realidades inteiras para sobreviver.'
  },
  {
    step: 4,
    title: 'Fase 4: Intervenção de Victor Von Doom (God Emperor Doom)',
    subtitle: 'O Doutor Destino canaliza a magia dos Beyonders',
    badge: 'INTERVENÇÃO DO DESTINO',
    badgeColor: 'border-emerald-500/60 bg-emerald-950/70 text-emerald-300',
    timeLeft: '00:00:00',
    stability: 50,
    stabilityLabel: 'Estabilização Arcana Forçada',
    distanceLabel: 'Ponto Zero (Canalização Multiversal)',
    earth1Pos: -8,
    earth2Pos: 8,
    scale: 1.25,
    description: 'Quando todos os heróis falham e o multiverso está à beira do nada absoluto, Victor Von Doom usurpa o poder cósmico divino e a magia arcana para interceptar a colisão no último segundo!',
    comicLore: 'Doom recusou a aniquilação. Ele costurou os retalhos das Terras que estavam sendo destruídas em uma única tapeçaria.',
    mcuImpact: 'O momento chave onde Robert Downey Jr. como Doutor Destino se estabelece como a única entidade capaz de salvar a criação em Doomsday.'
  },
  {
    step: 5,
    title: 'Fase 5: Criação do BATTLEWORLD (Mundo Bélico)',
    subtitle: 'Um planeta mosaico formado pelos restos do multiverso',
    badge: 'UNIVERSO SALVO • BATTLEWORLD',
    badgeColor: 'border-emerald-400 bg-emerald-900/50 text-emerald-200',
    timeLeft: 'TEMPO SUSPENSO',
    stability: 100,
    stabilityLabel: 'Mundo Único Sob o Comando de Destino',
    distanceLabel: 'Planeta Mosaico Unificado',
    earth1Pos: 0,
    earth2Pos: 0,
    scale: 1.35,
    description: 'As Terras não foram destruídas nem separadas: foram FUNDIDAS. Nasce o Battleworld, um planeta composto por dezenas de domínios fragmentados (Nova York 616, X-Men dos anos 90, Reinos Mágicos), governado com punho de ferro pelo Deus Destino.',
    comicLore: 'A fase definitiva de Guerras Secretas (2015). O multiverso antigo morre, mas a vida continua sob as leis de Victor Von Doom.',
    mcuImpact: 'O cenário definitivo de Vingadores: Guerras Secretas (Secret Wars), unindo variantes de todo o cinema Marvel.'
  }
];

const PHASE_DURATION = 7500; // 7.5 seconds per phase for clear understanding

export const IncursionSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhase = INCURSION_PHASES[currentStepIndex];

  // Auto-play progression loop
  useEffect(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isPlaying) {
      const startTime = Date.now();
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / PHASE_DURATION) * 100);
        setProgress(pct);
      }, 50);

      timerRef.current = setTimeout(() => {
        if (currentStepIndex < INCURSION_PHASES.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
          setProgress(0);
          sound.playArcanePulse();
        } else {
          // Finished all phases
          setIsPlaying(false);
          setProgress(100);
          sound.playSuccess();
        }
      }, PHASE_DURATION);
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex]);

  const handleStart = () => {
    sound.playArcanePulse();
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePause = () => {
    sound.playClick();
    setIsPlaying(false);
  };

  const handleRestart = () => {
    sound.playClick();
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setProgress(0);
  };

  const handleGoToStep = (index: number) => {
    sound.playClick();
    setCurrentStepIndex(index);
    setProgress(0);
  };

  const handleNextStep = () => {
    if (currentStepIndex < INCURSION_PHASES.length - 1) {
      sound.playClick();
      setCurrentStepIndex((prev) => prev + 1);
      setProgress(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      sound.playClick();
      setCurrentStepIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  return (
    <div className="w-full bg-[#03060a]/95 border-2 border-emerald-500/50 rounded-3xl p-4 sm:p-5 my-4 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden relative text-slate-200">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Simulator Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/90 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black font-mono text-emerald-400 uppercase tracking-wider">
                Simulador de Incursão Multiversal
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/80 hidden sm:inline">
                COLISÃO DE TERRAS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Compreenda passo a passo como mundos colidem e o Battleworld nasce
            </p>
          </div>
        </div>

        {/* Phase Badge */}
        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shadow-sm ${currentPhase.badgeColor}`}>
          {currentPhase.badge}
        </span>
      </div>

      {/* Step Selector Pills */}
      <div className="grid grid-cols-5 gap-1.5 my-3">
        {INCURSION_PHASES.map((p, idx) => {
          const isCurrent = currentStepIndex === idx;
          const isPassed = currentStepIndex > idx;
          return (
            <button
              key={p.step}
              onClick={() => handleGoToStep(idx)}
              className={`py-1.5 px-1 rounded-xl text-center border transition-all cursor-pointer relative overflow-hidden ${
                isCurrent
                  ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold'
                  : isPassed
                  ? 'bg-[#020306] border-slate-700/60 text-emerald-400/90'
                  : 'bg-[#020306] border-slate-800/70 text-slate-500 hover:text-slate-300'
              }`}
            >
              {/* Progress bar inside active pill */}
              {isCurrent && isPlaying && (
                <div 
                  className="absolute bottom-0 left-0 h-0.5 bg-emerald-400 transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              )}
              <span className="text-[10px] font-mono block leading-tight">
                Fase {p.step}
              </span>
              <span className="text-[8.5px] text-slate-400 truncate block sm:hidden">
                {idx === 0 ? 'Contato' : idx === 1 ? 'Gravidade' : idx === 2 ? 'Crítico' : idx === 3 ? 'Destino' : 'Battleworld'}
              </span>
              <span className="text-[9px] text-slate-400 truncate hidden sm:block">
                {idx === 0 ? 'Ponto Contato' : idx === 1 ? 'Atração' : idx === 2 ? 'Ponto Crítico' : idx === 3 ? 'Doom Salva' : 'Battleworld'}
              </span>
            </button>
          );
        })}
      </div>

      {/* VISUAL COSMIC COLLISION STAGE */}
      <div className="relative w-full h-56 sm:h-64 bg-[#010204] rounded-2xl border border-slate-800/90 overflow-hidden flex flex-col justify-between p-3 my-2 shadow-inner">
        
        {/* Starfield & Cosmic Grid */}
        <div className="absolute inset-0 sleek-dot-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#010204]/70 to-[#010204] pointer-events-none" />

        {/* Dynamic Collision Aura & Shockwaves */}
        {currentStepIndex >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentStepIndex === 2 ? 0.8 : currentStepIndex === 3 ? 0.9 : currentStepIndex === 4 ? 1 : 0.4,
              scale: currentStepIndex === 2 ? [1, 1.2, 1] : 1
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl pointer-events-none ${
              currentStepIndex === 2 
                ? 'w-48 h-48 bg-red-600/30' 
                : currentStepIndex >= 3 
                ? 'w-64 h-64 bg-emerald-500/25' 
                : 'w-36 h-36 bg-amber-500/20'
            }`}
          />
        )}

        {/* Telemetry Header (Time remaining & Stability) */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#03060a]/80 border border-slate-800 px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-300">Tempo de Incursão:</span>
            <span className={`font-bold ${currentStepIndex === 2 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
              {currentPhase.timeLeft}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#03060a]/80 border border-slate-800 px-2.5 py-1 rounded-xl">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-300 hidden sm:inline">Distância:</span>
            <span className="font-bold text-emerald-300 text-[10.5px]">
              {currentPhase.distanceLabel.split('(')[0]}
            </span>
          </div>
        </div>

        {/* PLANETS ANIMATION STAGE */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center my-auto">
          
          {/* Gravitational Distortion Lines / Lightning connecting both planets */}
          {currentStepIndex >= 1 && currentStepIndex <= 3 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute w-40 h-0.5 bg-gradient-to-r from-blue-500 via-red-500 to-purple-500 blur-[1px]"
            />
          )}

          {/* DOOM'S ARCANE BINDING BEAM (Phase 4 & 5) */}
          {currentStepIndex >= 3 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute z-20 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="w-20 h-20 rounded-full border-2 border-emerald-400 bg-emerald-500/20 blur-[2px] animate-pulse" />
              <div className="absolute w-12 h-12 rounded-full border border-emerald-300 flex items-center justify-center bg-emerald-950/80 shadow-[0_0_25px_rgba(16,185,129,0.9)]">
                <Shield className="w-6 h-6 text-emerald-300" />
              </div>
            </motion.div>
          )}

          {/* IF PHASE 5: UNIFIED BATTLEWORLD */}
          {currentStepIndex === 4 ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex flex-col items-center z-30"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-500 via-teal-700 to-slate-900 border-2 border-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.8)] flex items-center justify-center overflow-hidden">
                {/* Surface patches of multiple dimensions */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300 via-emerald-600 to-indigo-900" />
                <div className="absolute w-full h-1 bg-emerald-300/40 rotate-45" />
                <div className="absolute w-full h-1 bg-emerald-300/40 -rotate-45" />
                
                <div className="relative z-10 text-center">
                  <span className="text-[11px] font-black text-white font-mono tracking-widest block uppercase drop-shadow">
                    BATTLE
                  </span>
                  <span className="text-[11px] font-black text-emerald-200 font-mono tracking-widest block uppercase drop-shadow">
                    WORLD
                  </span>
                </div>
              </div>
              <span className="mt-2 text-xs font-bold font-mono text-emerald-400 bg-[#020306]/90 px-3 py-0.5 rounded-full border border-emerald-500/50 shadow-sm">
                MUNDO BÉLICO • DOMÍNIO DE DESTINO
              </span>
            </motion.div>
          ) : (
            /* DUAL PLANETS APPROACHING EACH OTHER */
            <div className="w-full flex items-center justify-center relative">
              
              {/* EARTH 1: Terra-616 (Main MCU Timeline) */}
              <motion.div
                animate={{ 
                  x: currentPhase.earth1Pos,
                  scale: currentPhase.scale
                }}
                transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                className="absolute flex flex-col items-center cursor-default group"
              >
                {/* Earth 1 Orb */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-700 via-cyan-500 to-blue-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center overflow-hidden">
                  {/* Continental swirls */}
                  <div className="absolute -top-2 -left-2 w-10 h-8 rounded-full bg-emerald-600/60 blur-[1px]" />
                  <div className="absolute bottom-1 right-1 w-12 h-6 rounded-full bg-emerald-500/50 blur-[1px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20" />
                  <span className="text-[11px] sm:text-xs font-black text-white font-mono tracking-wider drop-shadow-md z-10">
                    616
                  </span>
                </div>

                <div className="mt-1.5 text-center">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 block leading-tight">
                    Terra-616
                  </span>
                  <span className="text-[8.5px] text-slate-400 font-mono">
                    Linha Sagrada
                  </span>
                </div>
              </motion.div>

              {/* Central Collision Marker Icon / Pulse */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <span className={`text-[10px] font-mono font-black ${
                  currentStepIndex === 2 
                    ? 'text-red-400 scale-125 animate-ping' 
                    : 'text-slate-500'
                }`}>
                  VS
                </span>
              </div>

              {/* EARTH 2: Incursion Earth (Alternate Universe) */}
              <motion.div
                animate={{ 
                  x: currentPhase.earth2Pos,
                  scale: currentPhase.scale
                }}
                transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                className="absolute flex flex-col items-center cursor-default group"
              >
                {/* Earth 2 Orb */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple-800 via-fuchsia-600 to-indigo-900 border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)] flex items-center justify-center overflow-hidden">
                  {/* Continental swirls */}
                  <div className="absolute -bottom-2 -left-2 w-10 h-8 rounded-full bg-amber-600/50 blur-[1px]" />
                  <div className="absolute top-1 right-2 w-8 h-8 rounded-full bg-pink-500/40 blur-[1px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20" />
                  <span className="text-[11px] sm:text-xs font-black text-white font-mono tracking-wider drop-shadow-md z-10">
                    838
                  </span>
                </div>

                <div className="mt-1.5 text-center">
                  <span className="text-[10px] font-mono font-bold text-purple-300 block leading-tight">
                    Terra Incursora
                  </span>
                  <span className="text-[8.5px] text-slate-400 font-mono">
                    Universo em Colisão
                  </span>
                </div>
              </motion.div>

            </div>
          )}
        </div>

        {/* Telemetry Footer (Stability bar) */}
        <div className="relative z-10 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              Estabilidade Dimensional:
            </span>
            <span className={`font-bold ${
              currentPhase.stability > 70 
                ? 'text-emerald-400' 
                : currentPhase.stability > 30 
                ? 'text-amber-400' 
                : 'text-red-400'
            }`}>
              {currentPhase.stability}% • {currentPhase.stabilityLabel}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              animate={{ width: `${currentPhase.stability}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${
                currentPhase.stability > 70 
                  ? 'bg-emerald-500' 
                  : currentPhase.stability > 30 
                  ? 'bg-amber-500' 
                  : 'bg-red-500'
              }`}
            />
          </div>
        </div>

      </div>

      {/* CONTROLS BAR: Play/Pause, Next/Prev, Speed & Reset */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pausar Explicação</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentStepIndex === 0 ? 'Iniciar Simulação' : 'Continuar'}</span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-xl bg-[#020306] hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reiniciar Simulação do Começo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Manual Step Navigators */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="px-2.5 py-1.5 rounded-xl bg-[#020306] border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer font-mono"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <span className="text-xs font-mono text-slate-400 px-2">
            {currentStepIndex + 1} / {INCURSION_PHASES.length}
          </span>

          <button
            onClick={handleNextStep}
            disabled={currentStepIndex === INCURSION_PHASES.length - 1}
            className="px-2.5 py-1.5 rounded-xl bg-[#020306] border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer font-mono"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DETAILED PHASE EXPLANATION CARD (Rich didactic lore) */}
      <motion.div
        key={currentPhase.step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-3 space-y-3"
      >
        <div>
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            {currentPhase.title}
          </h3>
          <p className="text-xs text-emerald-400/90 font-mono mt-0.5">
            {currentPhase.subtitle}
          </p>
        </div>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-[#020306]/70 p-3 rounded-2xl border border-slate-800/80">
          {currentPhase.description}
        </p>

        {/* Lore Grid: Comic Rules vs MCU Impact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-[#020306] border border-slate-800 space-y-1">
            <span className="text-[10.5px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              Regra dos Quadrinhos (Hickman):
            </span>
            <p className="text-[11.5px] text-slate-300 leading-relaxed">
              {currentPhase.comicLore}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
            <span className="text-[10.5px] font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Impacto em Avengers: Doomsday:
            </span>
            <p className="text-[11.5px] text-emerald-100/90 leading-relaxed">
              {currentPhase.mcuImpact}
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
};
