import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Sparkles, Trophy, Gift, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useGame();

  const getIcon = (type: string) => {
    switch (type) {
      case 'level':
        return <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />;
      case 'loot':
        return <Gift className="w-5 h-5 text-yellow-300" />;
      case 'xp':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'level':
        return 'rpg-glass-gold border-amber-400 text-amber-200 glow-gold';
      case 'loot':
        return 'bg-amber-950/90 border-amber-500/80 text-amber-200 shadow-xl';
      case 'warning':
        return 'bg-rose-950/90 border-rose-500/80 text-rose-200 glow-red';
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200';
      default:
        return 'bg-slate-900/90 border-slate-700 text-slate-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-start justify-between gap-3 ${getTypeStyle(
              toast.type
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{getIcon(toast.type)}</div>
              <div>
                <h4 className="font-rpg font-bold text-xs uppercase tracking-wide">{toast.title}</h4>
                <p className="text-xs text-slate-300 font-sans mt-0.5">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
