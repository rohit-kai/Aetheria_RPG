import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import type { Quest } from '../../types/game';
import { X, ScrollText, CheckCircle2, Gift, Award } from 'lucide-react';

export const QuestLogModal: React.FC = () => {
  const { quests, activeModal, closeModal, completeQuest } = useGame();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(quests[0] || null);

  if (activeModal !== 'quests') return null;

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
              <ScrollText className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-xl font-rpg font-bold text-amber-300">Quest Journal</h2>
                <p className="text-xs text-slate-400">Track active adventures & realm contracts</p>
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
            {/* Left: Quest List */}
            <div className="space-y-2 border-r border-slate-800 pr-4">
              <h3 className="font-rpg font-bold text-amber-400 text-xs mb-3">All Quests</h3>
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => setSelectedQuest(quest)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedQuest?.id === quest.id
                      ? 'bg-amber-950/60 border-amber-500/60 text-amber-200 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-rpg font-bold text-xs">{quest.title}</h4>
                    {quest.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-amber-400">{quest.status}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{quest.description}</p>
                </div>
              ))}
            </div>

            {/* Right: Quest Objective Details */}
            <div className="md:col-span-2 bg-slate-900/60 p-5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
              {selectedQuest ? (
                <div>
                  <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-rpg uppercase text-amber-400 font-bold">
                        Giver: {selectedQuest.giver}
                      </span>
                      <h3 className="font-rpg font-bold text-lg text-amber-200">{selectedQuest.title}</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-rpg font-bold uppercase ${
                        selectedQuest.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {selectedQuest.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic mb-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    "{selectedQuest.description}"
                  </p>

                  {/* Objectives */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-rpg font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      Objectives Tracker
                    </h4>

                    {selectedQuest.objectives.map((obj) => (
                      <div
                        key={obj.id}
                        className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className={obj.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {obj.description}
                        </span>
                        <span className="font-mono font-bold text-amber-400">
                          {obj.current} / {obj.target}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards Preview */}
                  <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/30">
                    <h4 className="font-rpg font-bold text-amber-400 text-xs mb-2 flex items-center gap-1.5">
                      <Gift className="w-4 h-4" />
                      Rewards Upon Completion
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-mono font-bold text-amber-200">
                      <span>+{selectedQuest.rewards.xp} XP</span>
                      <span>+{selectedQuest.rewards.gold} Gold</span>
                      {selectedQuest.rewards.item && <span>Item: [{selectedQuest.rewards.item.name}]</span>}
                    </div>
                  </div>

                  {selectedQuest.status === 'completed' && (
                    <button
                      onClick={() => completeQuest(selectedQuest.id)}
                      className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-rpg font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95"
                    >
                      Claim Quest Rewards
                    </button>
                  )}
                </div>
              ) : (
                <div className="m-auto text-center py-12">
                  <ScrollText className="w-12 h-12 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-rpg">Select a quest from the list to view objectives</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
