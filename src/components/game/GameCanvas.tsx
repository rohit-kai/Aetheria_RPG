import React, { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';

const TILE_SIZE = 40;
const MAP_COLS = 20;
const MAP_ROWS = 20;

// 20x20 Tilemap layout (0: Grass, 1: Stone Path, 2: Water, 3: Tree, 4: Stone Ruins)
const TILE_MAP: number[][] = [
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3],
  [3, 0, 4, 0, 0, 0, 3, 0, 0, 1, 1, 1, 0, 0, 3, 0, 4, 4, 0, 3],
  [3, 0, 4, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 4, 4, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 3],
  [3, 3, 3, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 3],
  [3, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3],
  [3, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3],
  [3, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3],
  [3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 3],
  [3, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3],
  [3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3],
  [3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3],
  [3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 3],
  [3, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
];

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { playerPos, movePlayer, setPlayerPosition, player, npcs, worldEntities, activeModal, dayNightCycle } = useGame();

  // Throttled keyboard controls
  const lastKeyTime = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModal !== 'none') return; // Don't move if modal is open

      const now = Date.now();
      if (now - lastKeyTime.current < 120) return; // Smooth movement speed delay

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          movePlayer(0, -1);
          lastKeyTime.current = now;
          break;
        case 's':
        case 'arrowdown':
          movePlayer(0, 1);
          lastKeyTime.current = now;
          break;
        case 'a':
        case 'arrowleft':
          movePlayer(-1, 0);
          lastKeyTime.current = now;
          break;
        case 'd':
        case 'arrowright':
          movePlayer(1, 0);
          lastKeyTime.current = now;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, movePlayer]);

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let tick = 0;

    // Ambient floating particles
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * MAP_COLS * TILE_SIZE,
      y: Math.random() * MAP_ROWS * TILE_SIZE,
      radius: Math.random() * 2 + 1,
      speedY: -0.3 - Math.random() * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Tile Map
      for (let r = 0; r < MAP_ROWS; r++) {
        for (let c = 0; c < MAP_COLS; c++) {
          const tileType = TILE_MAP[r][c];
          const x = c * TILE_SIZE;
          const y = r * TILE_SIZE;

          if (tileType === 0) {
            // Grass
            ctx.fillStyle = '#1e3820';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            // Grass blade texture accent
            if ((r + c) % 3 === 0) {
              ctx.fillStyle = '#264729';
              ctx.fillRect(x + 10, y + 12, 3, 6);
              ctx.fillRect(x + 22, y + 25, 4, 7);
            }
          } else if (tileType === 1) {
            // Cobblestone Path
            ctx.fillStyle = '#3c404d';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#2b2e38';
            ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          } else if (tileType === 2) {
            // Water with animated ripple wave
            const waveOffset = Math.sin(tick * 0.05 + r) * 2;
            ctx.fillStyle = '#143654';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#1d4e78';
            ctx.fillRect(x + 4 + waveOffset, y + 16, TILE_SIZE - 8, 4);
          } else if (tileType === 3) {
            // Forest / Tree Boundary
            ctx.fillStyle = '#132415';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            // Tree Canopy
            ctx.fillStyle = '#0a4014';
            ctx.beginPath();
            ctx.arc(x + 20, y + 18, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#062b0d';
            ctx.beginPath();
            ctx.arc(x + 20, y + 22, 10, 0, Math.PI * 2);
            ctx.fill();
          } else if (tileType === 4) {
            // Ancient Stone Ruins Pillar
            ctx.fillStyle = '#282d3b';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#4a5266';
            ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 10, y + 10, TILE_SIZE - 20, TILE_SIZE - 20);
          }
        }
      }

      // 2. Render World Entities (Chests, Herbs, Ores, Dummies)
      worldEntities.forEach((entity) => {
        const ex = entity.x * TILE_SIZE;
        const ey = entity.y * TILE_SIZE;

        if (entity.type === 'chest') {
          ctx.fillStyle = entity.interacted ? '#4a3f2b' : '#b48a3c';
          ctx.fillRect(ex + 8, ey + 12, 24, 18);
          // Lock / Glow
          if (!entity.interacted) {
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(ex + 18, ey + 18, 4, 6);
            // Sparkle pulse
            const sparkle = Math.sin(tick * 0.1) * 3;
            ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(ex + 20, ey + 20, 15 + sparkle, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (entity.type === 'herb') {
          ctx.fillStyle = entity.interacted ? '#263b27' : '#eab308';
          ctx.font = '18px serif';
          ctx.fillText(entity.interacted ? '🌱' : '🌼', ex + 10, ey + 26);
        } else if (entity.type === 'ore') {
          ctx.fillStyle = entity.interacted ? '#374151' : '#60a5fa';
          ctx.font = '18px serif';
          ctx.fillText(entity.interacted ? '🪨' : '💎', ex + 10, ey + 26);
        } else if (entity.type === 'dummy') {
          ctx.font = '22px serif';
          ctx.fillText('🎯', ex + 8, ey + 28);
        }
      });

      // 3. Render NPCs
      npcs.forEach((npc) => {
        const nx = npc.x * TILE_SIZE;
        const ny = npc.y * TILE_SIZE;

        // Animated quest indicator bounce
        const bounce = Math.sin(tick * 0.08) * 4;

        // NPC Aura / Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(nx + 20, ny + 34, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // NPC Emoji Avatar
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText(npc.avatar, nx + 20, ny + 26);

        // Quest exclamation badge
        if (npc.questsAvailable && npc.questsAvailable.length > 0) {
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(nx + 20, ny + 2 - bounce, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('!', nx + 20, ny + 6 - bounce);
        }

        // NPC Name Tag
        ctx.fillStyle = 'rgba(10, 15, 25, 0.75)';
        ctx.fillRect(nx - 10, ny + 32, 60, 14);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '10px sans-serif';
        ctx.fillText(npc.name.split(' ')[0], nx + 20, ny + 42);
      });

      // 4. Render Player Sprite
      const px = playerPos.x * TILE_SIZE;
      const py = playerPos.y * TILE_SIZE;

      // Player Shadow Ring
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(px + 20, py + 35, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing selection ring
      const glowRadius = 18 + Math.sin(tick * 0.1) * 2;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px + 20, py + 20, glowRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Player Emoji Sprite
      ctx.font = '26px serif';
      ctx.textAlign = 'center';
      ctx.fillText(player.avatar, px + 20, py + 27);

      // Player Name Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(player.name, px + 20, py - 4);
      ctx.shadowBlur = 0;

      // 5. Ambient Weather & Day/Night Lighting Overlay
      if (dayNightCycle === 'sunset') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (dayNightCycle === 'night') {
        ctx.fillStyle = 'rgba(10, 15, 30, 0.45)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Player Light Torch Radius
        const lightGrad = ctx.createRadialGradient(px + 20, py + 20, 10, px + 20, py + 20, 120);
        lightGrad.addColorStop(0, 'rgba(255, 200, 100, 0.3)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = lightGrad;
        ctx.beginPath();
        ctx.arc(px + 20, py + 20, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw Ambient Mana Particles
      ctx.fillStyle = '#93c5fd';
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) p.y = canvas.height;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, [playerPos, player, npcs, worldEntities, dayNightCycle]);

  // Click to Move Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeModal !== 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetTileX = Math.floor(clickX / TILE_SIZE);
    const targetTileY = Math.floor(clickY / TILE_SIZE);

    setPlayerPosition(targetTileX, targetTileY);
  };

  return (
    <div className="relative flex justify-center items-center rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-slate-950">
      <canvas
        ref={canvasRef}
        width={MAP_COLS * TILE_SIZE}
        height={MAP_ROWS * TILE_SIZE}
        onClick={handleCanvasClick}
        className="cursor-pointer max-w-full h-auto touch-none"
      />
      {/* Location Badge */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-rpg text-amber-300 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Whispering Meadows (X: {playerPos.x}, Y: {playerPos.y})</span>
      </div>
    </div>
  );
};
