import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Sparkles, 
  PlusCircle, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  HelpCircle,
  Trophy,
  Send,
  Flame,
  Award,
  LogIn,
  LogOut,
  User as UserIcon,
  Search,
  Filter,
  CheckCircle2,
  Share2,
  Calendar,
  Layers,
  Star,
  MessageCircle,
  ArrowLeft,
  X,
  Clock,
  Sparkle
} from 'lucide-react';
import { INITIAL_THEORIES, INITIAL_POLLS, DOOM_QUIZ_QUESTIONS } from '../data/marvelData';
import { CommunityTopic, TopicReply, CommunityPoll, PageTab } from '../types';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signOut, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  increment, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  User
} from '../lib/firebase';
import { CountdownCard } from './CountdownCard';
import { AuthModal } from './AuthModal';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CommunityPageProps {
  onSelectTab?: (tab: PageTab) => void;
}

// Initial seed data for Reddit / Yahoo Answers style topics
const SEED_TOPICS: CommunityTopic[] = [
  {
    id: 'topic-rdj-doom',
    title: 'Qual é a real probabilidade do Dr. Destino ser uma variante maligna do Tony Stark de outro universo?',
    content: 'Com o anúncio oficial dos Irmãos Russo e Robert Downey Jr., temos a confirmação de que ele interpretará Victor Von Doom. Mas como o MCU vai justificar isso na trama? Será uma variante sombria de Stark onde ele nunca teve o reator no peito e aprendeu magia em Latveria, ou será um Victor Von Doom autêntico que coincidentemente tem a mesma aparência? Como isso afetará o Peter Parker e o Thor?',
    category: 'Teorias & RDJ',
    authorName: 'Agente_TVA_Mobius',
    authorPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    upvotes: 428,
    repliesCount: 3,
    tags: ['Robert Downey Jr.', 'Variantes', 'Peter Parker', 'Terra-616'],
    createdAt: 'Há 3 horas',
    isQuestion: true,
    userVoted: false
  },
  {
    id: 'topic-yggdrasil-loki',
    title: 'A Árvore Yggdrasil do Loki será drenada pelo Doutor Destino para criar o Battleworld',
    content: 'No final da 2ª temporada de Loki, ele se tornou o Deus das Histórias, mantendo o multiverso vivo com seu próprio poder na Cidadela do Fim do Tempo. Nas Incursões, as realidades colidem e a árvore enfraquece. O Destino usará a energia cósmica dos Beyonders e sugará as ramificações de Loki para reconstruir o Mundo Bélico (Battleworld) sob seu controle absoluto!',
    category: 'Incursões & Multiverso',
    authorName: 'LokiVariant_Prime',
    upvotes: 356,
    repliesCount: 2,
    tags: ['Loki', 'Yggdrasil', 'Battleworld', 'Incursões'],
    createdAt: 'Há 6 horas',
    isQuestion: false,
    userVoted: true
  },
  {
    id: 'topic-ff-arrival',
    title: 'Como o Quarteto Fantástico de Pedro Pascal chegará à Terra-616 em Doomsday?',
    content: 'Sabemos que Fantastic Four: First Steps se passa em uma Nova York retrofuturista dos anos 60 em outro universo. Eles virão para a Terra-616 fugindo de Galactus ou porque o universo deles sofreu uma Incursão irreversível causada por Destino? O que vocês acham?',
    category: 'Quarteto & Latveria',
    authorName: 'Reed_Richards_Fan',
    upvotes: 284,
    repliesCount: 2,
    tags: ['Quarteto Fantástico', 'Pedro Pascal', 'Galactus', 'Anos 60'],
    createdAt: 'Há 1 dia',
    isQuestion: true,
    userVoted: false
  },
  {
    id: 'topic-secret-wars-reset',
    title: 'Vingadores: Guerras Secretas vai dar um reboot suave no MCU para juntar Mutantes e Vingadores?',
    content: 'Assim como nas HQs de 2015 de Jonathan Hickman, após o fim do Battleworld teremos uma nova linha do tempo unificada onde X-Men, Quarteto e Vingadores sempre coexistiram desde o início.',
    category: 'Guerras Secretas',
    authorName: 'Mutant_X_Brasil',
    upvotes: 219,
    repliesCount: 1,
    tags: ['Secret Wars', 'Reboot', 'X-Men', 'MCU'],
    createdAt: 'Há 2 dias',
    isQuestion: false,
    userVoted: false
  }
];

