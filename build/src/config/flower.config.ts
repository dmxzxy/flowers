/**
 * 花朵品种配置 & 等级配置
 * 从 data/flowers.ts 迁移，纯数据无逻辑
 */
import { FlowerConfig, FlowerType, FlowerLevelConfig, PlayerLevelConfig, FlowerUnlockInfo } from '../types';

// ==================== 全部花朵 ID 列表 ====================
export const ALL_FLOWERS: FlowerType[] = [
  'rose', 'tulip', 'daisy', 'sunflower', 'lavender',
  'orchid', 'peony', 'carnation', 'chrysanthemum', 'hibiscus',
];

// ==================== 花朵等级配置（含花卉之魂 + 金币升级消耗，共 20 级） ====================
export const FLOWER_LEVEL_CONFIGS: FlowerLevelConfig[] = [
  // Lv.1~5：基础阶段
  { level: 1,  maxHarvests: 1, yieldPerHarvest: 1, cooldownSeconds: 0,   upgradeCostCoins: 50,    upgradeCostSouls: 1,  upgradeLabel: '↑ 收割次数' },
  { level: 2,  maxHarvests: 2, yieldPerHarvest: 1, cooldownSeconds: 30,  upgradeCostCoins: 150,   upgradeCostSouls: 2,  upgradeLabel: '↑ 收割产量' },
  { level: 3,  maxHarvests: 2, yieldPerHarvest: 2, cooldownSeconds: 25,  upgradeCostCoins: 300,   upgradeCostSouls: 3,  upgradeLabel: '↓ 冷却时间' },
  { level: 4,  maxHarvests: 3, yieldPerHarvest: 2, cooldownSeconds: 20,  upgradeCostCoins: 500,   upgradeCostSouls: 5,  upgradeLabel: '↑ 收割产量' },
  { level: 5,  maxHarvests: 3, yieldPerHarvest: 3, cooldownSeconds: 18,  upgradeCostCoins: 800,   upgradeCostSouls: 7,  upgradeLabel: '↑ 收割次数' },
  // Lv.6~10：成长阶段
  { level: 6,  maxHarvests: 4, yieldPerHarvest: 3, cooldownSeconds: 15,  upgradeCostCoins: 1200,  upgradeCostSouls: 10, upgradeLabel: '↓ 冷却时间' },
  { level: 7,  maxHarvests: 4, yieldPerHarvest: 3, cooldownSeconds: 12,  upgradeCostCoins: 1800,  upgradeCostSouls: 13, upgradeLabel: '↑ 收割产量' },
  { level: 8,  maxHarvests: 4, yieldPerHarvest: 4, cooldownSeconds: 12,  upgradeCostCoins: 2500,  upgradeCostSouls: 16, upgradeLabel: '↑ 收割次数' },
  { level: 9,  maxHarvests: 5, yieldPerHarvest: 4, cooldownSeconds: 10,  upgradeCostCoins: 3500,  upgradeCostSouls: 20, upgradeLabel: '↓ 冷却时间' },
  { level: 10, maxHarvests: 5, yieldPerHarvest: 4, cooldownSeconds: 8,   upgradeCostCoins: 5000,  upgradeCostSouls: 25, upgradeLabel: '↑ 收割产量' },
  // Lv.11~15：精通阶段
  { level: 11, maxHarvests: 5, yieldPerHarvest: 5, cooldownSeconds: 8,   upgradeCostCoins: 7000,  upgradeCostSouls: 30, upgradeLabel: '↑ 收割次数' },
  { level: 12, maxHarvests: 6, yieldPerHarvest: 5, cooldownSeconds: 7,   upgradeCostCoins: 9500,  upgradeCostSouls: 36, upgradeLabel: '↓ 冷却时间' },
  { level: 13, maxHarvests: 6, yieldPerHarvest: 5, cooldownSeconds: 6,   upgradeCostCoins: 12000, upgradeCostSouls: 42, upgradeLabel: '↑ 收割产量' },
  { level: 14, maxHarvests: 6, yieldPerHarvest: 6, cooldownSeconds: 6,   upgradeCostCoins: 16000, upgradeCostSouls: 50, upgradeLabel: '↑ 收割次数' },
  { level: 15, maxHarvests: 7, yieldPerHarvest: 6, cooldownSeconds: 5,   upgradeCostCoins: 20000, upgradeCostSouls: 58, upgradeLabel: '↓ 冷却时间' },
  // Lv.16~20：大师阶段
  { level: 16, maxHarvests: 7, yieldPerHarvest: 6, cooldownSeconds: 4,   upgradeCostCoins: 26000, upgradeCostSouls: 68, upgradeLabel: '↑ 收割产量' },
  { level: 17, maxHarvests: 7, yieldPerHarvest: 7, cooldownSeconds: 4,   upgradeCostCoins: 33000, upgradeCostSouls: 80, upgradeLabel: '↑ 收割次数' },
  { level: 18, maxHarvests: 8, yieldPerHarvest: 7, cooldownSeconds: 3,   upgradeCostCoins: 42000, upgradeCostSouls: 95, upgradeLabel: '↓ 冷却时间' },
  { level: 19, maxHarvests: 8, yieldPerHarvest: 8, cooldownSeconds: 2,   upgradeCostCoins: 55000, upgradeCostSouls: 115, upgradeLabel: '↑ 收割产量' },
  { level: 20, maxHarvests: 8, yieldPerHarvest: 9, cooldownSeconds: 2,   upgradeCostCoins: 0,     upgradeCostSouls: 0 },
];

