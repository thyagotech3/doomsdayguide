import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Check, 
  Edit3, 
  Mail, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  auth, 
  updateProfile, 
  signOut, 
  User 
} from '../lib/firebase';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onProfileUpdated?: (newDisplayName: string) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated
}) => {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setNickname(currentUser.displayName || '');
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleUpdateNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (!nickname.trim()) {
      setErrorMsg('O apelido não pode ficar vazio.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    sound.playClick();

    try {
      await updateProfile(auth.currentUser, {
        displayName: nickname.trim()
      });

      setSuccessMsg('Apelido atualizado com sucesso!');
      sound.playSuccess();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b']
      });

      if (onProfileUpdated) {
        onProfileUpdated(nickname.trim());
      }
    } catch (err: unknown) {
      console.error('Error updating nickname:', err);
      const message = err instanceof Error ? err.message : 'Falha ao atualizar apelido.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    sound.playClick();
    try {
      await signOut(auth);
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const initialLetter = (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase();
  const firstName = currentUser.displayName?.trim() ? currentUser.displayName.trim().split(' ')[0] : (currentUser.email?.split('@')[0] || 'Vigilante');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-[#03060a] border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(16,185,129,0.25)] space-y-4 text-slate-200 relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Configurações da Conta
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Gerencie seu apelido e dados do perfil
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Card */}
        <div className="p-3.5 rounded-2xl bg-[#020306] border border-slate-800 flex items-center gap-3.5">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'Avatar'}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-2xl border-2 border-emerald-400 object-cover shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-400 flex items-center justify-center text-base font-black text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              {initialLetter}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white truncate block">
                {currentUser.displayName || 'Sem Apelido Definido'}
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate font-mono flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-slate-500" />
              {currentUser.email || 'Autenticado via Google'}
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Edit Nickname Form */}
        <form onSubmit={handleUpdateNickname} className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              Alterar Apelido / Codinome:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={30}
                placeholder="Ex: Tony Stark 616, Agente TVA..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#020306] border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[10.5px] text-slate-500 font-mono">
              Este é o nome que aparecerá no topo do aplicativo e nas suas publicações da comunidade.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={loading || !nickname.trim() || nickname.trim() === currentUser.displayName}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all touch-manipulation cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Apelido</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Modal Footer: Logout Action */}
        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-red-950/30 border border-red-500/30 hover:bg-red-900/40 text-red-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
