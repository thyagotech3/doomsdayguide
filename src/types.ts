export type PageTab = 'personagens' | 'multiverso' | 'trilha' | 'comunidade';

export type TrailMode = 'rapida' | 'essencial' | 'completa';

export interface MCUItem {
  id: string;
  title: string;
  originalTitle: string;
  type: 'movie' | 'series' | 'special';
  releaseYear: number;
  chronologicalOrder?: number;
  timelinePeriod?: string;
  phase: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  saga: 'Saga do Infinito' | 'Saga do Multiverso' | 'Multiverso Fox / Legado';
  importance: 'obrigatorio' | 'essencial' | 'recomendado' | 'opcional';
  keyPhrase: string;
  doomsdayConnection: string;
  synopsis: string;
  keyElements: string[];
  runtimeMinutes: number;
  posterEmoji: string;
  coverImage?: string;
  streaming: string;
  postCreditSceneNote?: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  alias: string;
  actor: string;
  faction: 'Monarcas & Arcanos' | 'Quarteto Fantástico' | 'Vingadores & Terra-616' | 'Mutantes & Multiverso' | 'Thunderbolts & Forças Especiais';
  emoji: string;
  status: 'Confirmado para Doomsday' | 'Provável Aparição' | 'Peça Chave do Multiverso' | 'Ameaça Cósmica';
  description: string;
  powers: string[];
  latveriaIntel: string;
  doomsdayRole: string;
  imageTheme: string;
  dangerLevel: number; // 1 to 5
}

export interface MultiverseConcept {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mcuFirstSeen: string;
  rule: string;
  threatForDoomsday: string;
  iconName: string;
}

export interface CommunityTheory {
  id: string;
  author: string;
  title: string;
  content: string;
  category: 'Origem do Destino' | 'Incursão Final' | 'Variantes & RDJ' | 'Quarteto Fantástico' | 'Guerras Secretas';
  upvotes: number;
  userVoted?: boolean;
  createdAt: string;
  commentsCount: number;
  tags: string[];
}

export interface TopicReply {
  id: string;
  topicId: string;
  content: string;
  authorId?: string;
  authorName: string;
  authorPhoto?: string;
  upvotes: number;
  isBestAnswer?: boolean;
  createdAt: string;
  userVoted?: boolean;
}

export interface CommunityTopic {
  id: string;
  title: string;
  content: string;
  category: 'Teorias & RDJ' | 'Incursões & Multiverso' | 'Dúvidas MCU' | 'Quarteto & Latveria' | 'Guerras Secretas';
  authorId?: string;
  authorName: string;
  authorPhoto?: string;
  upvotes: number;
  repliesCount: number;
  tags: string[];
  createdAt: string;
  isQuestion?: boolean;
  bestAnswerId?: string;
  userVoted?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPoll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedId?: string;
}