export const MAX_FLOWER_LEVEL = FLOWER_LEVEL_CONFIGS.length;

export const getLevelConfig = (level: number): FlowerLevelConfig => {
  const idx = Math.max(0, Math.min(level - 1, FLOWER_LEVEL_CONFIGS.length - 1));
  return FLOWER_LEVEL_CONFIGS[idx];
};

// ==================== 花朵品种配置 ====================
export const flowers: FlowerConfig[] = [
  {
    id: 'rose', name: '玫瑰', color: '#E74C3C', basePrice: 5,
    states: {
      seed: '/art/flower/flower_rose_seed.svg',
      sprout: '/art/flower/flower_rose_sprout.svg',
      growing: '/art/flower/flower_rose_growing.svg',
      bloom: '/art/flower/flower_rose_bloom.svg',
    },
  },
  {
    id: 'tulip', name: '郁金香', color: '#F1C40F', basePrice: 5,
    states: {
      seed: '/art/flower/flower_tulip_seed.svg',
      sprout: '/art/flower/flower_tulip_sprout.svg',
      growing: '/art/flower/flower_tulip_growing.svg',
      bloom: '/art/flower/flower_tulip_bloom.svg',
    },
  },
  {
    id: 'daisy', name: '雏菊', color: '#FFFFFF', basePrice: 5,
    states: {
      seed: '/art/flower/flower_daisy_seed.svg',
      sprout: '/art/flower/flower_daisy_sprout.svg',
      growing: '/art/flower/flower_daisy_growing.svg',
      bloom: '/art/flower/flower_daisy_bloom.svg',
    },
  },
  {
    id: 'sunflower', name: '向日葵', color: '#F39C12', basePrice: 8,
    states: {
      seed: '/art/flower/flower_sunflower_seed.svg',
      sprout: '/art/flower/flower_sunflower_sprout.svg',
      growing: '/art/flower/flower_sunflower_growing.svg',
      bloom: '/art/flower/flower_sunflower_bloom.svg',
    },
  },
  {
    id: 'lavender', name: '薰衣草', color: '#9B59B6', basePrice: 8,
    states: {
      seed: '/art/flower/flower_lavender_seed.svg',
      sprout: '/art/flower/flower_lavender_sprout.svg',
      growing: '/art/flower/flower_lavender_growing.svg',
      bloom: '/art/flower/flower_lavender_bloom.svg',
    },
  },
  {
    id: 'orchid', name: '兰花', color: '#8E44AD', basePrice: 12,
    states: {
      seed: '/art/flower/flower_orchid_seed.svg',
      sprout: '/art/flower/flower_orchid_sprout.svg',
      growing: '/art/flower/flower_orchid_growing.svg',
      bloom: '/art/flower/flower_orchid_bloom.svg',
    },
  },
  {
    id: 'peony', name: '牡丹', color: '#FFB6C1', basePrice: 12,
    states: {
      seed: '/art/flower/flower_peony_seed.svg',
      sprout: '/art/flower/flower_peony_sprout.svg',
      growing: '/art/flower/flower_peony_growing.svg',
      bloom: '/art/flower/flower_peony_bloom.svg',
    },
  },
  {
    id: 'carnation', name: '康乃馨', color: '#FF69B4', basePrice: 15,
    states: {
      seed: '/art/flower/flower_carnation_seed.svg',
      sprout: '/art/flower/flower_carnation_sprout.svg',
      growing: '/art/flower/flower_carnation_growing.svg',
      bloom: '/art/flower/flower_carnation_bloom.svg',
    },
  },
  {
    id: 'chrysanthemum', name: '菊花', color: '#DDA0DD', basePrice: 15,
    states: {
      seed: '/art/flower/flower_chrysanthemum_seed.svg',
      sprout: '/art/flower/flower_chrysanthemum_sprout.svg',
      growing: '/art/flower/flower_chrysanthemum_growing.svg',
      bloom: '/art/flower/flower_chrysanthemum_bloom.svg',
    },
  },
  {
    id: 'hibiscus', name: '扶桑', color: '#FF6347', basePrice: 20,
    states: {
      seed: '/art/flower/flower_hibiscus_seed.svg',
      sprout: '/art/flower/flower_hibiscus_sprout.svg',
      growing: '/art/flower/flower_hibiscus_growing.svg',
      bloom: '/art/flower/flower_hibiscus_bloom.svg',
    },
  },
];

