/**
 * 成就系统配置
 * 定义所有成就及其解锁条件
 */

import type { FlowerType } from '../types';

export type AchievementId =
  | 'first_seed'
  | 'first_harvest'
  | 'first_upgrade'
  | 'harvest_10'
  | 'harvest_100'
  | 'harvest_500'
  | 'plant_50'
  | 'plant_200'
  | 'coins_1000'
  | 'coins_10000'
  | 'coins_100000'
  | 'fill_all_pots'
  | 'collect_5_types'
  | 'collect_10_types'
  | 'collect_20_types'
  | 'collect_30_types'
  | 'level_5'
  | 'level_10'
  | 'level_15'
  | 'level_20'
  | 'flower_level_5'
  | 'flower_level_10'
  | 'flower_level_20'
  | 'order_1'
  | 'order_10'
  | 'order_50'
  | 'rainy_harvest'
  | 'night_harvest';

export type AchievementCategory = 'growing' | 'economy' | 'collection' | 'milestone' | 'special';

export interface AchievementDef {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  /** 成就完成给予的金币奖励 */
  rewardCoins: number;
  /** 成就完成解锁的花朵（可选） */
  rewardFlower?: FlowerType;
  /** 成就是否隐藏（未达成前不显示描述） */
  hidden?: boolean;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // ===== 种植 =====
  { id: 'first_seed',      name: '初次播种',     description: '播下你的第一颗种子',           icon: '🌱', category: 'growing',    rewardCoins: 10 },
  { id: 'first_harvest',   name: '初次收获',     description: '收获你的第一朵花',             icon: '🌸', category: 'growing',    rewardCoins: 20 },
  { id: 'plant_50',        name: '播种达人',     description: '累计播种 50 次',               icon: '🌿', category: 'growing',    rewardCoins: 200 },
  { id: 'plant_200',       name: '播种大师',     description: '累计播种 200 次',              icon: '🌳', category: 'growing',    rewardCoins: 1000, rewardFlower: 'lilyvalley' },
  { id: 'harvest_10',      name: '小小花农',     description: '累计收获 10 次',               icon: '🧑‍🌾', category: 'growing',    rewardCoins: 50 },
  { id: 'harvest_100',     name: '勤劳花匠',     description: '累计收获 100 次',              icon: '👨‍🌾', category: 'growing',    rewardCoins: 500, rewardFlower: 'lycoris' },
  { id: 'harvest_500',     name: '花园传奇',     description: '累计收获 500 次',              icon: '👑', category: 'growing',    rewardCoins: 3000 },
  { id: 'fill_all_pots',   name: '满园春色',     description: '同时种满所有已解锁的花盆',     icon: '🏡', category: 'growing',    rewardCoins: 500 },

  // ===== 经济 =====
  { id: 'coins_1000',      name: '小有积蓄',     description: '累计获得 1,000 金币',          icon: '💰', category: 'economy',    rewardCoins: 100 },
  { id: 'coins_10000',     name: '万贯家财',     description: '累计获得 10,000 金币',         icon: '💎', category: 'economy',    rewardCoins: 500 },
  { id: 'coins_100000',    name: '花园富翁',     description: '累计获得 100,000 金币',        icon: '🏆', category: 'economy',    rewardCoins: 5000, rewardFlower: 'birdofparadise' },
  { id: 'order_1',         name: '首笔订单',     description: '完成第一个收购订单',           icon: '📜', category: 'economy',    rewardCoins: 50 },
  { id: 'order_10',        name: '商业新星',     description: '累计完成 10 个收购订单',       icon: '📊', category: 'economy',    rewardCoins: 300 },
  { id: 'order_50',        name: '花卉商人',     description: '累计完成 50 个收购订单',       icon: '🤝', category: 'economy',    rewardCoins: 2000 },

  // ===== 收藏 =====
  { id: 'collect_5_types',   name: '初识百花',   description: '解锁 5 种不同的花朵',         icon: '📖', category: 'collection', rewardCoins: 100 },
  { id: 'collect_10_types',  name: '花卉鉴赏',   description: '解锁 10 种不同的花朵',        icon: '📚', category: 'collection', rewardCoins: 300 },
  { id: 'collect_20_types',  name: '花卉专家',   description: '解锁 20 种不同的花朵',        icon: '🎓', category: 'collection', rewardCoins: 1000 },
  { id: 'collect_30_types',  name: '百花全书',   description: '收集全部 30 种花朵',           icon: '🌈', category: 'collection', rewardCoins: 5000 },
  { id: 'first_upgrade',     name: '精益求精',   description: '首次升级一种花朵',             icon: '⬆️', category: 'collection', rewardCoins: 30 },
  { id: 'flower_level_5',    name: '培育进阶',   description: '将任意花朵升级到 Lv.5',        icon: '🌟', category: 'collection', rewardCoins: 200 },
  { id: 'flower_level_10',   name: '花艺名家',   description: '将任意花朵升级到 Lv.10',       icon: '✨', category: 'collection', rewardCoins: 1000 },
  { id: 'flower_level_20',   name: '育花宗师',   description: '将任意花朵升级到 Lv.20',       icon: '🔥', category: 'collection', rewardCoins: 10000 },

  // ===== 里程碑 =====
  { id: 'level_5',         name: '小有成就',     description: '玩家等级达到 Lv.5',            icon: '⭐', category: 'milestone',   rewardCoins: 200 },
  { id: 'level_10',        name: '经验丰富',     description: '玩家等级达到 Lv.10',           icon: '🌠', category: 'milestone',   rewardCoins: 1000 },
  { id: 'level_15',        name: '资深花匠',     description: '玩家等级达到 Lv.15',           icon: '💫', category: 'milestone',   rewardCoins: 3000 },
  { id: 'level_20',        name: '花园大师',     description: '玩家等级达到 Lv.20',           icon: '🎖️', category: 'milestone',   rewardCoins: 10000 },

  // ===== 特殊 =====
  { id: 'rainy_harvest',   name: '雨中收获',     description: '在雨天收获花朵',               icon: '🌧️', category: 'special',    rewardCoins: 100, rewardFlower: 'snowlotus', hidden: true },
  { id: 'night_harvest',   name: '月下采花',     description: '在夜晚收获花朵',               icon: '🌙', category: 'special',    rewardCoins: 100, rewardFlower: 'datura', hidden: true },
];

export const ACHIEVEMENT_CATEGORIES: { id: AchievementCategory; name: string; icon: string }[] = [
  { id: 'growing',    name: '种植',   icon: '🌱' },
  { id: 'economy',    name: '经济',   icon: '💰' },
  { id: 'collection', name: '收藏',   icon: '📖' },
  { id: 'milestone',  name: '里程碑', icon: '⭐' },
  { id: 'special',    name: '特殊',   icon: '✨' },
];

export const getAchievementDef = (id: AchievementId): AchievementDef | undefined =>
  ACHIEVEMENT_DEFS.find(a => a.id === id);
