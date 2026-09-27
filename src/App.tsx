import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HeaderHUD } from './components/hud/HeaderHUD';
import { ActionBar } from './components/hud/ActionBar';
import { GameCanvas } from './components/game/GameCanvas';
import { MiniMap } from './components/game/MiniMap';
import { VirtualDPad } from './components/game/VirtualDPad';
import { CharacterProfileModal } from './components/modals/CharacterProfileModal';
import { InventoryModal } from './components/modals/InventoryModal';
import { DialogueModal } from './components/modals/DialogueModal';
import { QuestLogModal } from './components/modals/QuestLogModal';
import { ControlsGuideModal } from './components/modals/ControlsGuideModal';
import { NotificationToast } from './components/ui/NotificationToast';
import { Sword, Moon, Sun, Sunset } from 'lucide-react';

const GameDashboard: React.FC = () => {
  const { dayNightCycle } = useGame();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Dynamic Header HUD */}
      <HeaderHUD />

      {/* Notification Toasts Overlay */}
      <NotificationToast />

      {/* Main RPG Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center pb-28 gap-6">
        {/* Environment Title & Atmospheric Status */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-amber-400" />
            <h2 className="font-rpg font-bold text-amber-300 text-sm sm:text-base">
              Chronicles of Aetheria: Whispering Meadows
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-rpg text-amber-400/80 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            {dayNightCycle === 'day' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>Daylight Sun</span>
              </>
            ) : dayNightCycle === 'sunset' ? (
              <>
                <Sunset className="w-4 h-4 text-orange-400" />
                <span>Golden Sunset</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Arcane Night</span>
              </>
            )}
          </div>
        </div>

        {/* 2D Canvas Game World Container */}
        <div className="relative w-full flex flex-col items-center">
          <GameCanvas />

          {/* Top-Right Floating Minimap */}
          <div className="absolute top-4 right-4 z-10 hidden sm:block">
            <MiniMap />
          </div>
        </div>

        {/* Virtual Touch D-Pad & Action Controls */}
        <VirtualDPad />
      </main>

      {/* Fixed Bottom Hotbar / Action Bar */}
      <ActionBar />

      {/* Interactive Modals */}
      <CharacterProfileModal />
      <InventoryModal />
      <DialogueModal />
      <QuestLogModal />
      <ControlsGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameDashboard />
    </GameProvider>
  );
}
