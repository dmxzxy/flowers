/**
 * 成就系统 Hook
 * 追踪累计统计 + 检测成就解锁 + 持久化 + 弹窗通知
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  AchievementId,
  getAchievementDef,
} from '../config/achievement.config';
import { ACHIEVEMENT_DEFS } from '../config/achievement.config';
import { ACHIEVEMENT_FLOWERS } from '../config/flower.config';
import type { PotData, FlowerLevels, PlayerLevelState, FlowerType } from '../types';
import type { TimeOfDay, Weather } from './useAtmosphere';

/* ========== 累计统计 ========== */
export interface AchievementStats {
  totalPlanted: number;
  totalHarvested: number;
  totalCoinsEarned: number;
  totalOrdersCompleted: number;
}

/* ========== 存储结构 ========== */
interface AchievementSave {
  unlocked: AchievementId[];
  stats: AchievementStats;
  /** 已领取奖励的成就 */
  claimed: AchievementId[];
}

const SAVE_KEY = 'flowers_achievements';
const INITIAL_STATS: AchievementStats = {
  totalPlanted: 0,
  totalHarvested: 0,
  totalCoinsEarned: 0,
  totalOrdersCompleted: 0,
};

function loadAchievements(): AchievementSave {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as AchievementSave;
      return {
        unlocked: Array.isArray(data.unlocked) ? data.unlocked : [],
        stats: { ...INITIAL_STATS, ...data.stats },
        claimed: Array.isArray(data.claimed) ? data.claimed : [],
      };
    }
  } catch { /* ignore */ }
  return { unlocked: [], stats: { ...INITIAL_STATS }, claimed: [] };
}

function saveAchievements(data: AchievementSave) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

/* ========== 新解锁弹出 ========== */
export interface AchievementToast {
  id: number;
  achievementId: AchievementId;
}