const SEED_REPLIES: Record<string, TopicReply[]> = {
  'topic-rdj-doom': [
    {
      id: 'rep-1',
      topicId: 'topic-rdj-doom',
      content: 'A teoria mais forte nos bastidores é de que este Victor Von Doom é do universo do Quarteto Fantástico (anos 60). Ele já nasceu Victor Von Doom e é adotado por ciganos latverianos. O choque no Peter Parker (Tom Holland) será psicológico ao ver o rosto de seu mentor como o maior tirano cósmico do multiverso!',
      authorName: 'PeterParker_Legacy',
      upvotes: 89,
      isBestAnswer: true,
      createdAt: 'Há 2 horas'
    },
    {
      id: 'rep-2',
      topicId: 'topic-rdj-doom',
      content: 'Lembrem-se que nas HQs existe a história Infamous Iron Man onde Destino assume o manto de Homem de Ferro. Eles podem inverter essa dinâmica no cinema de forma brilhante.',
      authorName: 'ComicBook_Geek',
      upvotes: 45,
      isBestAnswer: false,
      createdAt: 'Há 1 hora'
    },
    {
      id: 'rep-3',
      topicId: 'topic-rdj-doom',
      content: 'Se o Destino usar a máscara de titânio na maior parte do tempo, a revelação do rosto em um momento crucial de batalha será um dos maiores ganchos da história do cinema.',
      authorName: 'Latverian_Guard',
      upvotes: 31,
      isBestAnswer: false,
      createdAt: 'Há 45 min'
    }
  ],
  'topic-yggdrasil-loki': [
    {
      id: 'rep-4',
      topicId: 'topic-yggdrasil-loki',
      content: 'Total sentido! O Loki segurando o multiverso sozinho é o sacrifício perfeito. O Destino se apresentará não como vilão, mas como "o salvador que pegou o fardo quando Loki não aguentou mais as incursões".',
      authorName: 'Asgardian_Scholar',
      upvotes: 67,
      isBestAnswer: true,
      createdAt: 'Há 5 horas'
    },
    {
      id: 'rep-5',
      topicId: 'topic-yggdrasil-loki',
      content: 'E isso prepara o confronto direto de Thor e Loki reencontrando-se antes do colapso em Guerras Secretas!',
      authorName: 'Thor_Odinson_616',
      upvotes: 29,
      isBestAnswer: false,
      createdAt: 'Há 3 horas'
    }
  ],
  'topic-ff-arrival': [
    {
      id: 'rep-6',
      topicId: 'topic-ff-arrival',
      content: 'A Balsa Salva-Vidas (Life Raft) do Reed Richards será o veículo que trará o Quarteto e seus filhos através do vazio dimensional bem no clímax do filme!',
      authorName: 'FutureFoundation_Reed',
      upvotes: 52,
      isBestAnswer: true,
      createdAt: 'Há 18 horas'
    }
  ],
  'topic-secret-wars-reset': [
    {
      id: 'rep-7',
      topicId: 'topic-secret-wars-reset',
      content: 'Com certeza. Kevin Feige já deu a entender que Guerras Secretas será o ponto de reset definitivo para integrar os mutantes de forma natural sem precisar de desculpas multiversais.',
      authorName: 'CinemaMarvel_BR',
      upvotes: 38,
      isBestAnswer: true,
      createdAt: 'Há 1 dia'
    }
  ]
};

type CategoryFilter = 'Todas' | 'Teorias & RDJ' | 'Incursões & Multiverso' | 'Dúvidas MCU' | 'Quarteto & Latveria' | 'Guerras Secretas';
type SortOption = 'votes' | 'recent' | 'replies';

