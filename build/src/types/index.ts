export type FlowerType = 'rose' | 'tulip' | 'daisy' | 'sunflower' | 'lavender' | 'orchid' | 'peony' | 'carnation' | 'chrysanthemum' | 'hibiscus';

export type PotState = 'empty' | 'seeded' | 'growing' | 'blooming' | 'cooling' | 'harvested';

export type ToolType = 'none' | 'seed' | 'water' | 'harvest';

export interface FlowerConfig {
  id: FlowerType;
  name: string;
  color: string;
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

export interface FlowerLevelConfig {
  level: number;
  maxHarvests: number;
  cooldownSeconds: number;
  upgradeCostCoins: number;
}

export interface PurchaseTask {
  id: string;
  name: string;
  description: string;
  costFlowers?: Partial<Record<FlowerType, number>>;
  costAnyFlowers?: number;
  costCoins?: number;
  rewardCoins?: number;
  rewardWater?: number;
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
  type: 'seed' | 'water' | 'harvest' | 'levelup' | 'task';
  potId?: number;
  flowerType?: FlowerType;
  taskRewardCoins?: number;
  taskRewardWater?: number;
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
