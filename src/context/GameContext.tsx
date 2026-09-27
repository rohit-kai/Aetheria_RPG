import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_ITEMS, INITIAL_NPCS, INITIAL_PLAYER, INITIAL_QUESTS, INITIAL_WORLD_ENTITIES } from '../data/mockData';
import { audio } from '../services/AudioService';
import type { EquipmentSlot, Item, NPC, PlayerState, Quest, ToastMessage, WorldEntity } from '../types/game';

interface GameContextType {
  player: PlayerState;
  inventory: Item[];
  quests: Quest[];
  npcs: NPC[];
  worldEntities: WorldEntity[];
  playerPos: { x: number; y: number };
  activeModal: 'none' | 'character' | 'inventory' | 'quests' | 'controls' | 'dialogue';
  activeNPC: NPC | null;
  toasts: ToastMessage[];
  isMuted: boolean;
  dayNightCycle: 'day' | 'sunset' | 'night';
  // Dispatch Actions
  movePlayer: (dx: number, dy: number) => void;
  setPlayerPosition: (x: number, y: number) => void;
  openModal: (modal: 'none' | 'character' | 'inventory' | 'quests' | 'controls' | 'dialogue') => void;
  closeModal: () => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  consumeItem: (item: Item) => void;
  dropItem: (itemId: string) => void;
  sortInventory: () => void;
  interactNPC: (npc: NPC) => void;
  interactEntity: (entityId: string) => void;
  buyMerchantItem: (item: Item) => void;
  acceptQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  castSkill: (skillId: string) => void;
  toggleAudio: () => void;
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  setHeroClass: (heroClass: 'Warrior' | 'Mage' | 'Rogue') => void;
  resetGameState: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const STORAGE_KEY = 'aetheria_rpg_save_v1';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or persisted state
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_player');
    return saved ? JSON.parse(saved) : INITIAL_PLAYER;
  });

  const [inventory, setInventory] = useState<Item[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_inventory');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [worldEntities, setWorldEntities] = useState<WorldEntity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_entities');
    return saved ? JSON.parse(saved) : INITIAL_WORLD_ENTITIES;
  });

  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 7, y: 7 });
  const [activeModal, setActiveModal] = useState<'none' | 'character' | 'inventory' | 'quests' | 'controls' | 'dialogue'>('none');
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [dayNightCycle, setDayNightCycle] = useState<'day' | 'sunset' | 'night'>('day');

  // Persistence Sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_entities', JSON.stringify(worldEntities));
  }, [worldEntities]);

  // Day/Night Cycle timer
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setDayNightCycle((prev) => (prev === 'day' ? 'sunset' : prev === 'sunset' ? 'night' : 'day'));
    }, 45000); // changes every 45s
    return () => clearInterval(cycleInterval);
  }, []);

  // Toast Helper
  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title,
      message,
      type,
      timestamp: Date.now(),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Movement & Collision Logic
  const movePlayer = (dx: number, dy: number) => {
    setPlayerPos((prev) => {
      const nextX = Math.max(1, Math.min(18, prev.x + dx));
      const nextY = Math.max(1, Math.min(18, prev.y + dy));

      // Play footstep sound
      audio.playFootstep();

      // Check NPC proximity
      const metNPC = INITIAL_NPCS.find((npc) => npc.x === nextX && npc.y === nextY);
      if (metNPC) {
        interactNPC(metNPC);
      }

      // Check Entity collision / proximity
      const entity = worldEntities.find((e) => e.x === nextX && e.y === nextY && !e.interacted);
      if (entity) {
        interactEntity(entity.id);
      }

      return { x: nextX, y: nextY };
    });
  };

  const setPlayerPosition = (x: number, y: number) => {
    setPlayerPos({ x: Math.max(1, Math.min(18, x)), y: Math.max(1, Math.min(18, y)) });
  };

  // XP & Level Up Logic
  const addXP = (amount: number) => {
    setPlayer((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      let newHp = prev.hp;
      let newMaxHp = prev.maxHp;
      let newEnergy = prev.energy;
      let newMaxEnergy = prev.maxEnergy;
      let newStats = { ...prev.stats };

      if (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = Math.floor(newMaxXp * 1.5);
        newMaxHp += 25;
        newHp = newMaxHp;
        newMaxEnergy += 15;
        newEnergy = newMaxEnergy;
        newStats.strength += 3;
        newStats.agility += 2;
        newStats.intelligence += 2;
        newStats.defense += 2;

        audio.playLevelUp();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        addToast('LEVEL UP!', `You have reached Level ${newLevel}! All attributes increased.`, 'level');
      } else {
        addToast('+ ' + amount + ' XP', 'Gained experience points', 'xp');
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        maxXp: newMaxXp,
        hp: newHp,
        maxHp: newMaxHp,
        energy: newEnergy,
        maxEnergy: newMaxEnergy,
        stats: newStats,
      };
    });
  };

  // Inventory & Equipment Logic
  const equipItem = (itemToEquip: Item) => {
    if (!itemToEquip.slot) return;

    setPlayer((prev) => {
      const currentEquipped = prev.equipped[itemToEquip.slot as EquipmentSlot];
      const updatedEquipped = { ...prev.equipped, [itemToEquip.slot as EquipmentSlot]: itemToEquip };

      // Update Inventory
      setInventory((inv) => {
        let nextInv = inv.filter((i) => i.id !== itemToEquip.id);
        if (currentEquipped) {
          nextInv = [currentEquipped, ...nextInv];
        }
        return nextInv;
      });

      audio.playItemEquip();
      addToast('Equipped', `Equipped ${itemToEquip.name}`, 'success');

      return {
        ...prev,
        equipped: updatedEquipped,
      };
    });
  };

  const unequipItem = (slot: EquipmentSlot) => {
    setPlayer((prev) => {
      const itemToUnequip = prev.equipped[slot];
      if (!itemToUnequip) return prev;

      setInventory((inv) => [itemToUnequip, ...inv]);

      audio.playItemEquip();
      addToast('Unequipped', `Returned ${itemToUnequip.name} to inventory`, 'info');

      return {
        ...prev,
        equipped: { ...prev.equipped, [slot]: null },
      };
    });
  };

  const consumeItem = (itemToUse: Item) => {
    if (itemToUse.category === 'potions' && itemToUse.stats) {
      setPlayer((prev) => {
        const restoredHp = itemToUse.stats?.hpRestore || 0;
        const restoredMana = itemToUse.stats?.manaRestore || 0;

        const newHp = Math.min(prev.maxHp, prev.hp + restoredHp);
        const newMana = Math.min(prev.maxEnergy, prev.energy + restoredMana);

        audio.playPotionDrink();
        addToast('Consumed ' + itemToUse.name, `Restored ${restoredHp ? restoredHp + ' HP ' : ''}${restoredMana ? restoredMana + ' Mana' : ''}`, 'success');

        return {
          ...prev,
          hp: newHp,
          energy: newMana,
        };
      });

      // Decrease inventory quantity or remove
      setInventory((inv) => {
        return inv
          .map((i) => {
            if (i.id === itemToUse.id) {
              if (i.quantity > 1) {
                return { ...i, quantity: i.quantity - 1 };
              }
              return null;
            }
            return i;
          })
          .filter(Boolean) as Item[];
      });
    } else if (itemToUse.slot) {
      equipItem(itemToUse);
    }
  };

  const dropItem = (itemId: string) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    setInventory((prev) => prev.filter((i) => i.id !== itemId));
    audio.playClick();
    addToast('Item Dropped', `Discarded ${item.name}`, 'warning');
  };

  const sortInventory = () => {
    setInventory((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity] || a.category.localeCompare(b.category);
      });
      return sorted;
    });
    audio.playClick();
    addToast('Inventory Sorted', 'Organized by rarity and category', 'info');
  };

  // World Interactions (Chests, Herbs, Ores, Dummies)
  const interactEntity = (entityId: string) => {
    setWorldEntities((entities) =>
      entities.map((e) => {
        if (e.id === entityId && !e.interacted) {
          audio.playLootChime();

          if (e.itemReward) {
            setInventory((inv) => [e.itemReward!, ...inv]);
            addToast('Loot Found!', `Acquired [${e.itemReward.name}]`, 'loot');
          }

          if (e.goldReward) {
            setPlayer((p) => ({ ...p, gold: p.gold + e.goldReward! }));
          }

          if (e.xpReward) {
            addXP(e.xpReward);
          }

          // Check quest objective progress
          if (e.type === 'chest') {
            updateQuestObjective('quest_1', 'q1_obj1', 1);
          } else if (e.type === 'herb') {
            updateQuestObjective('quest_1', 'q1_obj2', 1);
          } else if (e.type === 'dummy') {
            updateQuestObjective('quest_2', 'q2_obj1', 1);
          }

          return { ...e, interacted: true };
        }
        return e;
      })
    );
  };

  // Quest Logic
  const updateQuestObjective = (questId: string, objectiveId: string, amount: number) => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (q.id === questId && q.status === 'active') {
          const updatedObjectives = q.objectives.map((obj) => {
            if (obj.id === objectiveId) {
              const newCurrent = Math.min(obj.target, obj.current + amount);
              return { ...obj, current: newCurrent, completed: newCurrent >= obj.target };
            }
            return obj;
          });

          const allCompleted = updatedObjectives.every((obj) => obj.completed);
          if (allCompleted) {
            audio.playQuestComplete();
            confetti({ particleCount: 80, spread: 60 });
            addToast('QUEST COMPLETE!', `Finished "${q.title}"`, 'success');
          } else {
            addToast('Quest Update', `Updated objective for "${q.title}"`, 'info');
          }

          return {
            ...q,
            objectives: updatedObjectives,
            status: allCompleted ? 'completed' : q.status,
          };
        }
        return q;
      })
    );
  };

  const acceptQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'active' } : q))
    );
    audio.playQuestComplete();
    addToast('Quest Accepted', 'Check your quest log for objectives', 'info');
  };

  const completeQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    if (quest.rewards.gold) {
      setPlayer((p) => ({ ...p, gold: p.gold + quest.rewards.gold }));
    }
    if (quest.rewards.xp) {
      addXP(quest.rewards.xp);
    }
    if (quest.rewards.item) {
      setInventory((inv) => [quest.rewards.item!, ...inv]);
    }

    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, status: 'completed' } : q)));
    audio.playQuestComplete();
    addToast('Rewards Claimed!', `Received ${quest.rewards.gold} Gold & Rewards`, 'loot');
  };

  // NPC Interaction
  const interactNPC = (npc: NPC) => {
    setActiveNPC(npc);
    setActiveModal('dialogue');
    audio.playClick();
  };

  // Merchant Buy
  const buyMerchantItem = (itemToBuy: Item) => {
    if (player.gold < itemToBuy.value) {
      audio.playClick();
      addToast('Insufficient Gold', `You need ${itemToBuy.value} gold to purchase ${itemToBuy.name}`, 'warning');
      return;
    }

    setPlayer((prev) => ({ ...prev, gold: prev.gold - itemToBuy.value }));
    setInventory((prev) => [{ ...itemToBuy, id: 'item_bought_' + Date.now() }, ...prev]);
    audio.playLootChime();
    addToast('Purchased!', `Bought ${itemToBuy.name} for ${itemToBuy.value} gold`, 'success');
  };

  // Skills
  const castSkill = (skillId: string) => {
    if (player.energy < 20) {
      addToast('Out of Mana', 'Need at least 20 Energy to cast skill!', 'warning');
      return;
    }

    setPlayer((prev) => ({ ...prev, energy: prev.energy - 20 }));

    if (skillId === 'heal') {
      const healAmount = 40;
      setPlayer((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmount) }));
      audio.playPotionDrink();
      addToast('Radiant Heal', `Restored ${healAmount} Health Points`, 'success');
    } else if (skillId === 'slash') {
      audio.playAttackSlash();
      addToast('Whirlwind Slash', 'Dealt 85 Physical Damage to nearby enemies!', 'info');
    } else if (skillId === 'fireball') {
      audio.playAttackSlash();
      addToast('Arcane Blast', 'Unleashed a searing fireball!', 'info');
    }
  };

  // Audio Toggle
  const toggleAudio = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    addToast(muted ? 'Sound Muted' : 'Sound Enabled', '', 'info');
  };

  const openModal = (modal: typeof activeModal) => {
    audio.playClick();
    setActiveModal(modal);
  };

  const closeModal = () => {
    audio.playClick();
    setActiveModal('none');
  };

  const setHeroClass = (heroClass: 'Warrior' | 'Mage' | 'Rogue') => {
    setPlayer((prev) => ({
      ...prev,
      heroClass,
      avatar: heroClass === 'Warrior' ? '⚔️' : heroClass === 'Mage' ? '🔮' : '🗡️',
    }));
    audio.playClick();
    addToast('Class Changed', `Now playing as ${heroClass}`, 'info');
  };

  const resetGameState = () => {
    localStorage.removeItem(STORAGE_KEY + '_player');
    localStorage.removeItem(STORAGE_KEY + '_inventory');
    localStorage.removeItem(STORAGE_KEY + '_quests');
    localStorage.removeItem(STORAGE_KEY + '_entities');
    setPlayer(INITIAL_PLAYER);
    setInventory(INITIAL_ITEMS);
    setQuests(INITIAL_QUESTS);
    setWorldEntities(INITIAL_WORLD_ENTITIES);
    setPlayerPos({ x: 7, y: 7 });
    addToast('Game Reset', 'Restored default character and inventory state', 'warning');
  };

  return (
    <GameContext.Provider
      value={{
        player,
        inventory,
        quests,
        npcs: INITIAL_NPCS,
        worldEntities,
        playerPos,
        activeModal,
        activeNPC,
        toasts,
        isMuted,
        dayNightCycle,
        movePlayer,
        setPlayerPosition,
        openModal,
        closeModal,
        equipItem,
        unequipItem,
        consumeItem,
        dropItem,
        sortInventory,
        interactNPC,
        interactEntity,
        buyMerchantItem,
        acceptQuest,
        completeQuest,
        castSkill,
        toggleAudio,
        addToast,
        removeToast,
        setHeroClass,
        resetGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
