import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Globe, 
  Sparkles, 
  MessageSquare 
} from 'lucide-react';
import { PageTab } from '../types';
import { sound } from '../utils/audio';

interface BottomNavBarProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const tabs: { id: PageTab; label: string; icon: React.ElementType }[] = [
    { id: 'trilha', label: 'Trilha', icon: Sparkles },
    { id: 'personagens', label: 'Heróis & Vilões', icon: Users },
    { id: 'multiverso', label: 'Multiverso', icon: Globe },
    { id: 'comunidade', label: 'Comunidade', icon: MessageSquare }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#020305]/95 backdrop-blur-2xl border-t border-slate-800/90 px-2 sm:px-3 pt-1.5 pb-safe pb-2 sm:pb-2.5 shadow-[0_-10px_35px_rgba(0,0,0,0.9)]">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'trilha') {
                  sound.playArcanePulse();
                } else {
                  sound.playClick();
                }
                onSelectTab(tab.id);
              }}
              className={`min-h-[44px] flex flex-col items-center justify-center py-1 relative transition-all active:scale-95 focus:outline-none touch-manipulation cursor-pointer ${
                isActive ? 'opacity-100' : 'opacity-60 hover:opacity-90'
              }`}
              id={`tab-${tab.id}`}
              aria-label={tab.label}
            >
              <div className="relative flex items-center justify-center p-0.5">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'text-slate-300'
                  }`}
                />
              </div>
              <span
                className={`text-[9px] sm:text-[9.5px] font-mono tracking-wider transition-colors uppercase truncate max-w-full px-0.5 ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,1)] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
      {/* Sleek bottom home indicator bar */}
      <div className="h-1 w-20 sm:w-24 bg-slate-800/90 mx-auto mt-1 rounded-full"></div>
    </nav>
  );
};
