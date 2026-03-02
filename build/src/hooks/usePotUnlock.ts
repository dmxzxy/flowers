/**
 * 花盆解锁 Hook
 * 管理花盆的分排等级解锁 + 单个购买解锁
 */
import { useState, useCallback, useMemo } from 'react';
import {
  GRID_COLS,
  POT_ROW_UNLOCKS,
  INITIAL_UNLOCKED_POTS,
  getPotRowConfig,
} from '../config/game.config';

export interface PotLockInfo {
  /** 该花盆是否已解锁可用 */
  unlocked: boolean;
  /** 所在行的等级要求 */
  requiredLevel: number;
  /** 单个花盆购买价格 */
  cost: number;
  /** 玩家等级是否已达到该行要求（行已开放） */
  rowAvailable: boolean;
  /** 是否可以购买（行已开放 + 尚未解锁） */
  canBuy: boolean;
}

export const usePotUnlock = (
  playerLevel: number,
  spendCoins: (amount: number) => boolean,
  savedUnlockedPots?: number[]
) => {
  const [unlockedPotIds, setUnlockedPotIds] = useState<Set<number>>(
    () => new Set(savedUnlockedPots ?? INITIAL_UNLOCKED_POTS)
  );

  /** 检查某个花盆是否已解锁 */
  const isPotUnlocked = useCallback(
    (potId: number): boolean => unlockedPotIds.has(potId),
    [unlockedPotIds]
  );

  /** 获取某个花盆的锁定信息 */
  const getPotLockInfo = useCallback(
    (potId: number): PotLockInfo => {
      const row = Math.floor(potId / GRID_COLS);
      const rowConfig = getPotRowConfig(row);
      const unlocked = unlockedPotIds.has(potId);
      const rowAvailable = playerLevel >= rowConfig.requiredLevel;
      return {
        unlocked,
        requiredLevel: rowConfig.requiredLevel,
        cost: rowConfig.costPerPot,
        rowAvailable,
        canBuy: rowAvailable && !unlocked && rowConfig.costPerPot > 0,
      };
    },
    [playerLevel, unlockedPotIds]
  );

  /** 购买解锁一个花盆 */
  const buyPot = useCallback(
    (potId: number): boolean => {
      const info = getPotLockInfo(potId);
      if (info.unlocked) return true; // 已解锁
      if (!info.rowAvailable) return false; // 等级不够
      if (info.cost > 0 && !spendCoins(info.cost)) return false; // 金币不足
      setUnlockedPotIds(prev => new Set([...prev, potId]));
      return true;
    },
    [getPotLockInfo, spendCoins]
  );

  /** 已解锁花盆 ID 数组（用于存档） */
  const unlockedPotIdsArray = useMemo(
    () => Array.from(unlockedPotIds).sort((a, b) => a - b),
    [unlockedPotIds]
  );

  /** 可见的行数（当前等级能看到的最大行数，用于渲染） */
  const visibleRows = useMemo(() => {
    let maxRow = 0;
    for (const rc of POT_ROW_UNLOCKS) {
      if (playerLevel >= rc.requiredLevel) maxRow = rc.row;
    }
    // 多显示一行（下一排预览，让玩家知道还有更多）
    return Math.min(maxRow + 2, POT_ROW_UNLOCKS.length);
  }, [playerLevel]);

  return {
    unlockedPotIds,
    unlockedPotIdsArray,
    isPotUnlocked,
    getPotLockInfo,
    buyPot,
    visibleRows,
  };
};
