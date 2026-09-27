import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import type { EquipmentSlot, Item } from '../../types/game';
import { X, Shield, Sword, Zap, Heart, Sparkles, Award, UserCheck } from 'lucide-react';

export const CharacterProfileModal: React.FC = () => {
  const { player, activeModal, closeModal, unequipItem, setHeroClass } = useGame();

  if (activeModal !== 'character') return null;

  // Calculate total stats with equipped item modifiers
  let totalAttack = player.stats.strength * 2;
  let totalDefense = player.stats.defense;
  let totalSpeed = player.stats.speed;
  let totalCrit = player.stats.critChance;

  Object.values(player.equipped).forEach((item) => {
    if (item && item.stats) {
      if (item.stats.attack) totalAttack += item.stats.attack;
      if (item.stats.defense) totalDefense += item.stats.defense;
      if (item.stats.speed) totalSpeed += item.stats.speed;
      if (item.stats.critRate) totalCrit += item.stats.critRate;
    }
  });

  const slots: { label: string; slot: EquipmentSlot }[] = [
    { label: 'Weapon', slot: 'weapon' },
    { label: 'Off-Hand / Shield', slot: 'shield' },
    { label: 'Helmet', slot: 'helmet' },
    { label: 'Chest Armor', slot: 'chest' },
    { label: 'Boots', slot: 'boots' },
    { label: 'Accessory', slot: 'accessory' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl rpg-glass rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 text-slate-200"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-950/90 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-xl font-rpg font-bold text-amber-300">{player.name}</h2>
                <p className="text-xs text-slate-400">{player.title} • Level {player.level}</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto">
            {/* Left Column: Avatar & Class Selector */}
            <div className="flex flex-col items-center bg-slate-900/60 p-5 rounded-xl border border-amber-500/20">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-amber-950 via-slate-900 to-amber-900 border-2 border-amber-500 flex items-center justify-center text-5xl shadow-2xl mb-4 relative">
                <span>{player.avatar}</span>
                <span className="absolute -bottom-2 bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-md">
                  Lv.{player.level}
                </span>
              </div>

              <h3 className="font-rpg font-bold text-amber-200 text-lg mb-1">{player.name}</h3>
              <p className="text-xs text-emerald-400 font-semibold mb-4 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Status: {player.status}
              </p>

              {/* Class Switcher */}
              <div className="w-full">
                <label className="block text-[11px] font-rpg text-amber-400 mb-2 text-center">Select Class Spec</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['Warrior', 'Mage', 'Rogue'] as const).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setHeroClass(cls)}
                      className={`py-1.5 text-xs font-rpg font-bold rounded-lg transition-all ${
                        player.heroClass === cls
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column: Paperdoll Equipment Slots */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-amber-500/20 flex flex-col">
              <h3 className="font-rpg font-bold text-amber-300 text-sm mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Equipped Gear Paperdoll
              </h3>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {slots.map(({ label, slot }) => {
                  const equippedItem: Item | null = player.equipped[slot];
                  return (
                    <div
                      key={slot}
                      onClick={() => equippedItem && unequipItem(slot)}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                        equippedItem
                          ? 'bg-slate-950/80 border-amber-500/60 hover:border-red-400 hover:bg-rose-950/30 group'
                          : 'bg-slate-950/30 border-dashed border-slate-800 text-slate-600'
                      }`}
                      title={equippedItem ? `Click to unequip ${equippedItem.name}` : 'Empty Slot'}
                    >
                      <span className="text-[10px] uppercase font-rpg text-amber-400/80 mb-1">{label}</span>
                      {equippedItem ? (
                        <>
                          <span className="text-xl mb-1">⚔️</span>
                          <span className="text-xs font-bold text-amber-200 line-clamp-1 group-hover:text-red-300">
                            {equippedItem.name}
                          </span>
                          <span className="text-[9px] text-slate-400 uppercase mt-0.5">{equippedItem.rarity}</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-600 font-medium">Empty</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detailed Player Attributes */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
              <div>
                <h3 className="font-rpg font-bold text-amber-300 text-sm mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Combat & Attribute Stats
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Sword className="w-3.5 h-3.5 text-amber-400" />
                      Attack Power
                    </span>
                    <span className="font-mono font-bold text-amber-300">{totalAttack}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      Defense Rating
                    </span>
                    <span className="font-mono font-bold text-blue-300">{totalDefense}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      Critical Hit Rate
                    </span>
                    <span className="font-mono font-bold text-purple-300">{totalCrit}%</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Heart className="w-3.5 h-3.5 text-red-400" />
                      Strength
                    </span>
                    <span className="font-mono font-bold text-slate-200">{player.stats.strength}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Intelligence
                    </span>
                    <span className="font-mono font-bold text-slate-200">{player.stats.intelligence}</span>
                  </div>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-[11px] font-rpg text-amber-300 mb-1">
                  <span>Level {player.level} Progress</span>
                  <span>{player.xp} / {player.maxXp} XP</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full border border-amber-500/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300"
                    style={{ width: `${(player.xp / player.maxXp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
