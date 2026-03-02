/**
 * 游戏主状态 Hook — 胶水层
 * 组合所有子 hooks，返回统一 API
 *
 * 重构后职责：仅做子 hook 的组装和依赖注入，不含业务逻辑
 * 含存档系统：自动保存 / 读取 / 清除
 */
import { useCallback, useMemo } from 'react';
import { useEffects } from './useEffects';
import { useCurrency } from './useCurrency';
import { useInventory } from './useInventory';
import { useFlowerLevels } from './useFlowerLevels';
import { useFlowerSouls } from './useFlowerSouls';
import { usePlayerLevel } from './usePlayerLevel';
import { usePots } from './usePots';
import { usePickers } from './usePickers';
import { useBuyOrders } from './useBuyOrder';
import { usePurchaseTasks } from './usePurchaseTasks';
import { usePotSkins } from './usePotSkins';
import { usePotUnlock } from './usePotUnlock';
import { useAchievements } from './useAchievements';
import { loadSave, clearSave, useSaveGame, SaveData } from './useSaveGame';
import { MAX_WATER, WATER_REGEN_INTERVAL_MS, WATER_REGEN_AMOUNT } from '../config';

// 启动时读一次存档，并进行离线补偿
const initialSave: SaveData | null = (() => {
  const save = loadSave();
  if (!save) return null;

  const now = Date.now();
  const elapsed = now - save.savedAt;
  if (elapsed <= 0) return save;

  // 离线水量恢复补偿
  if (save.currency.water < MAX_WATER) {
    const regenTicks = Math.floor(elapsed / WATER_REGEN_INTERVAL_MS);
    if (regenTicks > 0) {
      save.currency = {
        ...save.currency,
        water: Math.min(save.currency.water + regenTicks * WATER_REGEN_AMOUNT, MAX_WATER),
      };
    }
  }

  // 花盆冷却 / 生长计时器是基于时间戳的，useCooldown 会自动在首次 tick 处理
  // 无需额外补偿

  return save;
})();

