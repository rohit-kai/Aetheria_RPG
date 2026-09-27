import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import type { Item, ItemCategory } from '../../types/game';
import { X, Backpack, ArrowUpDown, Shield, Sword, Heart, Sparkles, Trophy, Gem, Trash2 } from 'lucide-react';

export const InventoryModal: React.FC = () => {
  const { inventory, activeModal, closeModal, equipItem, consumeItem, dropItem, sortInventory, player } = useGame();
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (activeModal !== 'inventory') return null;

  const filteredItems = inventory.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // Fill up to 24 slots visually
  const totalSlots = 24;
  const gridSlots = Array.from({ length: totalSlots }, (_, idx) => filteredItems[idx] || null);

  const categories: { id: ItemCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <Backpack className="w-3.5 h-3.5" /> },
    { id: 'weapons', label: 'Weapons', icon: <Sword className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'armor', label: 'Armor', icon: <Shield className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'potions', label: 'Potions', icon: <Heart className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'rewards', label: 'Rewards', icon: <Trophy className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'collectibles', label: 'Collectibles', icon: <Gem className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'uncommon':
        return 'slot-uncommon bg-emerald-950/30';
      case 'rare':
        return 'slot-rare bg-blue-950/30';
      case 'epic':
        return 'slot-epic bg-purple-950/30';
      case 'legendary':
        return 'slot-legendary bg-amber-950/40';
      default:
        return 'slot-common bg-slate-900/60';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl rpg-glass rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 text-slate-200"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-slate-950/90 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Backpack className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-xl font-rpg font-bold text-amber-300">Player Inventory</h2>
                <p className="text-xs text-slate-400">
                  Capacity: {inventory.length} / {totalSlots} Items • Gold: <span className="text-amber-400 font-bold">{player.gold}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={sortInventory}
                className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-500/40 text-xs font-rpg font-bold flex items-center gap-1.5 transition-all"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort Rarity
              </button>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto">
            {/* Left & Middle: Inventory Tabs & Grid */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSelectedItem(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-rpg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* 24-Slot Inventory Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 bg-slate-950/60 p-4 rounded-xl border border-amber-500/20">
                {gridSlots.map((item, idx) => (
                  <div
                    key={item ? item.id : `empty_${idx}`}
                    onClick={() => item && setSelectedItem(item)}
                    className={`aspect-square rounded-xl border-2 p-2 flex flex-col items-center justify-between relative cursor-pointer transition-all hover:scale-105 ${
                      item
                        ? getRarityClass(item.rarity)
                        : 'border-dashed border-slate-800 bg-slate-900/20 hover:border-slate-700'
                    } ${selectedItem?.id === item?.id ? 'ring-2 ring-amber-400 shadow-xl' : ''}`}
                  >
                    {item ? (
                      <>
                        <span className="text-2xl mt-1">
                          {item.category === 'weapons'
                            ? '⚔️'
                            : item.category === 'armor'
                            ? '🛡️'
                            : item.category === 'potions'
                            ? '🧪'
                            : item.category === 'rewards'
                            ? '🏆'
                            : '💎'}
                        </span>

                        <span className="text-[10px] font-rpg font-bold text-amber-200 line-clamp-1 w-full text-center">
                          {item.name}
                        </span>

                        {item.quantity > 1 && (
                          <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 font-mono font-bold text-[9px] px-1.5 rounded-full shadow">
                            x{item.quantity}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-700 font-mono m-auto">{idx + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Selected Item Inspection Tooltip Pane */}
            <div className="bg-slate-900/80 p-5 rounded-xl border border-amber-500/30 flex flex-col justify-between">
              {selectedItem ? (
                <div>
                  <div className="flex items-start justify-between mb-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-rpg font-extrabold tracking-wider text-amber-400">
                        {selectedItem.rarity} {selectedItem.category}
                      </span>
                      <h3 className="font-rpg font-bold text-lg text-amber-200 leading-tight">
                        {selectedItem.name}
                      </h3>
                    </div>
                    <span className="text-3xl bg-slate-950 p-2 rounded-xl border border-amber-500/30">
                      {selectedItem.category === 'weapons' ? '⚔️' : selectedItem.category === 'armor' ? '🛡️' : '🧪'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic mb-4 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    "{selectedItem.description}"
                  </p>

                  {/* Item Stats */}
                  <div className="space-y-2 mb-4">
                    {selectedItem.stats?.attack && (
                      <div className="flex justify-between text-xs p-2 bg-slate-950 rounded border border-rose-900/40 text-rose-300 font-medium">
                        <span>Attack Bonus</span>
                        <span className="font-mono font-bold">+{selectedItem.stats.attack}</span>
                      </div>
                    )}
                    {selectedItem.stats?.defense && (
                      <div className="flex justify-between text-xs p-2 bg-slate-950 rounded border border-blue-900/40 text-blue-300 font-medium">
                        <span>Defense Rating</span>
                        <span className="font-mono font-bold">+{selectedItem.stats.defense}</span>
                      </div>
                    )}
                    {selectedItem.stats?.hpRestore && (
                      <div className="flex justify-between text-xs p-2 bg-slate-950 rounded border border-emerald-900/40 text-emerald-300 font-medium">
                        <span>Restores HP</span>
                        <span className="font-mono font-bold">+{selectedItem.stats.hpRestore}</span>
                      </div>
                    )}
                    {selectedItem.stats?.manaRestore && (
                      <div className="flex justify-between text-xs p-2 bg-slate-950 rounded border border-cyan-900/40 text-cyan-300 font-medium">
                        <span>Restores Mana</span>
                        <span className="font-mono font-bold">+{selectedItem.stats.manaRestore}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs p-2 bg-slate-950 rounded border border-slate-800 text-amber-400 font-medium">
                      <span>Merchant Value</span>
                      <span className="font-mono font-bold">{selectedItem.value} Gold</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-4">
                    {selectedItem.category === 'potions' ? (
                      <button
                        onClick={() => {
                          consumeItem(selectedItem);
                          setSelectedItem(null);
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-rpg font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Consume Potion
                      </button>
                    ) : selectedItem.slot ? (
                      <button
                        onClick={() => {
                          equipItem(selectedItem);
                          setSelectedItem(null);
                        }}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-rpg font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Equip Item
                      </button>
                    ) : null}

                    <button
                      onClick={() => {
                        dropItem(selectedItem.id);
                        setSelectedItem(null);
                      }}
                      className="w-full py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-rpg font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Discard Item
                    </button>
                  </div>
                </div>
              ) : (
                <div className="m-auto text-center py-12">
                  <Backpack className="w-12 h-12 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-rpg">Select an item slot to view details, stats & actions</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