export const CommunityPage: React.FC<CommunityPageProps> = () => {
  // Current logged in Firebase user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Topics & Replies state (synchronized with Firestore + Local Fallback)
  const [topics, setTopics] = useState<CommunityTopic[]>(() => {
    const saved = localStorage.getItem('mcu_community_topics');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return SEED_TOPICS;
  });

  const [repliesMap, setRepliesMap] = useState<Record<string, TopicReply[]>>(() => {
    const saved = localStorage.getItem('mcu_community_replies');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return SEED_REPLIES;
  });

  // Polls state
  const [polls, setPolls] = useState<CommunityPoll[]>(() => {
    const saved = localStorage.getItem('mcu_doomsday_polls');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_POLLS;
  });

  // Selected Active Topic for Reddit / Yahoo Answers detailed discussion view
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic | null>(null);
  const [newReplyText, setNewReplyText] = useState('');
  const [guestReplyAuthor, setGuestReplyAuthor] = useState('');

  // Topic creation modal
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState<CommunityTopic['category']>('Teorias & RDJ');
  const [newTopicIsQuestion, setNewTopicIsQuestion] = useState(true);
  const [newTopicTags, setNewTopicTags] = useState('');
  const [guestAuthorName, setGuestAuthorName] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Todas');
  const [sortOption, setSortOption] = useState<SortOption>('votes');

  // Quiz state
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time topics
  useEffect(() => {
    try {
      const q = query(collection(db, 'topics'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreTopics: CommunityTopic[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || '',
              content: data.content || '',
              category: data.category || 'Teorias & RDJ',
              authorId: data.authorId,
              authorName: data.authorName || 'Vigilante Multiversal',
              authorPhoto: data.authorPhoto,
              upvotes: data.upvotes || 0,
              repliesCount: data.repliesCount || 0,
              tags: data.tags || [],
              createdAt: data.createdAt?.toDate ? 'Recentemente' : (data.createdAt || 'Agora mesmo'),
              isQuestion: data.isQuestion ?? true,
              bestAnswerId: data.bestAnswerId
            };
          });

          // Merge with initial seed topics to always have rich content
          const merged = [...firestoreTopics];
          SEED_TOPICS.forEach(seed => {
            if (!merged.some(t => t.id === seed.id)) {
              merged.push(seed);
            }
          });

          setTopics(merged);
          localStorage.setItem('mcu_community_topics', JSON.stringify(merged));
        }
      }, (error) => {
        console.warn('Firestore snapshot notice (using cached data):', error);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore initialization notice:', e);
    }
  }, []);

  // Listen to Firestore replies for active topic
  useEffect(() => {
    if (!selectedTopic) return;
    try {
      const repliesRef = collection(db, 'replies');
      const unsubscribe = onSnapshot(repliesRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedReplies: TopicReply[] = [];
          snapshot.docs.forEach((docSnap) => {
            const d = docSnap.data();
            if (d.topicId === selectedTopic.id) {
              fetchedReplies.push({
                id: docSnap.id,
                topicId: d.topicId,
                content: d.content || '',
                authorId: d.authorId,
                authorName: d.authorName || 'Comentarista',
                authorPhoto: d.authorPhoto,
                upvotes: d.upvotes || 0,
                isBestAnswer: !!d.isBestAnswer,
                createdAt: d.createdAt?.toDate ? 'Recentemente' : (d.createdAt || 'Agora mesmo')
              });
            }
          });

          if (fetchedReplies.length > 0) {
            setRepliesMap(prev => ({
              ...prev,
              [selectedTopic.id]: fetchedReplies
            }));
          }
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Replies listener notice:', e);
    }
  }, [selectedTopic]);

  // Handle Logout
  const handleLogout = async () => {
    sound.playClick();
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  // Upvote Topic
  const handleUpvoteTopic = async (topicId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();

    const updated = topics.map((t) => {
      if (t.id !== topicId) return t;
      const isAlready = t.userVoted;
      return {
        ...t,
        upvotes: isAlready ? Math.max(0, t.upvotes - 1) : t.upvotes + 1,
        userVoted: !isAlready
      };
    });
    setTopics(updated);
    localStorage.setItem('mcu_community_topics', JSON.stringify(updated));

    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic(prev => prev ? {
        ...prev,
        upvotes: prev.userVoted ? Math.max(0, prev.upvotes - 1) : prev.upvotes + 1,
        userVoted: !prev.userVoted
      } : null);
    }

    // Try firestore update
    try {
      const topicRef = doc(db, 'topics', topicId);
      await updateDoc(topicRef, {
        upvotes: increment(1)
      });
    } catch {
      /* fallback to local */
    }
  };

  // Upvote Reply
  const handleUpvoteReply = async (topicId: string, replyId: string) => {
    sound.playClick();
    setRepliesMap(prev => {
      const currentList = prev[topicId] || [];
      const nextList = currentList.map(r => {
        if (r.id !== replyId) return r;
        const isVoted = r.userVoted;
        return {
          ...r,
          upvotes: isVoted ? Math.max(0, r.upvotes - 1) : r.upvotes + 1,
          userVoted: !isVoted
        };
      });
      const updated = { ...prev, [topicId]: nextList };
      localStorage.setItem('mcu_community_replies', JSON.stringify(updated));
      return updated;
    });

    try {
      const repRef = doc(db, 'replies', replyId);
      await updateDoc(repRef, {
        upvotes: increment(1)
      });
    } catch {
      /* ignore */
    }
  };

  // Mark as Best Answer (Yahoo Answers style)
  const handleToggleBestAnswer = (topicId: string, replyId: string) => {
    sound.playSuccess();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#fbbf24', '#ffffff']
    });

    setRepliesMap(prev => {
      const currentList = prev[topicId] || [];
      const nextList = currentList.map(r => ({
        ...r,
        isBestAnswer: r.id === replyId ? !r.isBestAnswer : false
      }));
      const updated = { ...prev, [topicId]: nextList };
      localStorage.setItem('mcu_community_replies', JSON.stringify(updated));
      return updated;
    });
  };

  // Submit New Reply (MCU community comment)
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      sound.playArcanePulse();
      setIsAuthModalOpen(true);
      return;
    }
    if (!selectedTopic || !newReplyText.trim()) return;

    sound.playSuccess();

    const authorName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Vigilante de Latveria';
    const authorPhoto = currentUser.photoURL || undefined;

    const newReplyItem: TopicReply = {
      id: `reply-${Date.now()}`,
      topicId: selectedTopic.id,
      content: newReplyText.trim(),
      authorId: currentUser.uid,
      authorName,
      authorPhoto,
      upvotes: 1,
      isBestAnswer: false,
      createdAt: 'Agora mesmo',
      userVoted: true
    };

    // Update local state
    setRepliesMap(prev => {
      const list = prev[selectedTopic.id] || [];
      const updated = {
        ...prev,
        [selectedTopic.id]: [...list, newReplyItem]
      };
      localStorage.setItem('mcu_community_replies', JSON.stringify(updated));
      return updated;
    });

    // Update topics repliesCount
    setTopics(prev => {
      const updated = prev.map(t => t.id === selectedTopic.id ? { ...t, repliesCount: t.repliesCount + 1 } : t);
      localStorage.setItem('mcu_community_topics', JSON.stringify(updated));
      return updated;
    });

    setSelectedTopic(prev => prev ? { ...prev, repliesCount: prev.repliesCount + 1 } : null);
    setNewReplyText('');

    // Try save to Firestore
    try {
      await addDoc(collection(db, 'replies'), {
        topicId: selectedTopic.id,
        content: newReplyItem.content,
        authorId: currentUser?.uid || 'guest',
        authorName,
        authorPhoto: authorPhoto || '',
        upvotes: 1,
        isBestAnswer: false,
        createdAt: serverTimestamp()
      });

      const topicRef = doc(db, 'topics', selectedTopic.id);
      await updateDoc(topicRef, {
        repliesCount: increment(1)
      });
    } catch (err) {
      console.warn('Saved reply locally (Firestore sync queued):', err);
    }
  };

  // Submit New Topic
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      sound.playArcanePulse();
      setIsAuthModalOpen(true);
      return;
    }
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;

    sound.playSuccess();
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#f59e0b', '#ffffff']
    });

    const authorName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Cidadão de Latveria';
    const authorPhoto = currentUser.photoURL || undefined;

    const parsedTags = newTopicTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (parsedTags.length === 0) {
      parsedTags.push(newTopicCategory, 'Doomsday');
    }

    const newTopicItem: CommunityTopic = {
      id: `topic-${Date.now()}`,
      title: newTopicTitle.trim(),
      content: newTopicContent.trim(),
      category: newTopicCategory,
      authorId: currentUser.uid,
      authorName,
      authorPhoto,
      upvotes: 1,
      repliesCount: 0,
      tags: parsedTags,
      createdAt: 'Agora mesmo',
      isQuestion: newTopicIsQuestion,
      userVoted: true
    };

    const updated = [newTopicItem, ...topics];
    setTopics(updated);
    localStorage.setItem('mcu_community_topics', JSON.stringify(updated));

    // Try push to Firestore
    try {
      await addDoc(collection(db, 'topics'), {
        title: newTopicItem.title,
        content: newTopicItem.content,
        category: newTopicItem.category,
        authorId: currentUser.uid,
        authorName,
        authorPhoto: authorPhoto || '',
        upvotes: 1,
        repliesCount: 0,
        tags: newTopicItem.tags,
        isQuestion: newTopicItem.isQuestion,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Saved topic locally (Firestore sync queued):', err);
    }

    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicTags('');
    setGuestAuthorName('');
    setIsCreatingTopic(false);
  };

  // Vote on Polls
  const handleVotePoll = (pollId: string, optionId: string) => {
    sound.playClick();
    const updated = polls.map(p => {
      if (p.id !== pollId) return p;
      if (p.userVotedId) return p; // already voted
      return {
        ...p,
        userVotedId: optionId,
        totalVotes: p.totalVotes + 1,
        options: p.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
      };
    });
    setPolls(updated);
    localStorage.setItem('mcu_doomsday_polls', JSON.stringify(updated));
  };

  // Quiz Handling
  const handleQuizAnswer = (variant: string) => {
    sound.playClick();
    const nextAnswers = [...quizAnswers, variant];
    setQuizAnswers(nextAnswers);

    if (currentQuizStep + 1 < DOOM_QUIZ_QUESTIONS.length) {
      setCurrentQuizStep(currentQuizStep + 1);
    } else {
      const counts: Record<string, number> = {};
      nextAnswers.forEach(ans => { counts[ans] = (counts[ans] || 0) + 1; });
      let winner = nextAnswers[0];
      let maxC = 0;
      for (const k in counts) {
        if (counts[k] > maxC) {
          maxC = counts[k];
          winner = k;
        }
      }
      setQuizResult(winner);
      sound.playSuccess();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#10b981', '#fbbf24', '#e2e8f0']
      });
    }
  };

  const resetQuiz = () => {
    sound.playClick();
    setCurrentQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  // Filtered & Sorted topics
  const filteredTopics = topics
    .filter(t => {
      const matchesCategory = categoryFilter === 'Todas' || t.category === categoryFilter;
      const matchesSearch = 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'votes') return b.upvotes - a.upvotes;
      if (sortOption === 'replies') return b.repliesCount - a.repliesCount;
      return 0; // default order
    });

  const activeReplies = selectedTopic ? (repliesMap[selectedTopic.id] || []) : [];

  return (
    <div className="w-full flex flex-col items-center pb-28 pt-2 px-3 sm:px-4 max-w-3xl mx-auto space-y-4">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER */}
      {/* ======================================================== */}
      <div className="w-full flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-100 flex items-center gap-2">
              Comunidade & Debates
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Fórum MCU
              </span>
            </h1>
            <p className="text-[10.5px] text-slate-400 font-mono">
              Perguntas, respostas e teorias dos fãs sincronizadas em tempo real
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. OFFICIAL BRAZIL COUNTDOWN: 17 DE DEZEMBRO DE 2026 */}
      {/* ======================================================== */}
      <CountdownCard />

      {/* ======================================================== */}
      {/* 3. COMMUNITY DEBATES & QUESTIONS */}
      {/* ======================================================== */}
      {!selectedTopic ? (
        <div className="w-full space-y-3 pt-1">
          
          {/* Section Banner with "Criar Tópico" Action */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Debates, Perguntas & Teorias da Comunidade
              </h2>
              <p className="text-[11px] text-slate-400">
                Faça sua pergunta ou compartilhe suas teorias com outros fãs do MCU
              </p>
            </div>

            <button
              onClick={() => {
                if (!currentUser) {
                  sound.playArcanePulse();
                  setIsAuthModalOpen(true);
                  return;
                }
                sound.playArcanePulse();
                setIsCreatingTopic(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all touch-manipulation cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Criar Pergunta / Teoria</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-2 bg-[#03060a]/90 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pesquisar debates, dúvidas ou teorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#020306] border border-slate-800 focus:border-emerald-500 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
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

              {/* Sort Order Selector */}
              <div className="flex items-center gap-1 bg-[#020306] border border-slate-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => { sound.playClick(); setSortOption('votes'); }}
                  className={`px-2 py-1 rounded-lg text-[10.5px] font-mono transition-all ${
                    sortOption === 'votes' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Ordenar pelos mais votados"
                >
                  Top Votos
                </button>
                <button
                  onClick={() => { sound.playClick(); setSortOption('replies'); }}
                  className={`px-2 py-1 rounded-lg text-[10.5px] font-mono transition-all ${
                    sortOption === 'replies' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Ordenar pelos mais comentados"
                >
                  Mais Respostas
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar text-xs">
              {(['Todas', 'Teorias & RDJ', 'Incursões & Multiverso', 'Dúvidas MCU', 'Quarteto & Latveria', 'Guerras Secretas'] as CategoryFilter[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { sound.playClick(); setCategoryFilter(cat); }}
                  className={`px-2.5 py-1 rounded-xl font-mono text-[10.5px] whitespace-nowrap transition-all touch-manipulation cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                      : 'bg-[#020306] border border-slate-800/90 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Topics List (Reddit / Yahoo Answers feed) */}
          <div className="space-y-2.5">
            {filteredTopics.length === 0 ? (
              <div className="text-center py-10 border border-slate-800 rounded-2xl bg-[#03060a]/60">
                <p className="text-xs text-slate-400 font-mono">Nenhum debate encontrado com os filtros atuais.</p>
                <button
                  onClick={() => { setSearchTerm(''); setCategoryFilter('Todas'); }}
                  className="mt-2.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => {
                    sound.playArcanePulse();
                    setSelectedTopic(topic);
                  }}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#03060a]/90 border border-slate-800/90 hover:border-emerald-500/60 hover:bg-[#050912] transition-all cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.4)] space-y-2.5 backdrop-blur-md group select-none"
                  id={`topic-item-${topic.id}`}
                >
                  {/* Topic Metadata & Badge */}
                  <div className="flex items-center justify-between flex-wrap gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9.5px] font-mono uppercase font-bold px-2 py-0.5 rounded-md border ${
                        topic.isQuestion
                          ? 'bg-blue-950/40 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {topic.isQuestion ? '❓ Pergunta' : '💬 Teoria'}
                      </span>
                      <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                        {topic.category}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {topic.createdAt}
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {topic.title}
                  </h3>

                  {/* Topic Short Preview */}
                  <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed font-normal">
                    {topic.content}
                  </p>

                  {/* Footer: Tags + Upvote + Comments Count + Yahoo/Reddit indicator */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <span className="text-slate-300 font-medium">Por: {topic.authorName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Replies Counter */}
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400/90 bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {topic.repliesCount} {topic.repliesCount === 1 ? 'resposta' : 'respostas'}
                      </span>

                      {/* Upvote Button */}
                      <button
                        onClick={(e) => handleUpvoteTopic(topic.id, e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono transition-all touch-manipulation cursor-pointer ${
                          topic.userVoted
                            ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'bg-[#020306] text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{topic.upvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      ) : (
        /* ======================================================== */
        /* DETAILED TOPIC THREAD VIEW (REDDIT & YAHOO ANSWERS STYLE) */
        /* ======================================================== */
        <div className="w-full space-y-4 pt-1">
          {/* Back button */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedTopic(null);
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para todos os debates</span>
          </button>

          {/* Active Topic Main Box */}
          <div className="w-full bg-[#03060a] border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-3.5 backdrop-blur-md">
            
            {/* Header info */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-md border ${
                  selectedTopic.isQuestion
                    ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                }`}>
                  {selectedTopic.isQuestion ? '❓ Pergunta da Comunidade' : '💬 Teoria Multiversal'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  {selectedTopic.category}
                </span>
              </div>
              <span className="text-[10.5px] font-mono text-slate-500">
                Postado {selectedTopic.createdAt}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-base sm:text-xl font-black text-white leading-snug">
              {selectedTopic.title}
            </h2>

            {/* Author bar */}
            <div className="flex items-center gap-2.5 py-1 text-xs text-slate-300 font-mono border-b border-slate-800/80 pb-3">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-emerald-400 font-bold">
                {selectedTopic.authorName[0].toUpperCase()}
              </div>
              <div>
                <span className="font-bold text-white">{selectedTopic.authorName}</span>
                <span className="text-[10px] text-slate-400 block">Autor do Tópico</span>
              </div>
            </div>

            {/* Full text */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
              {selectedTopic.content}
            </p>

            {/* Tags & Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 flex-wrap gap-2">
              <div className="flex gap-1.5 flex-wrap">
                {selectedTopic.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleUpvoteTopic(selectedTopic.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                  selectedTopic.userVoted
                    ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-[#020306] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{selectedTopic.upvotes} Votos</span>
              </button>
            </div>
          </div>

          {/* REPLIES / ANSWERS SECTION */}
          <div className="w-full space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-slate-300 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Respostas da Comunidade ({activeReplies.length})
              </h3>
              <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                Destaque para a resposta mais curtida
              </span>
            </div>

            {/* Add Reply Input Form */}
            <form onSubmit={handleSendReply} className="w-full bg-[#03060a] border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <label className="block text-xs font-mono text-slate-300 font-bold">
                {selectedTopic.isQuestion ? 'Sua Resposta / Opinião:' : 'Deixe seu Comentário / Contra-argumento:'}
              </label>

              {!currentUser ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <LogIn className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Faça login para responder</p>
                      <p className="text-[11px] text-slate-400">Entre ou crie uma conta para participar dos debates e teorias do MCU.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playArcanePulse();
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all shrink-0 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Entrar / Cadastrar</span>
                  </button>
                </div>
              ) : (
                <>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escreva sua resposta embasada no multiverso, filmes ou HQs..."
                    value={newReplyText}
                    onChange={(e) => setNewReplyText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#020306] border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none leading-relaxed"
                  />

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <span>Respondendo como <strong className="text-emerald-400">{currentUser.displayName || currentUser.email?.split('@')[0]}</strong></span>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all ml-auto touch-manipulation cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Resposta</span>
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Replies List */}
            {activeReplies.length === 0 ? (
              <div className="text-center py-8 border border-slate-800/80 rounded-2xl bg-[#03060a]/60">
                <p className="text-xs text-slate-400 font-mono">
                  Seja o primeiro a responder a esta {selectedTopic.isQuestion ? 'pergunta' : 'discussão'}!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {(() => {
                  const highestUpvotes = activeReplies.length > 0 ? Math.max(...activeReplies.map(r => r.upvotes)) : 0;
                  const topLikedReply = highestUpvotes > 0 ? activeReplies.find(r => r.upvotes === highestUpvotes) : null;

                  return activeReplies.map((reply) => {
                    const isMostLiked = topLikedReply ? reply.id === topLikedReply.id : false;

                    return (
                      <div
                        key={reply.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all space-y-2 ${
                          isMostLiked
                            ? 'bg-gradient-to-r from-emerald-950/40 via-[#03060a] to-[#03060a] border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40'
                            : 'bg-[#03060a]/90 border-slate-800'
                        }`}
                      >
                        {/* Header: Author + Most Liked answer badge */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            {reply.authorPhoto ? (
                              <img
                                src={reply.authorPhoto}
                                alt={reply.authorName}
                                referrerPolicy="no-referrer"
                                className="w-6 h-6 rounded-full border border-emerald-500/40 object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                                {reply.authorName[0].toUpperCase()}
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-200">
                              {reply.authorName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              • {reply.createdAt}
                            </span>
                          </div>

                          {isMostLiked && (
                            <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500 text-slate-950 flex items-center gap-1 shadow-[0_0_12px_rgba(245,158,11,0.35)]">
                              <Flame className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                              Resposta mais curtida
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                          {reply.content}
                        </p>

                        {/* Reply footer: Upvotes and highlight state */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-xs">
                          <div className="flex items-center gap-1.5 text-[10.5px] font-mono">
                            {isMostLiked ? (
                              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                <Sparkles className="w-3 h-3 text-emerald-400" />
                                Mais votada pela comunidade
                              </span>
                            ) : (
                              <span className="text-slate-500">
                                Opinião da comunidade MCU
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleUpvoteReply(selectedTopic.id, reply.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              reply.userVoted
                                ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.35)]'
                                : 'bg-[#020306] text-slate-400 hover:text-white hover:border-emerald-500/50 border border-slate-800'
                            }`}
                            title="Curtir resposta"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{reply.upvotes} {reply.upvotes === 1 ? 'curtida' : 'curtidas'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. COMMUNITY POLLS & INTERACTIVE VOTINGS */}
      {/* ======================================================== */}
      <div className="w-full space-y-3 pt-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          Enquetes Oficiais da Comunidade MCU
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {polls.map((poll) => (
            <div
              key={poll.id}
              className="p-4 rounded-2xl bg-[#03060a]/90 border border-slate-800 space-y-3 backdrop-blur-md"
            >
              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                {poll.question}
              </h4>

              <div className="space-y-2">
                {poll.options.map((opt) => {
                  const percent = Math.round((opt.votes / poll.totalVotes) * 100) || 0;
                  const isSelected = poll.userVotedId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleVotePoll(poll.id, opt.id)}
                      className={`w-full p-2.5 rounded-xl border relative overflow-hidden text-left transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/40 text-white'
                          : 'border-slate-800 bg-[#020306] text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {/* Background Progress Fill */}
                      <div
                        style={{ width: `${percent}%` }}
                        className={`absolute inset-y-0 left-0 transition-all duration-500 opacity-25 ${
                          isSelected ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      />

                      <div className="relative flex justify-between items-center text-xs z-10">
                        <span className="font-medium pr-2">{opt.text}</span>
                        <span className="font-mono text-emerald-400 font-bold shrink-0">{percent}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 text-right font-mono">
                Total de Votos: {poll.totalVotes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE DOCTOR DOOM VARIANT QUIZ */}
      {/* ======================================================== */}
      <div className="w-full bg-[#03060a]/90 border border-slate-800/90 rounded-3xl p-5 my-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Mini-Teste do Multiverso
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
            3 PERGUNTAS
          </span>
        </div>

        <h4 className="text-sm font-bold text-white mb-3">
          Descubra: Qual Variante do Doutor Destino é Você?
        </h4>

        {!quizResult ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-300 font-medium">
              Pergunta {currentQuizStep + 1} de {DOOM_QUIZ_QUESTIONS.length}: {DOOM_QUIZ_QUESTIONS[currentQuizStep].question}
            </p>
            <div className="space-y-2">
              {DOOM_QUIZ_QUESTIONS[currentQuizStep].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(opt.variant)}
                  className="w-full p-2.5 rounded-xl bg-[#020306] hover:bg-[#06080d] border border-slate-800 hover:border-emerald-500/60 text-xs text-left text-slate-300 hover:text-white transition-all active:scale-98"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-400/80 text-center space-y-2"
          >
            <Trophy className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-slate-300 uppercase tracking-wider font-mono">
              Seu Destino Multiversal Revelado:
            </p>
            <h5 className="text-base font-black text-emerald-400">
              « {quizResult} »
            </h5>
            <p className="text-xs text-slate-300 font-normal">
              Sua inteligência, ambição e foco absoluto farão de você o soberano do Battleworld!
            </p>
            <button
              onClick={resetQuiz}
              className="mt-2 px-3.5 py-1.5 rounded-xl bg-[#020306] border border-slate-700 text-xs text-slate-300 hover:text-white font-mono"
            >
              Fazer Teste Novamente
            </button>
          </motion.div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL TO CREATE NEW TOPIC / QUESTION (REDDIT / YAHOO) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isCreatingTopic && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#03060a] border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-[0_0_35px_rgba(16,185,129,0.25)] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    Novo Tópico de Debate ou Pergunta
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreatingTopic(false)}
                  className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
                
                {/* Topic Type: Question vs Theory */}
                <div className="flex gap-2 p-1 bg-[#020306] border border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNewTopicIsQuestion(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      newTopicIsQuestion ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    ❓ Pergunta da Comunidade
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTopicIsQuestion(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      !newTopicIsQuestion ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    💬 Teoria / Discussão Multiversal
                  </button>
                </div>

                {!currentUser && (
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Seu Nome ou Codinome</label>
                    <input
                      type="text"
                      placeholder="Ex: Reed_838, PeterParker_BR..."
                      value={guestAuthorName}
                      onChange={(e) => setGuestAuthorName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#020306] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Categoria</label>
                  <select
                    value={newTopicCategory}
                    onChange={(e) => setNewTopicCategory(e.target.value as CommunityTopic['category'])}
                    className="w-full p-2.5 rounded-xl bg-[#020306] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Teorias & RDJ">Teorias & Robert Downey Jr.</option>
                    <option value="Incursões & Multiverso">Incursões & Multiverso</option>
                    <option value="Dúvidas MCU">Dúvidas sobre o MCU</option>
                    <option value="Quarteto & Latveria">Quarteto Fantástico & Latveria</option>
                    <option value="Guerras Secretas">Guerras Secretas & Battleworld</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {newTopicIsQuestion ? 'Sua Pergunta' : 'Título da sua Teoria'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={newTopicIsQuestion ? 'Ex: Por que a TVA não impediu as incursões antes?' : 'Ex: A verdadeira razão pela qual Destino precisa da Joia do Tempo...'}
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#020306] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {newTopicIsQuestion ? 'Detalhes da Dúvida' : 'Argumentos & Conexões da Teoria'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explique os detalhes para a comunidade debater e responder..."
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#020306] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="Ex: RDJ, Destino, Battleworld, Loki"
                    value={newTopicTags}
                    onChange={(e) => setNewTopicTags(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#020306] border border-slate-800 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Publicar Tópico
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingTopic(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#020306] border border-slate-800 text-slate-300 font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* AUTHENTICATION MODAL (GOOGLE / EMAIL / SENHA) */}
      {/* ======================================================== */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
};
