export type FlowerType = 'rose' | 'tulip' | 'daisy' | 'sunflower' | 'lavender' | 'orchid' | 'peony' | 'carnation' | 'chrysanthemum' | 'hibiscus';

export type PotState = 'empty' | 'seeded' | 'growing' | 'blooming' | 'cooling' | 'harvested';

export type ToolType = 'none' | 'seed' | 'water' | 'harvest';

// ==================== 花盆皮肤 ====================
export type PotSkinId = 'default' | 'ceramic_blue';

export interface PotSkinConfig {
  id: PotSkinId;
  name: string;
  description: string;
  image: string;
  /** 解锁金币费用（0 = 默认免费） */
  unlockCost: number;
}

export interface FlowerConfig {
  id: FlowerType;
  name: string;
  color: string;
  /** 花朵基础售价（金币） */
  basePrice: number;
  states: {
    seed: string;
    sprout: string;
    growing: string;
    bloom: string;
  };
}

export interface PotData {
  id: number;
  row: number;
  col: number;
  state: PotState;
  flowerType?: FlowerType;
  harvestsRemaining?: number;
  cooldownUntil?: number;
}

export interface GameMode {
  tool: ToolType;
  selectedFlower?: FlowerType;
}

export interface Currency {
  coins: number;
  water: number;
}

export type FlowerLevels = Record<FlowerType, number>;

/** 每种花的花卉之魂数量 */
export type FlowerSouls = Record<FlowerType, number>;

export interface FlowerLevelConfig {
  level: number;
  maxHarvests: number;
  yieldPerHarvest: number;
  cooldownSeconds: number;
  upgradeCostCoins: number;
  upgradeCostSouls: number;
  /** 本次升级提升的属性名称（展示用） */
  upgradeLabel?: string;
}

/** 玩家等级状态 */
export interface PlayerLevelState {
  level: number;
  xp: number;
  xpToNext: number;
}

/** 玩家等级配置 */
export interface PlayerLevelConfig {
  level: number;
  xpRequired: number;
  /** 该等级解锁的花朵 */
  unlockedFlowers: FlowerType[];
}

/** 花卉解锁条件 */
export interface FlowerUnlockInfo {
  flowerType: FlowerType;
  requiredPlayerLevel: number;
}

export interface PurchaseTask {
  id: string;
  name: string;
  description: string;
  costFlowers: Partial<Record<FlowerType, number>>;
  rewardCoins: number;
  rewardXp: number;
  /** 完成后冷却时间（毫秒） */
  cooldownMs: number;
}

export interface Inventory {
  flowers: Record<FlowerType, number>;
  total: number;
}

export interface DragState {
  isDragging: boolean;
  tool: ToolType;
  flowerType?: FlowerType;
  x: number;
  y: number;
}

export interface EffectState {
  id: number;
  type: 'seed' | 'water' | 'harvest' | 'levelup' | 'task' | 'xpgain' | 'souldrop' | 'playerlevelup';
  potId?: number;
  flowerType?: FlowerType;
  taskRewardCoins?: number;
  taskRewardWater?: number;
  /** XP 获取量 */
  xpAmount?: number;
  /** 花卉之魂掉落 */
  soulFlowerType?: FlowerType;
  /** 玩家新等级 */
  newPlayerLevel?: number;
}

/** 随机收购订单 */
export interface BuyOrder {
  id: number;
  flowerType: FlowerType;
  flowerName: string;
  amount: number;
  pricePerFlower: number;
  totalPrice: number;
  expiresAt: number; // Date.now() + duration
}
