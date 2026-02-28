/**
 * 花朵品种配置 & 等级配置
 * ⚠️ 由配置编辑器生成，请勿手动修改
 */
import { FlowerConfig, FlowerType, FlowerLevelConfig, PlayerLevelConfig, FlowerUnlockInfo } from '../types';

// ==================== 全部花朵 ID 列表 ====================
export const ALL_FLOWERS: FlowerType[] = [
  'rose', 'tulip', 'daisy', 'sunflower', 'lavender', 'orchid', 'peony', 'carnation', 'chrysanthemum', 'hibiscus',
  'lily', 'sakura', 'violet', 'jasmine', 'iris', 'camellia', 'magnolia', 'gardenia', 'wisteria', 'plumeria',
  'lotus', 'azalea', 'hydrangea', 'freesia', 'anemone', 'dahlia', 'marigold', 'zinnia', 'bluebell', 'moonflower',
  // 成就解锁专属花朵
  'lycoris', 'snowlotus', 'datura', 'lilyvalley', 'birdofparadise',
];

// ==================== 花朵等级配置 ====================
export const FLOWER_LEVEL_CONFIGS: FlowerLevelConfig[] = [
  { level: 1, maxHarvests: 1, yieldPerHarvest: 1, cooldownSeconds: 0, upgradeCostCoins: 50, upgradeCostSouls: 1, upgradeLabel: '↑ 收割次数' },
  { level: 2, maxHarvests: 2, yieldPerHarvest: 1, cooldownSeconds: 30, upgradeCostCoins: 150, upgradeCostSouls: 2, upgradeLabel: '↑ 收割产量' },
  { level: 3, maxHarvests: 2, yieldPerHarvest: 2, cooldownSeconds: 25, upgradeCostCoins: 300, upgradeCostSouls: 3, upgradeLabel: '↓ 冷却时间' },
  { level: 4, maxHarvests: 3, yieldPerHarvest: 2, cooldownSeconds: 20, upgradeCostCoins: 500, upgradeCostSouls: 5, upgradeLabel: '↑ 收割产量' },
  { level: 5, maxHarvests: 3, yieldPerHarvest: 3, cooldownSeconds: 18, upgradeCostCoins: 800, upgradeCostSouls: 7, upgradeLabel: '↑ 收割次数' },
  { level: 6, maxHarvests: 4, yieldPerHarvest: 3, cooldownSeconds: 15, upgradeCostCoins: 1200, upgradeCostSouls: 10, upgradeLabel: '↓ 冷却时间' },
  { level: 7, maxHarvests: 4, yieldPerHarvest: 3, cooldownSeconds: 12, upgradeCostCoins: 1800, upgradeCostSouls: 13, upgradeLabel: '↑ 收割产量' },
  { level: 8, maxHarvests: 4, yieldPerHarvest: 4, cooldownSeconds: 12, upgradeCostCoins: 2500, upgradeCostSouls: 16, upgradeLabel: '↑ 收割次数' },
  { level: 9, maxHarvests: 5, yieldPerHarvest: 4, cooldownSeconds: 10, upgradeCostCoins: 3500, upgradeCostSouls: 20, upgradeLabel: '↓ 冷却时间' },
  { level: 10, maxHarvests: 5, yieldPerHarvest: 4, cooldownSeconds: 8, upgradeCostCoins: 5000, upgradeCostSouls: 25, upgradeLabel: '↑ 收割产量' },
  { level: 11, maxHarvests: 5, yieldPerHarvest: 5, cooldownSeconds: 8, upgradeCostCoins: 7000, upgradeCostSouls: 30, upgradeLabel: '↑ 收割次数' },
  { level: 12, maxHarvests: 6, yieldPerHarvest: 5, cooldownSeconds: 7, upgradeCostCoins: 9500, upgradeCostSouls: 36, upgradeLabel: '↓ 冷却时间' },
  { level: 13, maxHarvests: 6, yieldPerHarvest: 5, cooldownSeconds: 6, upgradeCostCoins: 12000, upgradeCostSouls: 42, upgradeLabel: '↑ 收割产量' },
  { level: 14, maxHarvests: 6, yieldPerHarvest: 6, cooldownSeconds: 6, upgradeCostCoins: 16000, upgradeCostSouls: 50, upgradeLabel: '↑ 收割次数' },
  { level: 15, maxHarvests: 7, yieldPerHarvest: 6, cooldownSeconds: 5, upgradeCostCoins: 20000, upgradeCostSouls: 58, upgradeLabel: '↓ 冷却时间' },
  { level: 16, maxHarvests: 7, yieldPerHarvest: 6, cooldownSeconds: 4, upgradeCostCoins: 26000, upgradeCostSouls: 68, upgradeLabel: '↑ 收割产量' },
  { level: 17, maxHarvests: 7, yieldPerHarvest: 7, cooldownSeconds: 4, upgradeCostCoins: 33000, upgradeCostSouls: 80, upgradeLabel: '↑ 收割次数' },
  { level: 18, maxHarvests: 8, yieldPerHarvest: 7, cooldownSeconds: 3, upgradeCostCoins: 42000, upgradeCostSouls: 95, upgradeLabel: '↓ 冷却时间' },
  { level: 19, maxHarvests: 8, yieldPerHarvest: 8, cooldownSeconds: 2, upgradeCostCoins: 55000, upgradeCostSouls: 115, upgradeLabel: '↑ 收割产量' },
  { level: 20, maxHarvests: 8, yieldPerHarvest: 9, cooldownSeconds: 2, upgradeCostCoins: 0, upgradeCostSouls: 0 },
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
  // ---- 第二批花朵（Lv.6~15 解锁）----
  {
    id: 'lily', name: '百合', color: '#F48FB1', basePrice: 20,
    states: {
      seed: '/art/flower/flower_lily_seed.svg',
      sprout: '/art/flower/flower_lily_sprout.svg',
      growing: '/art/flower/flower_lily_growing.svg',
      bloom: '/art/flower/flower_lily_bloom.svg',
    },
  },
  {
    id: 'sakura', name: '樱花', color: '#FFB7C5', basePrice: 22,
    states: {
      seed: '/art/flower/flower_sakura_seed.svg',
      sprout: '/art/flower/flower_sakura_sprout.svg',
      growing: '/art/flower/flower_sakura_growing.svg',
      bloom: '/art/flower/flower_sakura_bloom.svg',
    },
  },
  {
    id: 'violet', name: '紫罗兰', color: '#9575CD', basePrice: 22,
    states: {
      seed: '/art/flower/flower_violet_seed.svg',
      sprout: '/art/flower/flower_violet_sprout.svg',
      growing: '/art/flower/flower_violet_growing.svg',
      bloom: '/art/flower/flower_violet_bloom.svg',
    },
  },
  {
    id: 'jasmine', name: '茉莉', color: '#FFF9C4', basePrice: 25,
    states: {
      seed: '/art/flower/flower_jasmine_seed.svg',
      sprout: '/art/flower/flower_jasmine_sprout.svg',
      growing: '/art/flower/flower_jasmine_growing.svg',
      bloom: '/art/flower/flower_jasmine_bloom.svg',
    },
  },
  {
    id: 'iris', name: '鸢尾', color: '#42A5F5', basePrice: 25,
    states: {
      seed: '/art/flower/flower_iris_seed.svg',
      sprout: '/art/flower/flower_iris_sprout.svg',
      growing: '/art/flower/flower_iris_growing.svg',
      bloom: '/art/flower/flower_iris_bloom.svg',
    },
  },
  {
    id: 'camellia', name: '山茶', color: '#E53935', basePrice: 28,
    states: {
      seed: '/art/flower/flower_camellia_seed.svg',
      sprout: '/art/flower/flower_camellia_sprout.svg',
      growing: '/art/flower/flower_camellia_growing.svg',
      bloom: '/art/flower/flower_camellia_bloom.svg',
    },
  },
  {
    id: 'magnolia', name: '玉兰', color: '#FFE0B2', basePrice: 28,
    states: {
      seed: '/art/flower/flower_magnolia_seed.svg',
      sprout: '/art/flower/flower_magnolia_sprout.svg',
      growing: '/art/flower/flower_magnolia_growing.svg',
      bloom: '/art/flower/flower_magnolia_bloom.svg',
    },
  },
  {
    id: 'gardenia', name: '栀子', color: '#FFFACD', basePrice: 30,
    states: {
      seed: '/art/flower/flower_gardenia_seed.svg',
      sprout: '/art/flower/flower_gardenia_sprout.svg',
      growing: '/art/flower/flower_gardenia_growing.svg',
      bloom: '/art/flower/flower_gardenia_bloom.svg',
    },
  },
  {
    id: 'wisteria', name: '紫藤', color: '#AB47BC', basePrice: 30,
    states: {
      seed: '/art/flower/flower_wisteria_seed.svg',
      sprout: '/art/flower/flower_wisteria_sprout.svg',
      growing: '/art/flower/flower_wisteria_growing.svg',
      bloom: '/art/flower/flower_wisteria_bloom.svg',
    },
  },
  {
    id: 'plumeria', name: '鸡蛋花', color: '#FFE082', basePrice: 35,
    states: {
      seed: '/art/flower/flower_plumeria_seed.svg',
      sprout: '/art/flower/flower_plumeria_sprout.svg',
      growing: '/art/flower/flower_plumeria_growing.svg',
      bloom: '/art/flower/flower_plumeria_bloom.svg',
    },
  },
  {
    id: 'lotus', name: '莲花', color: '#F06292', basePrice: 35,
    states: {
      seed: '/art/flower/flower_lotus_seed.svg',
      sprout: '/art/flower/flower_lotus_sprout.svg',
      growing: '/art/flower/flower_lotus_growing.svg',
      bloom: '/art/flower/flower_lotus_bloom.svg',
    },
  },
  {
    id: 'azalea', name: '杜鹃', color: '#FF4081', basePrice: 38,
    states: {
      seed: '/art/flower/flower_azalea_seed.svg',
      sprout: '/art/flower/flower_azalea_sprout.svg',
      growing: '/art/flower/flower_azalea_growing.svg',
      bloom: '/art/flower/flower_azalea_bloom.svg',
    },
  },
  {
    id: 'hydrangea', name: '绣球', color: '#64B5F6', basePrice: 38,
    states: {
      seed: '/art/flower/flower_hydrangea_seed.svg',
      sprout: '/art/flower/flower_hydrangea_sprout.svg',
      growing: '/art/flower/flower_hydrangea_growing.svg',
      bloom: '/art/flower/flower_hydrangea_bloom.svg',
    },
  },
  {
    id: 'freesia', name: '小苍兰', color: '#FFD54F', basePrice: 40,
    states: {
      seed: '/art/flower/flower_freesia_seed.svg',
      sprout: '/art/flower/flower_freesia_sprout.svg',
      growing: '/art/flower/flower_freesia_growing.svg',
      bloom: '/art/flower/flower_freesia_bloom.svg',
    },
  },
  {
    id: 'anemone', name: '银莲花', color: '#EF5350', basePrice: 40,
    states: {
      seed: '/art/flower/flower_anemone_seed.svg',
      sprout: '/art/flower/flower_anemone_sprout.svg',
      growing: '/art/flower/flower_anemone_growing.svg',
      bloom: '/art/flower/flower_anemone_bloom.svg',
    },
  },
  {
    id: 'dahlia', name: '大丽花', color: '#FF7043', basePrice: 45,
    states: {
      seed: '/art/flower/flower_dahlia_seed.svg',
      sprout: '/art/flower/flower_dahlia_sprout.svg',
      growing: '/art/flower/flower_dahlia_growing.svg',
      bloom: '/art/flower/flower_dahlia_bloom.svg',
    },
  },
  {
    id: 'marigold', name: '万寿菊', color: '#FFB300', basePrice: 45,
    states: {
      seed: '/art/flower/flower_marigold_seed.svg',
      sprout: '/art/flower/flower_marigold_sprout.svg',
      growing: '/art/flower/flower_marigold_growing.svg',
      bloom: '/art/flower/flower_marigold_bloom.svg',
    },
  },
  {
    id: 'zinnia', name: '百日草', color: '#EC407A', basePrice: 50,
    states: {
      seed: '/art/flower/flower_zinnia_seed.svg',
      sprout: '/art/flower/flower_zinnia_sprout.svg',
      growing: '/art/flower/flower_zinnia_growing.svg',
      bloom: '/art/flower/flower_zinnia_bloom.svg',
    },
  },
  {
    id: 'bluebell', name: '风信子', color: '#7986CB', basePrice: 50,
    states: {
      seed: '/art/flower/flower_bluebell_seed.svg',
      sprout: '/art/flower/flower_bluebell_sprout.svg',
      growing: '/art/flower/flower_bluebell_growing.svg',
      bloom: '/art/flower/flower_bluebell_bloom.svg',
    },
  },
  {
    id: 'moonflower', name: '月光花', color: '#C5CAE9', basePrice: 60,
    states: {
      seed: '/art/flower/flower_moonflower_seed.svg',
      sprout: '/art/flower/flower_moonflower_sprout.svg',
      growing: '/art/flower/flower_moonflower_growing.svg',
      bloom: '/art/flower/flower_moonflower_bloom.svg',
    },
  },
  // ---- 成就解锁专属花朵 ----
  {
    id: 'lycoris', name: '彼岸花', color: '#FF4500', basePrice: 65,
    states: {
      seed: '/art/flower/flower_lycoris_seed.svg',
      sprout: '/art/flower/flower_lycoris_sprout.svg',
      growing: '/art/flower/flower_lycoris_growing.svg',
      bloom: '/art/flower/flower_lycoris_bloom.svg',
    },
  },
  {
    id: 'snowlotus', name: '雪莲', color: '#B0D4F1', basePrice: 70,
    states: {
      seed: '/art/flower/flower_snowlotus_seed.svg',
      sprout: '/art/flower/flower_snowlotus_sprout.svg',
      growing: '/art/flower/flower_snowlotus_growing.svg',
      bloom: '/art/flower/flower_snowlotus_bloom.svg',
    },
  },
  {
    id: 'datura', name: '曼陀罗', color: '#7B1FA2', basePrice: 75,
    states: {
      seed: '/art/flower/flower_datura_seed.svg',
      sprout: '/art/flower/flower_datura_sprout.svg',
      growing: '/art/flower/flower_datura_growing.svg',
      bloom: '/art/flower/flower_datura_bloom.svg',
    },
  },
  {
    id: 'lilyvalley', name: '铃兰', color: '#90EE90', basePrice: 70,
    states: {
      seed: '/art/flower/flower_lilyvalley_seed.svg',
      sprout: '/art/flower/flower_lilyvalley_sprout.svg',
      growing: '/art/flower/flower_lilyvalley_growing.svg',
      bloom: '/art/flower/flower_lilyvalley_bloom.svg',
    },
  },
  {
    id: 'birdofparadise', name: '天堂鸟', color: '#FF8C00', basePrice: 80,
    states: {
      seed: '/art/flower/flower_birdofparadise_seed.svg',
      sprout: '/art/flower/flower_birdofparadise_sprout.svg',
      growing: '/art/flower/flower_birdofparadise_growing.svg',
      bloom: '/art/flower/flower_birdofparadise_bloom.svg',
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
export const TASK_COOLDOWN_MS = 60000;
/** 每次收割掉落花卉之魂的概率（0~1） */
export const SOUL_DROP_CHANCE = 0.3;

// ==================== 玩家等级配置 ====================
export const PLAYER_LEVEL_CONFIGS: PlayerLevelConfig[] = [
  { level: 1,  xpRequired: 0,     unlockedFlowers: ['rose', 'tulip', 'daisy'] },
  { level: 2,  xpRequired: 20,    unlockedFlowers: ['sunflower', 'lavender'] },
  { level: 3,  xpRequired: 50,    unlockedFlowers: ['orchid', 'peony'] },
  { level: 4,  xpRequired: 100,   unlockedFlowers: ['carnation', 'chrysanthemum'] },
  { level: 5,  xpRequired: 200,   unlockedFlowers: ['hibiscus'] },
  { level: 6,  xpRequired: 350,   unlockedFlowers: ['lily', 'sakura'] },
  { level: 7,  xpRequired: 550,   unlockedFlowers: ['violet', 'jasmine'] },
  { level: 8,  xpRequired: 800,   unlockedFlowers: ['iris', 'camellia'] },
  { level: 9,  xpRequired: 1100,  unlockedFlowers: ['magnolia', 'gardenia'] },
  { level: 10, xpRequired: 1500,  unlockedFlowers: ['wisteria', 'plumeria'] },
  { level: 11, xpRequired: 2000,  unlockedFlowers: ['lotus', 'azalea'] },
  { level: 12, xpRequired: 2600,  unlockedFlowers: ['hydrangea', 'freesia'] },
  { level: 13, xpRequired: 3300,  unlockedFlowers: ['anemone', 'dahlia'] },
  { level: 14, xpRequired: 4200,  unlockedFlowers: ['marigold', 'zinnia'] },
  { level: 15, xpRequired: 5300,  unlockedFlowers: ['bluebell', 'moonflower'] },
  { level: 16, xpRequired: 6600,  unlockedFlowers: [] },
  { level: 17, xpRequired: 8100,  unlockedFlowers: [] },
  { level: 18, xpRequired: 9800,  unlockedFlowers: [] },
  { level: 19, xpRequired: 11800, unlockedFlowers: [] },
  { level: 20, xpRequired: 14000, unlockedFlowers: [] },
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
  cfg.unlockedFlowers.map(f => ({ flowerType: f as FlowerType, requiredPlayerLevel: cfg.level }))
);

/** 获取指定花朵的解锁等级（成就解锁花朵返回 999） */
export const getFlowerUnlockLevel = (flowerType: FlowerType): number => {
  // 成就解锁花朵不在等级列表中
  if (ACHIEVEMENT_FLOWER_SET.has(flowerType)) return 999;
  const info = FLOWER_UNLOCK_MAP.find(u => u.flowerType === flowerType);
  return info?.requiredPlayerLevel ?? 1;
};

/** 获取指定玩家等级下已解锁的花朵列表 */
export const getUnlockedFlowers = (playerLevel: number): FlowerType[] => {
  return PLAYER_LEVEL_CONFIGS
    .filter(cfg => cfg.level <= playerLevel)
    .flatMap(cfg => cfg.unlockedFlowers as FlowerType[]);
};

// ==================== 成就解锁花朵 ====================
/** 通过成就解锁的花朵（不通过等级解锁） */
export const ACHIEVEMENT_FLOWERS: FlowerType[] = [
  'lycoris', 'snowlotus', 'datura', 'lilyvalley', 'birdofparadise',
];

/** 快速查询集合 */
export const ACHIEVEMENT_FLOWER_SET = new Set<FlowerType>(ACHIEVEMENT_FLOWERS);

/** 判断花朵是否为成就解锁类型 */
export const isAchievementFlower = (flowerType: FlowerType): boolean =>
  ACHIEVEMENT_FLOWER_SET.has(flowerType);