/* ========== Hook ========== */
export function useAchievements(
  pots: PotData[],
  flowerLevels: FlowerLevels,
  playerLevel: PlayerLevelState,
  addCoins: (amount: number) => void,
  isPotUnlocked?: (potId: number) => boolean,
) {
  const [save, setSave] = useState<AchievementSave>(loadAchievements);
  const [toasts, setToasts] = useState<AchievementToast[]>([]);
  const toastIdRef = useRef(0);
  const atmosRef = useRef<{ timeOfDay: TimeOfDay; weather: Weather }>({ timeOfDay: 'morning', weather: 'clear' });

  // Write to localStorage on every change
  useEffect(() => {
    saveAchievements(save);
  }, [save]);

  const unlock = useCallback((id: AchievementId) => {
    setSave(prev => {
      if (prev.unlocked.includes(id)) return prev;
      // Push toast
      const tid = ++toastIdRef.current;
      setToasts(t => [...t, { id: tid, achievementId: id }]);
      return { ...prev, unlocked: [...prev.unlocked, id] };
    });
  }, []);

  const dismissToast = useCallback((toastId: number) => {
    setToasts(t => t.filter(tt => tt.id !== toastId));
  }, []);

  /** 领取成就奖励 */
  const claimReward = useCallback((achievementId: AchievementId) => {
    setSave(prev => {
      if (prev.claimed.includes(achievementId)) return prev;
      if (!prev.unlocked.includes(achievementId)) return prev;
      const def = getAchievementDef(achievementId);
      if (def && def.rewardCoins > 0) {
        addCoins(def.rewardCoins);
      }
      return { ...prev, claimed: [...prev.claimed, achievementId] };
    });
  }, [addCoins]);

  /** 更新天气/时间引用（由外部调用） */
  const setAtmosphere = useCallback((timeOfDay: TimeOfDay, weather: Weather) => {
    atmosRef.current = { timeOfDay, weather };
  }, []);

  /* ===== 统计递增 API ===== */
  const recordPlant = useCallback(() => {
    setSave(prev => {
      const stats = { ...prev.stats, totalPlanted: prev.stats.totalPlanted + 1 };
      return { ...prev, stats };
    });
  }, []);

  const recordHarvest = useCallback(() => {
    setSave(prev => {
      const stats = { ...prev.stats, totalHarvested: prev.stats.totalHarvested + 1 };
      return { ...prev, stats };
    });
    // 特殊成就：雨天/夜晚收获
    const { timeOfDay, weather } = atmosRef.current;
    if (weather === 'rainy') unlock('rainy_harvest');
    if (timeOfDay === 'night') unlock('night_harvest');
  }, [unlock]);

  const recordCoinsEarned = useCallback((amount: number) => {
    if (amount <= 0) return;
    setSave(prev => {
      const stats = { ...prev.stats, totalCoinsEarned: prev.stats.totalCoinsEarned + amount };
      return { ...prev, stats };
    });
  }, []);

  const recordOrderCompleted = useCallback(() => {
    setSave(prev => {
      const stats = { ...prev.stats, totalOrdersCompleted: prev.stats.totalOrdersCompleted + 1 };
      return { ...prev, stats };
    });
  }, []);

  /* ===== 成就检测（每次 save 变化时运行） ===== */
  useEffect(() => {
    const { stats, unlocked } = save;
    const has = (id: AchievementId) => unlocked.includes(id);

    // --- 种植 ---
    if (!has('first_seed') && stats.totalPlanted >= 1) unlock('first_seed');
    if (!has('plant_50') && stats.totalPlanted >= 50) unlock('plant_50');
    if (!has('plant_200') && stats.totalPlanted >= 200) unlock('plant_200');

    // --- 收获 ---
    if (!has('first_harvest') && stats.totalHarvested >= 1) unlock('first_harvest');
    if (!has('harvest_10') && stats.totalHarvested >= 10) unlock('harvest_10');
    if (!has('harvest_100') && stats.totalHarvested >= 100) unlock('harvest_100');
    if (!has('harvest_500') && stats.totalHarvested >= 500) unlock('harvest_500');

    // --- 金币 ---
    if (!has('coins_1000') && stats.totalCoinsEarned >= 1000) unlock('coins_1000');
    if (!has('coins_10000') && stats.totalCoinsEarned >= 10000) unlock('coins_10000');
    if (!has('coins_100000') && stats.totalCoinsEarned >= 100000) unlock('coins_100000');

    // --- 订单 ---
    if (!has('order_1') && stats.totalOrdersCompleted >= 1) unlock('order_1');
    if (!has('order_10') && stats.totalOrdersCompleted >= 10) unlock('order_10');
    if (!has('order_50') && stats.totalOrdersCompleted >= 50) unlock('order_50');

    // --- 花盆全满（只检查已解锁的花盆） ---
    if (!has('fill_all_pots')) {
      const unlockedPots = isPotUnlocked ? pots.filter(p => isPotUnlocked(p.id)) : pots;
      const allFilled = unlockedPots.length > 0 && unlockedPots.every(p => p.state !== 'empty');
      if (allFilled) unlock('fill_all_pots');
    }

    // --- 花朵种类收集（基于 flowerLevels > 1 或 stats.totalPlanted > 0 来判断"解锁"） ---
    // 用 playerLevel 对应的解锁来判断
    const plevel = playerLevel.level;
    if (!has('level_5') && plevel >= 5) unlock('level_5');
    if (!has('level_10') && plevel >= 10) unlock('level_10');
    if (!has('level_15') && plevel >= 15) unlock('level_15');
    if (!has('level_20') && plevel >= 20) unlock('level_20');

    // --- 花朵升级 ---
    const flowerLevelValues = Object.values(flowerLevels);
    const maxFlowerLevel = Math.max(...flowerLevelValues, 1);
    const hasUpgraded = flowerLevelValues.some(lv => lv > 1);
    if (!has('first_upgrade') && hasUpgraded) unlock('first_upgrade');
    if (!has('flower_level_5') && maxFlowerLevel >= 5) unlock('flower_level_5');
    if (!has('flower_level_10') && maxFlowerLevel >= 10) unlock('flower_level_10');
    if (!has('flower_level_20') && maxFlowerLevel >= 20) unlock('flower_level_20');

    // --- 花朵种类解锁数（等级解锁 + 成就解锁） ---
    const levelUnlockedCount = getUnlockedCount(plevel);
    // 成就已领取且有 rewardFlower 的花朵数
    const achFlowerCount = ACHIEVEMENT_FLOWERS.filter(f => {
      const achDef = ACHIEVEMENT_DEFS.find(a => a.rewardFlower === f);
      return achDef && save.claimed.includes(achDef.id);
    }).length;
    const unlockedCount = levelUnlockedCount + achFlowerCount;
    if (!has('collect_5_types') && unlockedCount >= 5) unlock('collect_5_types');
    if (!has('collect_10_types') && unlockedCount >= 10) unlock('collect_10_types');
    if (!has('collect_20_types') && unlockedCount >= 20) unlock('collect_20_types');
    if (!has('collect_30_types') && unlockedCount >= 30) unlock('collect_30_types');
  }, [save, pots, flowerLevels, playerLevel, unlock]);

  // 计算成就已解锁的花朵列表（已领取奖励 = claimed 的成就中包含 rewardFlower）
  const achievementUnlockedFlowers: FlowerType[] = ACHIEVEMENT_FLOWERS.filter(f => {
    const achDef = ACHIEVEMENT_DEFS.find(a => a.rewardFlower === f);
    return achDef && save.claimed.includes(achDef.id);
  });

  return {
    achievements: save,
    toasts,
    dismissToast,
    claimReward,
    recordPlant,
    recordHarvest,
    recordCoinsEarned,
    recordOrderCompleted,
    setAtmosphere,
    achievementUnlockedFlowers,
  };
}

/** 根据玩家等级计算已解锁花朵数（仅等级解锁部分，不含成就花朵） */
function getUnlockedCount(level: number): number {
  // Lv1~2: 5(rose,tulip,daisy,sunflower,lavender)
  // Lv3: +2=7, Lv4: +2=9, Lv5: +1=10
  // Lv6~15: +2 each = 10+20=30
  if (level <= 1) return 3;
  if (level <= 2) return 5;
  if (level <= 4) return 5 + (level - 2) * 2;
  if (level <= 5) return 9 + 1; // Lv5: hibiscus
  // Lv6+: 10 + (level-5)*2
  return Math.min(10 + (level - 5) * 2, 30);
}
