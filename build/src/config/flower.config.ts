/**
 * 花朵品种配置 & 等级配置
 * 从 data/flowers.ts 迁移，纯数据无逻辑
 */
import { FlowerConfig, FlowerType, FlowerLevelConfig } from '../types';

// ==================== 全部花朵 ID 列表 ====================
export const ALL_FLOWERS: FlowerType[] = [
  'rose', 'tulip', 'daisy', 'sunflower', 'lavender',
  'orchid', 'peony', 'carnation', 'chrysanthemum', 'hibiscus',
];

// ==================== 等级配置 ====================
export const FLOWER_LEVEL_CONFIGS: FlowerLevelConfig[] = [
  { level: 1, maxHarvests: 1, cooldownSeconds: 0,  upgradeCostCoins: 50  },
  { level: 2, maxHarvests: 2, cooldownSeconds: 30, upgradeCostCoins: 150 },
  { level: 3, maxHarvests: 3, cooldownSeconds: 20, upgradeCostCoins: 300 },
  { level: 4, maxHarvests: 4, cooldownSeconds: 15, upgradeCostCoins: 500 },
  { level: 5, maxHarvests: 5, cooldownSeconds: 10, upgradeCostCoins: 0   },
];

export const MAX_FLOWER_LEVEL = FLOWER_LEVEL_CONFIGS.length;

export const getLevelConfig = (level: number): FlowerLevelConfig => {
  const idx = Math.max(0, Math.min(level - 1, FLOWER_LEVEL_CONFIGS.length - 1));
  return FLOWER_LEVEL_CONFIGS[idx];
};

// ==================== 花朵品种配置 ====================
export const flowers: FlowerConfig[] = [
  {
    id: 'rose', name: '玫瑰', color: '#E74C3C',
    states: {
      seed: '/art/flower/flower_rose_seed.svg',
      sprout: '/art/flower/flower_rose_sprout.svg',
      growing: '/art/flower/flower_rose_growing.svg',
      bloom: '/art/flower/flower_rose_bloom.svg',
    },
  },
  {
    id: 'tulip', name: '郁金香', color: '#F1C40F',
    states: {
      seed: '/art/flower/flower_tulip_seed.svg',
      sprout: '/art/flower/flower_tulip_sprout.svg',
      growing: '/art/flower/flower_tulip_growing.svg',
      bloom: '/art/flower/flower_tulip_bloom.svg',
    },
  },
  {
    id: 'daisy', name: '雏菊', color: '#FFFFFF',
    states: {
      seed: '/art/flower/flower_daisy_seed.svg',
      sprout: '/art/flower/flower_daisy_sprout.svg',
      growing: '/art/flower/flower_daisy_growing.svg',
      bloom: '/art/flower/flower_daisy_bloom.svg',
    },
  },
  {
    id: 'sunflower', name: '向日葵', color: '#F39C12',
    states: {
      seed: '/art/flower/flower_sunflower_seed.svg',
      sprout: '/art/flower/flower_sunflower_sprout.svg',
      growing: '/art/flower/flower_sunflower_growing.svg',
      bloom: '/art/flower/flower_sunflower_bloom.svg',
    },
  },
  {
    id: 'lavender', name: '薰衣草', color: '#9B59B6',
    states: {
      seed: '/art/flower/flower_lavender_seed.svg',
      sprout: '/art/flower/flower_lavender_sprout.svg',
      growing: '/art/flower/flower_lavender_growing.svg',
      bloom: '/art/flower/flower_lavender_bloom.svg',
    },
  },
  {
    id: 'orchid', name: '兰花', color: '#8E44AD',
    states: {
      seed: '/art/flower/flower_orchid_seed.svg',
      sprout: '/art/flower/flower_orchid_sprout.svg',
      growing: '/art/flower/flower_orchid_growing.svg',
      bloom: '/art/flower/flower_orchid_bloom.svg',
    },
  },
  {
    id: 'peony', name: '牡丹', color: '#FFB6C1',
    states: {
      seed: '/art/flower/flower_peony_seed.svg',
      sprout: '/art/flower/flower_peony_sprout.svg',
      growing: '/art/flower/flower_peony_growing.svg',
      bloom: '/art/flower/flower_peony_bloom.svg',
    },
  },
  {
    id: 'carnation', name: '康乃馨', color: '#FF69B4',
    states: {
      seed: '/art/flower/flower_carnation_seed.svg',
      sprout: '/art/flower/flower_carnation_sprout.svg',
      growing: '/art/flower/flower_carnation_growing.svg',
      bloom: '/art/flower/flower_carnation_bloom.svg',
    },
  },
  {
    id: 'chrysanthemum', name: '菊花', color: '#DDA0DD',
    states: {
      seed: '/art/flower/flower_chrysanthemum_seed.svg',
      sprout: '/art/flower/flower_chrysanthemum_sprout.svg',
      growing: '/art/flower/flower_chrysanthemum_growing.svg',
      bloom: '/art/flower/flower_chrysanthemum_bloom.svg',
    },
  },
  {
    id: 'hibiscus', name: '扶桑', color: '#FF6347',
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
