import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTab } from './types';
import { CosmicBackground } from './components/CosmicBackground';
import { HeaderNav } from './components/HeaderNav';
import { BottomNavBar } from './components/BottomNavBar';
import { EssentialTrailPage } from './components/EssentialTrailPage';
import { CharactersPage } from './components/CharactersPage';
import { MultiversePage } from './components/MultiversePage';
import { CommunityPage } from './components/CommunityPage';
import { sound } from './utils/audio';

const TABS_ORDER: PageTab[] = [
  'trilha',
  'personagens',
  'multiverso',
  'comunidade'
];

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('trilha');
  const [prevTab, setPrevTab] = useState<PageTab>('trilha');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Watched MCU Items persistent state (loaded from user's cache/localStorage)
  const [watchedIds, setWatchedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mcu_watched_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    // Default initial state: 0% progress (clean slate)
    return [];
  });

  useEffect(() => {
    localStorage.setItem('mcu_watched_items', JSON.stringify(watchedIds));
  }, [watchedIds]);

  const handleToggleWatched = (id: string) => {
    setWatchedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetProgress = () => {
    setWatchedIds([]);
    localStorage.setItem('mcu_watched_items', JSON.stringify([]));
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.isMuted = nextMuted;
    if (!nextMuted) {
      sound.playClick();
    }
  };

  const handleSelectTab = (tab: PageTab) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direction for sliding animation
  const currentIndex = TABS_ORDER.indexOf(activeTab);
  const prevIndex = TABS_ORDER.indexOf(prevTab);
  const direction = currentIndex >= prevIndex ? 1 : -1;

  return (
    <div className="relative min-h-screen bg-[#030705] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      {/* Dynamic Cosmic Emerald Nebula Background */}
      <CosmicBackground />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Sticky Header */}
        <HeaderNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {/* Page Content with Slide/Fade Transition */}
        <main className="flex-1 w-full flex flex-col items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              {activeTab === 'trilha' && (
                <EssentialTrailPage
                  onSelectTab={handleSelectTab}
                  watchedIds={watchedIds}
                  onToggleWatched={handleToggleWatched}
                  onResetProgress={handleResetProgress}
                />
              )}

              {activeTab === 'personagens' && (
                <CharactersPage
                  onSelectTab={handleSelectTab}
                />
              )}

              {activeTab === 'multiverso' && (
                <MultiversePage
                  onSelectTab={handleSelectTab}
                />
              )}

              {activeTab === 'comunidade' && (
                <CommunityPage
                  onSelectTab={handleSelectTab}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />
      </div>
    </div>
  );
}
