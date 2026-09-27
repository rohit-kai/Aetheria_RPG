export type ItemCategory = 'weapons' | 'armor' | 'potions' | 'rewards' | 'collectibles';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type EquipmentSlot = 'weapon' | 'shield' | 'helmet' | 'chest' | 'boots' | 'accessory';

export interface ItemStats {
  attack?: number;
  defense?: number;
  hpRestore?: number;
  manaRestore?: number;
  speed?: number;
  critRate?: number;
}

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  description: string;
  icon: string; // Lucide icon name or emoji fallback
  quantity: number;
  stackable: boolean;
  value: number; // Gold value
  slot?: EquipmentSlot; // Only if armor/weapon
  stats?: ItemStats;
}

export interface PlayerStats {
  strength: number;
  agility: number;
  intelligence: number;
  defense: number;
  critChance: number; // percentage
  speed: number;
}

export interface PlayerState {
  name: string;
  title: string;
  avatar: string;
  heroClass: 'Warrior' | 'Mage' | 'Rogue';
  level: number;
  hp: number;
  maxHp: number;
  energy: number; // Mana
  maxEnergy: number;
  xp: number;
  maxXp: number;
  gold: number;
  status: 'Healthy' | 'Combat' | 'Rested' | 'Empowered';
  stats: PlayerStats;
  equipped: Record<EquipmentSlot, Item | null>;
}

export interface QuestObjective {
  id: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  giver: string;
  description: string;
  levelRequirement: number;
  status: 'available' | 'active' | 'completed';
  objectives: QuestObjective[];
  rewards: {
    xp: number;
    gold: number;
    item?: Item;
  };
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  avatar: string;
  x: number; // Grid X coordinate
  y: number; // Grid Y coordinate
  dialogue: string[];
  questsAvailable?: string[]; // Quest IDs
  isMerchant?: boolean;
  shopItems?: Item[];
}

export interface WorldEntity {
  id: string;
  type: 'chest' | 'herb' | 'ore' | 'dummy' | 'portal';
  name: string;
  x: number; // Tile X
  y: number; // Tile Y
  interacted: boolean;
  itemReward?: Item;
  xpReward?: number;
  goldReward?: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'loot' | 'xp' | 'level';
  timestamp: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  cost: number;
  cooldown: number; // in seconds
  description: string;
  effect: 'attack' | 'heal' | 'buff';
}