export const getFlowerConfig = (id: string): FlowerConfig | undefined => {
  return flowers.find(f => f.id === id);
};

/** 获取花朵基础售价 */
export const getFlowerPrice = (flowerType: FlowerType): number => {
  const cfg = flowers.find(f => f.id === flowerType);
  return cfg?.basePrice ?? 5;
};

// ==================== 采购任务生成参数 ====================
/** 采购任务总数 */
export const PURCHASE_TASK_COUNT = 5;
/** 每个任务需求花朵品种数 [min, max] */
export const TASK_FLOWER_TYPES_RANGE: [number, number] = [1, 3];
/** 每种花需求数量 [min, max] */
export const TASK_FLOWER_AMOUNT_RANGE: [number, number] = [1, 4];
/** 采购任务奖励金币倍率（基于花朵售价总和） */
export const TASK_REWARD_COIN_MULTIPLIER = 1.5;
/** 采购任务奖励经验倍率 */
export const TASK_REWARD_XP_MULTIPLIER = 0.5;
/** 采购任务冷却时间（毫秒） */
export const TASK_COOLDOWN_MS = 60_000;
/** 每次收割掉落花卉之魂的概率（0~1） */
export const SOUL_DROP_CHANCE = 0.3;

// ==================== 玩家等级配置 ====================
export const PLAYER_LEVEL_CONFIGS: PlayerLevelConfig[] = [
  { level: 1, xpRequired: 0,   unlockedFlowers: ['rose', 'tulip', 'daisy'] },
  { level: 2, xpRequired: 20,  unlockedFlowers: ['sunflower', 'lavender'] },
  { level: 3, xpRequired: 50,  unlockedFlowers: ['orchid', 'peony'] },
  { level: 4, xpRequired: 100, unlockedFlowers: ['carnation', 'chrysanthemum'] },
  { level: 5, xpRequired: 200, unlockedFlowers: ['hibiscus'] },
  { level: 6, xpRequired: 350, unlockedFlowers: [] },
  { level: 7, xpRequired: 550, unlockedFlowers: [] },
  { level: 8, xpRequired: 800, unlockedFlowers: [] },
  { level: 9, xpRequired: 1100, unlockedFlowers: [] },
  { level: 10, xpRequired: 1500, unlockedFlowers: [] },
];

export const MAX_PLAYER_LEVEL = PLAYER_LEVEL_CONFIGS.length;

/** 每次收割获得的经验值 */
export const XP_PER_HARVEST = 5;

/** 获取指定等级的 XP 配置 */
export const getPlayerLevelConfig = (level: number): PlayerLevelConfig => {
  const idx = Math.max(0, Math.min(level - 1, PLAYER_LEVEL_CONFIGS.length - 1));
  return PLAYER_LEVEL_CONFIGS[idx];
};

/** 获取指定等级升到下一级所需的 XP */
export const getXpToNextLevel = (level: number): number => {
  if (level >= MAX_PLAYER_LEVEL) return 0;
  return PLAYER_LEVEL_CONFIGS[level].xpRequired - PLAYER_LEVEL_CONFIGS[level - 1].xpRequired;
};

/** 获取花朵解锁信息列表 */
export const FLOWER_UNLOCK_MAP: FlowerUnlockInfo[] = PLAYER_LEVEL_CONFIGS.flatMap(cfg =>
  cfg.unlockedFlowers.map(f => ({ flowerType: f, requiredPlayerLevel: cfg.level }))
);

/** 获取指定花朵的解锁等级 */
export const getFlowerUnlockLevel = (flowerType: FlowerType): number => {
  const info = FLOWER_UNLOCK_MAP.find(u => u.flowerType === flowerType);
  return info?.requiredPlayerLevel ?? 1;
};

/** 获取指定玩家等级下已解锁的花朵列表 */
export const getUnlockedFlowers = (playerLevel: number): FlowerType[] => {
  return PLAYER_LEVEL_CONFIGS
    .filter(cfg => cfg.level <= playerLevel)
    .flatMap(cfg => cfg.unlockedFlowers);
};
