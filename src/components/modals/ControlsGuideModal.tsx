import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { X, Keyboard, MousePointer, Touchpad, HelpCircle } from 'lucide-react';

export const ControlsGuideModal: React.FC = () => {
  const { activeModal, closeModal } = useGame();

  if (activeModal !== 'controls') return null;

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
              <HelpCircle className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-xl font-rpg font-bold text-amber-300">Controls & Navigation Guide</h2>
                <p className="text-xs text-slate-400">Master movement, hotkeys, and world interactions</p>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Keyboard Shortcuts */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-amber-500/20 space-y-3">
              <h3 className="font-rpg font-bold text-amber-300 text-xs flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-amber-400" />
                Keyboard Controls
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-300">Player Movement</span>
                  <span className="font-mono font-bold text-amber-400">W, A, S, D / Arrows</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-300">Open Inventory</span>
                  <span className="font-mono font-bold text-amber-400">[I] Key</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-300">Character Profile</span>
                  <span className="font-mono font-bold text-amber-400">[C] Key</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-300">Quest Journal</span>
                  <span className="font-mono font-bold text-amber-400">[Q] Key</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-300">Use Health Potion</span>
                  <span className="font-mono font-bold text-amber-400">[1] Hotkey</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-300">Use Mana Potion</span>
                  <span className="font-mono font-bold text-amber-400">[2] Hotkey</span>
                </div>
              </div>
            </div>

            {/* Mouse & Touch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-amber-500/20 space-y-2">
                <h3 className="font-rpg font-bold text-amber-300 text-xs flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-amber-400" />
                  Mouse Pathing
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click on any tile on the 2D Game Canvas map to pathfind your character directly to that position.
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-amber-500/20 space-y-2">
                <h3 className="font-rpg font-bold text-amber-300 text-xs flex items-center gap-2">
                  <Touchpad className="w-4 h-4 text-amber-400" />
                  Mobile Virtual D-Pad
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Use the bottom-left directional D-Pad overlay and bottom-right Action Spell buttons for mobile touch devices.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
