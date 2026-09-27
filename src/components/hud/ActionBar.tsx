import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Backpack, UserCheck, ScrollText, HeartHandshake, Shield, Sparkles } from 'lucide-react';

export const ActionBar: React.FC = () => {
  const { openModal, inventory, consumeItem, quests, activeModal } = useGame();

  const healingPotion = inventory.find((i) => i.id.includes('item_p1') || i.name.includes('Healing'));
  const manaPotion = inventory.find((i) => i.id.includes('item_p2') || i.name.includes('Mana'));
  const activeQuestsCount = quests.filter((q) => q.status === 'active').length;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModal !== 'none' && e.key !== 'Escape') return;

      const key = e.key.toLowerCase();
      if (key === 'i') {
        openModal('inventory');
      } else if (key === 'c') {
        openModal('character');
      } else if (key === 'q') {
        openModal('quests');
      } else if (key === '1' && healingPotion) {
        consumeItem(healingPotion);
      } else if (key === '2' && manaPotion) {
        consumeItem(manaPotion);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, healingPotion, manaPotion, openModal, consumeItem]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-slate-950/90 border-2 border-amber-500/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-2xl">
      {/* Quick Potions / Skills */}
      <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
        <button
          onClick={() => healingPotion && consumeItem(healingPotion)}
          disabled={!healingPotion}
          className={`relative w-11 h-11 rounded-xl border flex flex-col items-center justify-center transition-all ${
            healingPotion
              ? 'bg-rose-950/80 border-rose-500/50 hover:bg-rose-900 active:scale-95 text-rose-300'
              : 'bg-slate-900 border-slate-800 opacity-40 cursor-not-allowed text-slate-500'
          }`}
          title="Use Health Potion (Hotkey: 1)"
        >
          <Shield className="w-4 h-4 text-rose-400" />
          <span className="text-[9px] font-bold">HP</span>
          <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-bold px-1 rounded-full">
            {healingPotion ? healingPotion.quantity : 0}
          </span>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 text-[8px] px-1 rounded border border-amber-500/30">
            [1]
          </span>
        </button>

        <button
          onClick={() => manaPotion && consumeItem(manaPotion)}
          disabled={!manaPotion}
          className={`relative w-11 h-11 rounded-xl border flex flex-col items-center justify-center transition-all ${
            manaPotion
              ? 'bg-cyan-950/80 border-cyan-500/50 hover:bg-cyan-900 active:scale-95 text-cyan-300'
              : 'bg-slate-900 border-slate-800 opacity-40 cursor-not-allowed text-slate-500'
          }`}
          title="Use Mana Potion (Hotkey: 2)"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-[9px] font-bold">Mana</span>
          <span className="absolute -top-1.5 -right-1.5 bg-cyan-600 text-white text-[9px] font-bold px-1 rounded-full">
            {manaPotion ? manaPotion.quantity : 0}
          </span>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 text-[8px] px-1 rounded border border-amber-500/30">
            [2]
          </span>
        </button>
      </div>

      {/* Main Navigation Modal Buttons */}
      <div className="flex items-center gap-2">
        {/* Inventory Modal Trigger */}
        <button
          onClick={() => openModal('inventory')}
          className="relative px-3 py-2 bg-slate-900 hover:bg-amber-950/60 border border-amber-500/30 hover:border-amber-400 rounded-xl text-amber-300 font-rpg text-xs flex items-center gap-2 shadow transition-all active:scale-95"
        >
          <Backpack className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Inventory</span>
          <span className="text-[9px] text-amber-500 font-mono bg-slate-950 px-1 rounded border border-amber-500/20">
            [I]
          </span>
          <span className="ml-1 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 rounded-full">
            {inventory.length}
          </span>
        </button>

        {/* Character Profile Modal Trigger */}
        <button
          onClick={() => openModal('character')}
          className="relative px-3 py-2 bg-slate-900 hover:bg-amber-950/60 border border-amber-500/30 hover:border-amber-400 rounded-xl text-amber-300 font-rpg text-xs flex items-center gap-2 shadow transition-all active:scale-95"
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Character</span>
          <span className="text-[9px] text-amber-500 font-mono bg-slate-950 px-1 rounded border border-amber-500/20">
            [C]
          </span>
        </button>

        {/* Quest Log Modal Trigger */}
        <button
          onClick={() => openModal('quests')}
          className="relative px-3 py-2 bg-slate-900 hover:bg-amber-950/60 border border-amber-500/30 hover:border-amber-400 rounded-xl text-amber-300 font-rpg text-xs flex items-center gap-2 shadow transition-all active:scale-95"
        >
          <ScrollText className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Quests</span>
          <span className="text-[9px] text-amber-500 font-mono bg-slate-950 px-1 rounded border border-amber-500/20">
            [Q]
          </span>
          {activeQuestsCount > 0 && (
            <span className="ml-1 bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 rounded-full">
              {activeQuestsCount}
            </span>
          )}
        </button>

        {/* Controls Guide Trigger */}
        <button
          onClick={() => openModal('controls')}
          className="px-3 py-2 bg-slate-900 hover:bg-amber-950/60 border border-amber-500/30 hover:border-amber-400 rounded-xl text-amber-300 font-rpg text-xs flex items-center gap-2 shadow transition-all active:scale-95"
        >
          <HeartHandshake className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Guide</span>
        </button>
      </div>
    </div>
  );
};
