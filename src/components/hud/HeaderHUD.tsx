import React from 'react';
import { useGame } from '../../context/GameContext';
import { Coins, Heart, Sparkles, Volume2, VolumeX, HelpCircle, RotateCcw } from 'lucide-react';

export const HeaderHUD: React.FC = () => {
  const { player, isMuted, toggleAudio, openModal, resetGameState } = useGame();

  const hpPercent = Math.min(100, Math.max(0, (player.hp / player.maxHp) * 100));
  const energyPercent = Math.min(100, Math.max(0, (player.energy / player.maxEnergy) * 100));
  const xpPercent = Math.min(100, Math.max(0, (player.xp / player.maxXp) * 100));

  return (
    <header className="w-full bg-slate-950/90 border-b border-amber-500/30 backdrop-blur-xl px-4 py-3 shadow-2xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Player Profile Brief */}
        <div className="flex items-center gap-3">
          {/* Avatar Box */}
          <button
            onClick={() => openModal('character')}
            className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-amber-900/60 via-slate-900 to-amber-950 border-2 border-amber-500/60 shadow-lg flex items-center justify-center text-2xl hover:scale-105 transition-transform group cursor-pointer"
            title="Click to view full Character Profile"
          >
            <span>{player.avatar}</span>
            {/* Level Badge */}
            <span className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-rpg font-extrabold px-1.5 py-0.5 rounded-md shadow-md border border-slate-900">
              Lv.{player.level}
            </span>
          </button>

          {/* Name & Status */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-rpg text-amber-300 font-bold text-base leading-tight tracking-wide">
                {player.name}
              </h1>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold">
                {player.status}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">{player.heroClass} • {player.title}</span>
          </div>
        </div>

        {/* Center: HP, Energy & XP Stat Bars */}
        <div className="flex-1 w-full max-w-md flex flex-col gap-1.5">
          {/* HP Bar */}
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
            <div className="flex-1 bg-slate-900 h-4 rounded-full border border-red-500/30 overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-red-700 via-rose-500 to-red-400 transition-all duration-300 rounded-full"
                style={{ width: `${hpPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                HP: {player.hp} / {player.maxHp}
              </span>
            </div>
          </div>

          {/* Energy / Mana Bar */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400 shrink-0" />
            <div className="flex-1 bg-slate-900 h-4 rounded-full border border-cyan-500/30 overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-700 via-sky-500 to-blue-400 transition-all duration-300 rounded-full"
                style={{ width: `${energyPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                Mana: {player.energy} / {player.maxEnergy}
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-rpg font-bold text-amber-400 w-4 text-center">XP</span>
            <div className="flex-1 bg-slate-900 h-2.5 rounded-full border border-amber-500/30 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 transition-all duration-300 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-amber-300/80 font-mono font-bold">
              {player.xp}/{player.maxXp}
            </span>
          </div>
        </div>

        {/* Right: Gold Counter & Control Toggles */}
        <div className="flex items-center gap-4">
          {/* Gold Counter */}
          <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-md">
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span className="font-mono font-bold text-amber-300 text-sm">{player.gold}</span>
            <span className="text-[10px] text-amber-500 font-rpg">GOLD</span>
          </div>

          {/* Settings & Guide Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={toggleAudio}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-amber-400 transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => openModal('controls')}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-amber-400 transition-colors"
              title="Controls & Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={resetGameState}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-rose-400 transition-colors"
              title="Reset Game State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
