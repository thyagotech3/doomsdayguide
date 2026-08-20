import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Sparkles, User as UserIcon, LogIn, Settings } from 'lucide-react';
import { sound } from '../utils/audio';
import { PageTab } from '../types';
import { auth, onAuthStateChanged, User } from '../lib/firebase';
import { AuthModal } from './AuthModal';
import { ProfileSettingsModal } from './ProfileSettingsModal';

interface HeaderNavProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const getFirstName = (user: User) => {
    if (user.displayName?.trim()) {
      return user.displayName.trim().split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Vigilante';
  };

  const handleAccountClick = () => {
    sound.playArcanePulse();
    if (currentUser) {
      setIsProfileModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#020305]/85 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        {/* Brand logo & OS status */}
        <div
          onClick={() => {
            sound.playArcanePulse();
            onSelectTab('trilha');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 via-slate-900 to-emerald-950 border border-slate-700/80 group-hover:border-emerald-500/80 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-all">
            <Shield className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase group-hover:text-emerald-400 transition-colors">
                DOOMSDAY GUIDE
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              </div>
            </div>
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              LATVERIA OS v1.0 • MCU
            </p>
          </div>
        </div>

        {/* Right Controls: Sound Toggle and Account/Profile Button */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              isMuted
                ? 'bg-[#06080d] border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:border-emerald-400'
            }`}
            title={isMuted ? 'Ativar Efeitos Sonoros Arcanos' : 'Desativar Som'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="text-[10px] tracking-wider hidden sm:inline uppercase">
              {isMuted ? 'Mudo' : 'Som Ativo'}
            </span>
          </button>

          {/* User Account / Login Button (To the right of sound) */}
          {currentUser ? (
            <button
              onClick={handleAccountClick}
              className="px-2.5 py-1.5 rounded-xl bg-[#03060a] hover:bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-slate-100 flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all cursor-pointer group"
              title="Configurações da Conta e Apelido"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Avatar'}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full border border-emerald-400 object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-[10px] font-black text-emerald-300">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors max-w-[100px] truncate">
                {getFirstName(currentUser)}
              </span>
              <Settings className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 transition-colors hidden sm:block" />
            </button>
          ) : (
            <button
              onClick={handleAccountClick}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all cursor-pointer active:scale-95"
              title="Entrar ou Criar Conta"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] tracking-wide">Fazer login</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(newName) => {
          // Force update local user object representation
          if (currentUser) {
            setCurrentUser({
              ...currentUser,
              displayName: newName
            } as User);
          }
        }}
      />
    </>
  );
};

