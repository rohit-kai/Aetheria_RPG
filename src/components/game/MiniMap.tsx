import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Compass, Maximize2, Minimize2 } from 'lucide-react';

export const MiniMap: React.FC = () => {
  const { playerPos, npcs, worldEntities } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);

  const mapSize = isExpanded ? 240 : 130;
  const scale = mapSize / 20;

  return (
    <div
      className={`relative rounded-xl border-2 border-amber-500/50 bg-slate-900/90 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-xl ${
        isExpanded ? 'w-[240px] h-[240px]' : 'w-[130px] h-[130px]'
      }`}
    >
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-slate-950/80 px-2 py-1 flex items-center justify-between text-[10px] text-amber-400 font-rpg border-b border-amber-500/20">
        <span className="flex items-center gap-1">
          <Compass className="w-3 h-3 text-amber-400 animate-spin-slow" />
          Minimap
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:text-white transition-colors p-0.5"
          title="Toggle Minimap Expansion"
        >
          {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </button>
      </div>

      {/* Grid Canvas representation */}
      <div className="w-full h-full pt-5 relative bg-emerald-950/40">
        {/* Radar Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent pointer-events-none animate-pulse" />

        {/* NPCs Indicator */}
        {npcs.map((npc) => (
          <div
            key={npc.id}
            className="absolute w-2.5 h-2.5 bg-amber-400 rounded-full border border-black transform -translate-x-1/2 -translate-y-1/2 shadow-sm"
            style={{
              left: `${npc.x * scale}px`,
              top: `${npc.y * scale + 16}px`,
            }}
            title={npc.name}
          />
        ))}

        {/* World Entities Indicator */}
        {worldEntities
          .filter((e) => !e.interacted)
          .map((entity) => (
            <div
              key={entity.id}
              className={`absolute w-2 h-2 rounded-sm border border-black transform -translate-x-1/2 -translate-y-1/2 ${
                entity.type === 'chest' ? 'bg-yellow-300 animate-ping' : 'bg-blue-400'
              }`}
              style={{
                left: `${entity.x * scale}px`,
                top: `${entity.y * scale + 16}px`,
              }}
              title={entity.name}
            />
          ))}

        {/* Player Indicator */}
        <div
          className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-md shadow-red-500/50"
          style={{
            left: `${playerPos.x * scale}px`,
            top: `${playerPos.y * scale + 16}px`,
          }}
        >
          <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-400/40 animate-ping" />
        </div>
      </div>
    </div>
  );
};
