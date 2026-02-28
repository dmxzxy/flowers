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
import { loadSave, clearSave, useSaveGame, SaveData } from './useSaveGame';

// 启动时读一次存档
const initialSave: SaveData | null = loadSave();

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

  // 8. Picker 面板（依赖 pots + 操作函数）
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
  } = usePickers(pots, plantSeed, waterPot, harvestPot);

  // 9. 随机收购订单（依赖 removeFlowers + addCoins + pushEffect）
  const { buyOrders, acceptBuyOrder, dismissBuyOrder } = useBuyOrders(
    removeFlowers,
    addCoins,
    pushEffect
  );

  // 10. 采购任务（依赖 inventory + currency + 扣减函数 + pushEffect + addXP）
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

  // 11. 花盆皮肤（依赖 spendCoins）
  const { activeSkin, unlockedSkins, getSkinImage, selectSkin, unlockSkin, isSkinUnlocked } = usePotSkins(
    spendCoins,
    initialSave?.activeSkin,
    initialSave?.unlockedSkins
  );

  // 12. 自动存档系统
  const { saveNow } = useSaveGame(
    currency,
    inventory,
    flowerLevels,
    flowerSouls,
    playerLevel,
    pots,
    activeSkin,
    unlockedSkins
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
    plantSeed,
    waterPot,
    harvestPot,

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
    acceptBuyOrder,
    dismissBuyOrder,

    // 花盆皮肤
    activeSkin,
    getSkinImage,
    selectSkin,
    unlockSkin,
    isSkinUnlocked,

    // 存档
    saveNow,
    resetGame,
    saveInfo,
  };
};
