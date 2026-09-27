import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { X, MessageSquare, ShoppingCart, ScrollText, CheckCircle2 } from 'lucide-react';

export const DialogueModal: React.FC = () => {
  const { activeModal, activeNPC, closeModal, quests, acceptQuest, buyMerchantItem, player } = useGame();
  const [activeTab, setActiveTab] = useState<'talk' | 'shop'>('talk');

  if (activeModal !== 'dialogue' || !activeNPC) return null;

  // Find quests associated with this NPC
  const npcQuests = quests.filter((q) => activeNPC.questsAvailable?.includes(q.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl rpg-glass rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 text-slate-200"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-950/90 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-amber-950/80 p-2 rounded-xl border border-amber-500/40">
                {activeNPC.avatar}
              </span>
              <div>
                <h2 className="text-lg font-rpg font-bold text-amber-300">{activeNPC.name}</h2>
                <p className="text-xs text-slate-400">{activeNPC.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeNPC.isMerchant && (
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveTab('talk')}
                    className={`px-3 py-1 rounded-lg text-xs font-rpg font-bold transition-all ${
                      activeTab === 'talk' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dialogue
                  </button>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className={`px-3 py-1 rounded-lg text-xs font-rpg font-bold transition-all flex items-center gap-1 ${
                      activeTab === 'shop' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Shop
                  </button>
                </div>
              )}

              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'talk' ? (
              <div className="space-y-6">
                {/* Dialogue Speech Box */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 relative">
                  <MessageSquare className="w-5 h-5 text-amber-400 mb-2" />
                  <div className="space-y-2 text-sm text-slate-200 leading-relaxed font-sans">
                    {activeNPC.dialogue.map((line, idx) => (
                      <p key={idx}>"{line}"</p>
                    ))}
                  </div>
                </div>

                {/* Available NPC Quests Section */}
                {npcQuests.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-rpg font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      <ScrollText className="w-4 h-4 text-amber-400" />
                      Available Quests from {activeNPC.name}
                    </h3>

                    {npcQuests.map((quest) => (
                      <div
                        key={quest.id}
                        className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/20 flex items-center justify-between gap-4"
                      >
                        <div>
                          <h4 className="font-rpg font-bold text-amber-200 text-sm">{quest.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{quest.description}</p>
                          <span className="text-[10px] text-amber-400 font-bold mt-1 inline-block">
                            Reward: +{quest.rewards.xp} XP • {quest.rewards.gold} Gold
                          </span>
                        </div>

                        {quest.status === 'available' ? (
                          <button
                            onClick={() => acceptQuest(quest.id)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-rpg font-bold text-xs rounded-xl shadow transition-all active:scale-95 shrink-0"
                          >
                            Accept Quest
                          </button>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-rpg font-bold text-xs rounded-lg flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {quest.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Merchant Shop Tab */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-rpg font-bold text-amber-300 text-sm">Merchant Wares</h3>
                  <span className="text-xs text-slate-400">
                    Your Gold: <strong className="text-amber-400 font-mono">{player.gold}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                  {activeNPC.shopItems?.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/20 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                          {item.category === 'potions' ? '🧪' : item.category === 'weapons' ? '⚔️' : '🛡️'}
                        </span>
                        <div>
                          <h4 className="font-rpg font-bold text-amber-200 text-xs">{item.name}</h4>
                          <span className="text-[10px] text-amber-400 font-mono font-bold">{item.value} Gold</span>
                        </div>
                      </div>

                      <button
                        onClick={() => buyMerchantItem(item)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-rpg font-bold text-xs rounded-lg shadow transition-all active:scale-95 shrink-0"
                      >
                        Buy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
