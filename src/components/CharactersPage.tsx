import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, 
  Search, 
  ChevronDown, 
  Zap,
  Radio,
  Shield,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Flame,
  Layers,
  X,
  Crosshair
} from 'lucide-react';
import { DOOMSDAY_CHARACTERS } from '../data/marvelData';
import { CharacterProfile, PageTab } from '../types';
import { sound } from '../utils/audio';

interface CharactersPageProps {
  onSelectTab?: (tab: PageTab) => void;
}

type FactionFilter = 'all' | 'Monarcas & Arcanos' | 'Quarteto Fantástico' | 'Vingadores & Terra-616' | 'Mutantes & Multiverso' | 'Thunderbolts & Forças Especiais' | 'omega';

export const CharactersPage: React.FC<CharactersPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<FactionFilter>('all');
  const [expandedCharId, setExpandedCharId] = useState<string | null>(null);
  const [modalChar, setModalChar] = useState<CharacterProfile | null>(null);
  const [groupByFaction, setGroupByFaction] = useState(true);

  // Filter characters based on search and selected faction
  const filteredCharacters = useMemo(() => {
    return DOOMSDAY_CHARACTERS.filter((char) => {
      const matchesSearch = 
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.faction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.powers.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;

      if (selectedFaction === 'omega') {
        return char.dangerLevel >= 5;
      }
      if (selectedFaction !== 'all') {
        return char.faction === selectedFaction;
      }
      return true;
    });
  }, [searchTerm, selectedFaction]);

  // Group characters by faction
  const factionGroups = useMemo(() => {
    const factions: Array<{
      name: CharacterProfile['faction'];
      title: string;
      icon: React.ReactNode;
      color: string;
      chars: CharacterProfile[];
    }> = [
      {
        name: 'Monarcas & Arcanos',
        title: 'Monarcas & Mestres Arcanos',
        icon: <Crown className="w-4 h-4 text-emerald-400" />,
        color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/20',
        chars: filteredCharacters.filter(c => c.faction === 'Monarcas & Arcanos')
      },
      {
        name: 'Quarteto Fantástico',
        title: 'A Primeira Família (Quarteto Fantástico)',
        icon: <Shield className="w-4 h-4 text-blue-400" />,
        color: 'border-blue-500/40 text-blue-300 bg-blue-950/20',
        chars: filteredCharacters.filter(c => c.faction === 'Quarteto Fantástico')
      },
      {
        name: 'Vingadores & Terra-616',
        title: 'Vingadores & Heróis da Terra-616',
        icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        color: 'border-amber-500/40 text-amber-300 bg-amber-950/20',
        chars: filteredCharacters.filter(c => c.faction === 'Vingadores & Terra-616')
      },
      {
        name: 'Mutantes & Multiverso',
        title: 'Mutantes & Legado Multiversal',
        icon: <Flame className="w-4 h-4 text-purple-400" />,
        color: 'border-purple-500/40 text-purple-300 bg-purple-950/20',
        chars: filteredCharacters.filter(c => c.faction === 'Mutantes & Multiverso')
      },
      {
        name: 'Thunderbolts & Forças Especiais',
        title: 'Thunderbolts* & Forças Especiais',
        icon: <Crosshair className="w-4 h-4 text-yellow-400" />,
        color: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/20',
        chars: filteredCharacters.filter(c => c.faction === 'Thunderbolts & Forças Especiais')
      }
    ];

    return factions.filter(group => group.chars.length > 0);
  }, [filteredCharacters]);

  const toggleCardExpansion = (charId: string) => {
    sound.playClick();
    setExpandedCharId(prev => prev === charId ? null : charId);
  };

  const openFullModal = (char: CharacterProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playArcanePulse();
    setModalChar(char);
  };

  return (
    <div className="w-full flex flex-col items-center pb-28 pt-2 px-3 sm:px-4 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between py-2 text-slate-300 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-100 flex items-center gap-2">
              Dossiê de Personagens
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {DOOMSDAY_CHARACTERS.length} agentes
              </span>
            </h1>
            <p className="text-[10.5px] text-slate-400 font-mono">
              Classificação tática para Vingadores: Doomsday & Guerras Secretas
            </p>
          </div>
        </div>
      </div>

      {/* Latverian Security Intelligence Banner */}
      <div className="w-full bg-[#03060a]/90 border border-slate-800/90 rounded-2xl p-3.5 my-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1.5 font-mono text-emerald-400 uppercase tracking-widest font-bold text-[11px]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            Terminal de Vigilância de Latveria
          </span>
          <span className="text-[9.5px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/30">
            NÍVEL ÔMEGA
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Selecione qualquer card abaixo para desbloquear a análise detalhada, arsenal de poderes e a conexão estratégica com Victor Von Doom.
        </p>
      </div>

      {/* Search and Grouping Controls */}
      <div className="w-full space-y-2.5 my-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar personagem, ator, codinome ou poder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#04070c] border border-slate-800 focus:border-emerald-500 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setGroupByFaction(!groupByFaction);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer shrink-0 ${
              groupByFaction
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Alternar entre visualização agrupada e grade"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{groupByFaction ? 'Agrupado' : 'Grade'}</span>
          </button>
        </div>

        {/* Faction Pills / Filter Tabs */}
        <div className="w-full flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar text-xs">
          <button
            onClick={() => { sound.playClick(); setSelectedFaction('all'); }}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-all touch-manipulation cursor-pointer ${
              selectedFaction === 'all'
                ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'bg-[#03060a] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({DOOMSDAY_CHARACTERS.length})
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedFaction('Monarcas & Arcanos'); }}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-all touch-manipulation cursor-pointer flex items-center gap-1 ${
              selectedFaction === 'Monarcas & Arcanos'
                ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'bg-[#03060a] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>👑</span>
            <span>Monarcas & Arcanos</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedFaction('Quarteto Fantástico'); }}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-all touch-manipulation cursor-pointer flex items-center gap-1 ${
              selectedFaction === 'Quarteto Fantástico'
                ? 'bg-blue-500 text-black font-bold shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                : 'bg-[#03060a] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>4️⃣</span>
            <span>Quarteto Fantástico</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedFaction('Vingadores & Terra-616'); }}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-all touch-manipulation cursor-pointer flex items-center gap-1 ${
              selectedFaction === 'Vingadores & Terra-616'
                ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'bg-[#03060a] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⭐</span>
            <span>Vingadores</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedFaction('Mutantes & Multiverso'); }}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-all touch-manipulation cursor-pointer flex items-center gap-1 ${
              selectedFaction === 'Mutantes & Multiverso'
                ? 'bg-purple-500 text-black font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'bg-[#03060a] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚔️</span>
            <span>Mutantes & Multiverso</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedFaction('Thunderbolts & Forças Especiais'); }}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-all touch-manipulation cursor-pointer flex items-center gap-1 ${
              selectedFaction === 'Thunderbolts & Forças Especiais'
                ? 'bg-yellow-500 text-black font-bold shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                : 'bg-[#03060a] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚡</span>
            <span>Thunderbolts</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedFaction('omega'); }}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-all touch-manipulation cursor-pointer flex items-center gap-1 ${
              selectedFaction === 'omega'
                ? 'bg-red-500 text-black font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'bg-[#03060a] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔥</span>
            <span>Ameaça Ômega</span>
          </button>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 py-1 mb-2">
        <span>Exibindo <strong>{filteredCharacters.length}</strong> de {DOOMSDAY_CHARACTERS.length} personagens</span>
        <span className="text-emerald-400/80">Toque no card para abrir o dossiê</span>
      </div>

      {/* CHARACTERS DISPLAY: GROUPED OR GRID */}
      {filteredCharacters.length === 0 ? (
        <div className="w-full text-center py-12 border border-slate-800 rounded-2xl bg-[#03060a]/60">
          <p className="text-sm text-slate-400 font-mono">Nenhum personagem encontrado com os filtros atuais.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedFaction('all'); }}
            className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold"
          >
            Limpar filtros
          </button>
        </div>
      ) : groupByFaction && selectedFaction === 'all' ? (
        // GROUPED VIEW
        <div className="w-full space-y-6">
          {factionGroups.map((group) => (
            <div key={group.name} className="w-full space-y-2.5">
              {/* Group Header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${group.color} backdrop-blur-md`}>
                <div className="flex items-center gap-2">
                  {group.icon}
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono">
                    {group.title}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/40 border border-white/10">
                  {group.chars.length} {group.chars.length === 1 ? 'membro' : 'membros'}
                </span>
              </div>

              {/* Character Cards List */}
              <div className="grid grid-cols-1 gap-2.5">
                {group.chars.map((char) => (
                  <CharacterItemCard
                    key={char.id}
                    char={char}
                    isExpanded={expandedCharId === char.id}
                    onToggle={() => toggleCardExpansion(char.id)}
                    onOpenModal={(e) => openFullModal(char, e)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // FLAT GRID VIEW
        <div className="w-full grid grid-cols-1 gap-2.5">
          {filteredCharacters.map((char) => (
            <CharacterItemCard
              key={char.id}
              char={char}
              isExpanded={expandedCharId === char.id}
              onToggle={() => toggleCardExpansion(char.id)}
              onOpenModal={(e) => openFullModal(char, e)}
            />
          ))}
        </div>
      )}

      {/* FULL CHARACTER MODAL DOSSIER */}
      <AnimatePresence>
        {modalChar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#03060a] border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(16,185,129,0.25)] space-y-4 text-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {modalChar.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {modalChar.status}
                      </span>
                      <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                        {modalChar.faction}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white mt-1 leading-tight">
                      {modalChar.name}
                    </h2>
                    <p className="text-xs text-emerald-400 font-mono">
                      « {modalChar.alias} » • Intérprete: <strong className="text-slate-100">{modalChar.actor}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalChar(null)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Danger Level Meter */}
              <div className="flex items-center justify-between bg-[#020306] p-3 rounded-xl border border-slate-800/80">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Nível de Perigo Multiversal
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-400 mr-1">
                    {modalChar.dangerLevel}/5
                  </span>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`w-3 h-3 rounded-full ${
                        lvl <= modalChar.dangerLevel
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Full Biography */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  Perfil Biográfico
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#020306] p-3 rounded-xl border border-slate-800/60">
                  {modalChar.description}
                </p>
              </div>

              {/* Strategic Role */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Papel Estratégico em Doomsday
                </h4>
                <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-normal">
                  {modalChar.doomsdayRole}
                </p>
              </div>

              {/* Powers & Arsenal */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Habilidades & Arsenal Conhecido
                </h4>
                <div className="space-y-1.5">
                  {modalChar.powers.map((power, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#020306] border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span>{power}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidential Latveria Intel */}
              <div className="p-3 rounded-xl bg-[#020306] border border-slate-800 font-mono text-xs">
                <p className="text-emerald-400 text-[11px] font-bold mb-1 uppercase tracking-wider">
                  [+] Registro Confidencial de Vigilância:
                </p>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {modalChar.latveriaIntel}
                </p>
              </div>

              {/* Modal Footer Close Button */}
              <div className="pt-2">
                <button
                  onClick={() => setModalChar(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors touch-manipulation cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Fechar Dossiê
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// ========================================================
// REUSABLE CHARACTER CARD COMPONENT WITH INLINE EXPANSION
// ========================================================
interface CharacterItemCardProps {
  char: CharacterProfile;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenModal: (e: React.MouseEvent) => void;
}

const CharacterItemCard: React.FC<CharacterItemCardProps> = ({
  char,
  isExpanded,
  onToggle,
  onOpenModal
}) => {
  const isDoom = char.id === 'dr-doom';

  return (
    <div
      onClick={onToggle}
      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer backdrop-blur-md touch-manipulation select-none ${
        isDoom
          ? 'bg-gradient-to-br from-emerald-950/70 via-[#03060a] to-[#010204] border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
          : isExpanded
          ? 'bg-[#03060a] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
          : 'bg-[#03060a]/90 border-slate-800/90 hover:border-slate-700 hover:bg-[#050910]'
      }`}
      id={`char-card-${char.id}`}
    >
      {/* TOP HEADER: Avatar + Titles + Status + Danger Meter */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0 border ${
            isDoom
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}>
            {char.emoji}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9.5px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {char.status}
              </span>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {char.faction}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate mt-1">
              {char.name}
            </h3>
            <p className="text-[11px] text-emerald-400/90 font-mono truncate">
              {char.alias} • <span className="text-slate-400">{char.actor}</span>
            </p>
          </div>
        </div>

        {/* Right side: Danger meter & Arrow */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md border border-slate-800/80">
            <span className="text-[9px] font-mono text-slate-400 mr-0.5">Perigo:</span>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div
                key={lvl}
                className={`w-1.5 h-1.5 rounded-full ${
                  lvl <= char.dangerLevel ? 'bg-emerald-400' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          <span className="text-[10px] font-mono text-slate-500 flex items-center gap-0.5 mt-0.5">
            {isExpanded ? 'Recolher' : 'Explicar'}
            <ChevronDown className={`w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </div>

      {/* EXPLANATION BLOCK (COLLAPSED PREVIEW vs EXPANDED DOSSIER) */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/70 text-xs">
        {!isExpanded ? (
          <p className="line-clamp-2 text-[11.5px] sm:text-xs text-slate-300/85 leading-relaxed font-normal">
            <span className="text-emerald-400 font-semibold mr-1">✦ Papel:</span>
            {char.doomsdayRole}
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 pt-1 text-[11.5px] sm:text-xs"
          >
            {/* Biographic profile */}
            <div className="space-y-1">
              <span className="text-[9.5px] font-mono uppercase font-bold text-slate-400 block">
                Perfil Biográfico:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {char.description}
              </p>
            </div>

            {/* Strategic Role */}
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[9.5px] font-mono uppercase font-bold text-emerald-400 block mb-0.5">
                ✦ Papel Estratégico em Doomsday:
              </span>
              <p className="text-emerald-200 font-medium leading-relaxed">
                {char.doomsdayRole}
              </p>
            </div>

            {/* Powers list */}
            <div className="space-y-1">
              <span className="text-[9.5px] font-mono uppercase font-bold text-slate-400 block">
                Habilidades & Arsenal:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {char.powers.map((power, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-lg bg-[#020306] border border-slate-800/80 text-slate-300 flex items-start gap-1.5"
                  >
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="text-[11px]">{power}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Surveillance Intel */}
            <div className="p-2.5 rounded-lg bg-[#020306] border border-slate-800/90 font-mono text-[10.5px]">
              <span className="text-emerald-400 font-bold block mb-0.5 uppercase">
                [+] Inteligência de Vigilância Latveriana:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {char.latveriaIntel}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-500">
                Toque no card para recolher
              </span>

              <button
                onClick={onOpenModal}
                className="px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-[10.5px] flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer"
                title="Abrir dossiê completo em tela cheia"
              >
                <span>Dossiê Tático Completo</span>
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
};
