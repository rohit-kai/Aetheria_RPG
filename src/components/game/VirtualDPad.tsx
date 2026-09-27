import React from 'react';
import { useGame } from '../../context/GameContext';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap, Shield, Flame } from 'lucide-react';

export const VirtualDPad: React.FC = () => {
  const { movePlayer, castSkill } = useGame();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full max-w-4xl mx-auto px-4 py-2 pointer-events-auto">
      {/* Directional Pad */}
      <div className="relative w-36 h-36 bg-slate-900/80 backdrop-blur-md rounded-full border-2 border-amber-500/30 p-2 shadow-2xl flex items-center justify-center">
        {/* UP */}
        <button
          onClick={() => movePlayer(0, -1)}
          className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-800 hover:bg-amber-600 active:scale-95 text-amber-300 rounded-lg flex items-center justify-center shadow border border-amber-500/30 transition-all"
          aria-label="Move Up"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        {/* DOWN */}
        <button
          onClick={() => movePlayer(0, 1)}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-800 hover:bg-amber-600 active:scale-95 text-amber-300 rounded-lg flex items-center justify-center shadow border border-amber-500/30 transition-all"
          aria-label="Move Down"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        {/* LEFT */}
        <button
          onClick={() => movePlayer(-1, 0)}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 hover:bg-amber-600 active:scale-95 text-amber-300 rounded-lg flex items-center justify-center shadow border border-amber-500/30 transition-all"
          aria-label="Move Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* RIGHT */}
        <button
          onClick={() => movePlayer(1, 0)}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 hover:bg-amber-600 active:scale-95 text-amber-300 rounded-lg flex items-center justify-center shadow border border-amber-500/30 transition-all"
          aria-label="Move Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Center Joystick Cap */}
        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 shadow-inner" />
      </div>

      {/* Action Skill Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => castSkill('slash')}
          className="w-12 h-12 rounded-full bg-rose-900/80 hover:bg-rose-600 text-rose-200 border-2 border-rose-500/50 flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all"
          title="Whirlwind Slash"
        >
          <Zap className="w-5 h-5" />
          <span className="text-[9px] font-rpg font-bold">Slash</span>
        </button>

        <button
          onClick={() => castSkill('heal')}
          className="w-12 h-12 rounded-full bg-emerald-900/80 hover:bg-emerald-600 text-emerald-200 border-2 border-emerald-500/50 flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all"
          title="Radiant Heal"
        >
          <Shield className="w-5 h-5" />
          <span className="text-[9px] font-rpg font-bold">Heal</span>
        </button>

        <button
          onClick={() => castSkill('fireball')}
          className="w-12 h-12 rounded-full bg-amber-900/80 hover:bg-amber-600 text-amber-200 border-2 border-amber-500/50 flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all"
          title="Arcane Fireball"
        >
          <Flame className="w-5 h-5" />
          <span className="text-[9px] font-rpg font-bold">Blast</span>
        </button>
      </div>
    </div>
  );
};