export const useGameState = () => {
  // 1. 特效队列（无依赖，最先初始化）
  const { effects, pushEffect, removeEffect } = useEffects();

  // 2. 货币系统
  const {
    currency,
    noWaterWarning,
    maxWater,
    waterRegenCountdown,
    spendWater,
    spendCoins,
    addCoins,
  } = useCurrency(initialSave?.currency);

  // 3. 仓库
  const { inventory, addFlower, removeFlowers, removeAnyFlowers } = useInventory(initialSave?.inventory);

  // 4. 花卉之魂（依赖 pushEffect）
  const { flowerSouls, tryDropSoul, spendSouls } = useFlowerSouls(pushEffect, initialSave?.flowerSouls);

  // 5. 花朵等级（依赖 spendCoins + spendSouls + pushEffect）
  const { flowerLevels, upgradeFlower, canUpgradeFlower } = useFlowerLevels(
    spendCoins,
    spendSouls,
    pushEffect,
    initialSave?.flowerLevels
  );

  // 6. 玩家等级（依赖 pushEffect）
  const { playerLevel, addXP } = usePlayerLevel(pushEffect, initialSave?.playerLevel);

  // 7. 花盆操作（依赖 flowerLevels + spendWater + addFlower + pushEffect + addXP + tryDropSoul）
  const { pots, setPots, plantSeed, waterPot, harvestPot, gridCols, gridRows } = usePots(
    flowerLevels,
    spendWater,
    addFlower,
    pushEffect,
    addXP,
    tryDropSoul,
    initialSave?.pots
  );

  // 7.5 花盆解锁（依赖 playerLevel + spendCoins）
  const {
    unlockedPotIdsArray,
    isPotUnlocked,
    getPotLockInfo,
    buyPot,
    visibleRows,
  } = usePotUnlock(playerLevel.level, spendCoins, initialSave?.unlockedPotIds);

  // 8. 成就系统（依赖 pots + flowerLevels + playerLevel + addCoins + isPotUnlocked；需先于 Picker 以便传入 tracked 回调）
  const {
    achievements,
    toasts: achievementToasts,
    dismissToast: dismissAchievementToast,
    claimReward: claimAchievement,
    recordPlant,
    recordHarvest,
    recordCoinsEarned,
    recordOrderCompleted,
    setAtmosphere: setAchievementAtmosphere,
    achievementUnlockedFlowers,
  } = useAchievements(pots, flowerLevels, playerLevel, addCoins, isPotUnlocked);

  // 包装 plantSeed — 追踪播种成就
  const plantSeedTracked = useCallback(
    (potId: number, flowerType: import('../types').FlowerType) => {
      const pot = pots.find(p => p.id === potId);
      if (pot && pot.state === 'empty') recordPlant();
      plantSeed(potId, flowerType);
    },
    [pots, plantSeed, recordPlant]
  );

  // 包装 harvestPot — 追踪收获成就
  const harvestPotTracked = useCallback(
    (potId: number) => {
      const pot = pots.find(p => p.id === potId);
      if (pot && pot.state === 'blooming') recordHarvest();
      harvestPot(potId);
    },
    [pots, harvestPot, recordHarvest]
  );

  // 9. Picker 面板（使用 tracked 回调以便追踪成就）
  const {
    showFlowerPicker,
    showWaterPicker,
    showHarvestPicker,
    handleFlowerSelect,
    handlePotClick,
    handleWaterFromPicker,
    harvestFromPicker,
    closeFlowerPicker,
    closeWaterPicker,
    closeHarvestPicker,
    batchPlantAll,
    batchWaterAll,
    batchHarvestAll,
  } = usePickers(pots, plantSeedTracked, waterPot, harvestPotTracked, isPotUnlocked);

  // 10. 随机收购订单（依赖 removeFlowers + addCoins + pushEffect）
  const { buyOrders, acceptBuyOrder, dismissBuyOrder, canFulfillOrder, hasAnyFulfillable } = useBuyOrders(
    removeFlowers,
    addCoins,
    pushEffect
  );

  // 包装 acceptBuyOrder — 追踪订单成就 + 金币统计
  const acceptBuyOrderTracked = useCallback(
    (orderId: number): boolean => {
      const order = buyOrders.find(o => o.id === orderId);
      const success = acceptBuyOrder(orderId);
      if (success && order) {
        recordOrderCompleted();
        recordCoinsEarned(order.totalPrice);
      }
      return success;
    },
    [buyOrders, acceptBuyOrder, recordOrderCompleted, recordCoinsEarned]
  );

  /** 是否有可完成的收购订单（用于红点提示） */
  const hasAnyFulfillableBuyOrder = hasAnyFulfillable(inventory);

  // 11. 采购任务（依赖 inventory + currency + 扣减函数 + pushEffect + addXP）
  const {
    tasks: purchaseTasks,
    canCompleteTask,
    completePurchaseTask,
    isTaskOnCooldown,
    getTaskCooldownRemaining,
    refreshTasks,
  } = usePurchaseTasks(
    inventory,
    currency,
    spendCoins,
    addCoins,
    removeAnyFlowers,
    removeFlowers,
    pushEffect,
    addXP
  );

  // 12. 花盆皮肤（依赖 spendCoins）
  const { activeSkin, unlockedSkins, getSkinImage, selectSkin, unlockSkin, isSkinUnlocked } = usePotSkins(
    spendCoins,
    initialSave?.activeSkin,
    initialSave?.unlockedSkins
  );

  // 13. 自动存档系统
  const { saveNow } = useSaveGame(
    currency,
    inventory,
    flowerLevels,
    flowerSouls,
    playerLevel,
    pots,
    activeSkin,
    unlockedSkins,
    unlockedPotIdsArray
  );

  /** 清除存档并刷新页面 */
  const resetGame = useCallback(() => {
    clearSave();
    window.location.reload();
  }, []);

  /** 存档信息（用于显示） */
  const saveInfo = useMemo(() => ({
    hasSave: !!initialSave,
    savedAt: initialSave?.savedAt ?? null,
  }), []);

  return {
    // 花盆
    pots,
    setPots,
    gridCols,
    gridRows,
    plantSeed: plantSeedTracked,
    waterPot,
    harvestPot: harvestPotTracked,

    // Picker
    showFlowerPicker,
    showWaterPicker,
    showHarvestPicker,
    handleFlowerSelect,
    handlePotClick,
    handleWaterFromPicker,
    harvestFromPicker,
    closeFlowerPicker,
    closeWaterPicker,
    closeHarvestPicker,
    batchPlantAll,
    batchWaterAll,
    batchHarvestAll,

    // 仓库
    inventory,

    // 货币
    currency,
    noWaterWarning,
    maxWater,
    waterRegenCountdown,

    // 花朵等级
    flowerLevels,
    upgradeFlower,
    canUpgradeFlower,

    // 花卉之魂
    flowerSouls,

    // 玩家等级
    playerLevel,

    // 特效
    effects,
    removeEffect,

    // 采购任务
    purchaseTasks,
    canCompleteTask,
    completePurchaseTask,
    isTaskOnCooldown,
    getTaskCooldownRemaining,
    refreshTasks,

    // 收购订单
    buyOrders,
    acceptBuyOrder: acceptBuyOrderTracked,
    dismissBuyOrder,
    canFulfillOrder,
    hasAnyFulfillableBuyOrder,

    // 花盆皮肤
    activeSkin,
    getSkinImage,
    selectSkin,
    unlockSkin,
    isSkinUnlocked,

    // 花盆解锁
    isPotUnlocked,
    getPotLockInfo,
    buyPot,
    visibleRows,

    // 成就
    achievements,
    achievementToasts,
    dismissAchievementToast,
    claimAchievement,
    setAchievementAtmosphere,
    achievementUnlockedFlowers,

    // 存档
    saveNow,
    resetGame,
    saveInfo,
  };
};
