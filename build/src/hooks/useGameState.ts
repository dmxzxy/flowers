/**
 * 游戏主状态 Hook — 胶水层
 * 组合所有子 hooks，返回统一 API
 *
 * 重构后职责：仅做子 hook 的组装和依赖注入，不含业务逻辑
 */
import { useEffects } from './useEffects';
import { useCurrency } from './useCurrency';
import { useInventory } from './useInventory';
import { useFlowerLevels } from './useFlowerLevels';
import { usePots } from './usePots';
import { usePickers } from './usePickers';
import { useBuyOrder } from './useBuyOrder';
import { usePurchaseTasks } from './usePurchaseTasks';

export const useGameState = () => {
  // 1. 特效队列（无依赖，最先初始化）
  const { effects, pushEffect, removeEffect } = useEffects();

  // 2. 货币系统
  const {
    currency,
    noWaterWarning,
    maxWater,
    spendWater,
    spendCoins,
    addCoins,
    addRewards,
  } = useCurrency();

  // 3. 仓库
  const { inventory, addFlower, removeFlowers, removeAnyFlowers } = useInventory();

  // 4. 花朵等级（依赖 spendCoins + pushEffect）
  const { flowerLevels, upgradeFlower } = useFlowerLevels(spendCoins, pushEffect);

  // 5. 花盆操作（依赖 flowerLevels + spendWater + addFlower + pushEffect）
  const { pots, setPots, plantSeed, waterPot, harvestPot, gridCols, gridRows } = usePots(
    flowerLevels,
    spendWater,
    addFlower,
    pushEffect
  );

  // 6. Picker 面板（依赖 pots + 操作函数）
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

  // 7. 随机收购订单（依赖 removeFlowers + addCoins + pushEffect）
  const { activeBuyOrder, acceptBuyOrder, dismissBuyOrder } = useBuyOrder(
    removeFlowers,
    addCoins,
    pushEffect
  );

  // 8. 采购任务（依赖 inventory + currency + 扣减函数 + pushEffect）
  const { canCompleteTask, completePurchaseTask } = usePurchaseTasks(
    inventory,
    currency,
    spendCoins,
    addRewards,
    removeAnyFlowers,
    removeFlowers,
    pushEffect
  );

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

    // 等级
    flowerLevels,
    upgradeFlower,

    // 特效
    effects,
    removeEffect,

    // 采购任务
    canCompleteTask,
    completePurchaseTask,

    // 收购订单
    activeBuyOrder,
    acceptBuyOrder,
    dismissBuyOrder,
  };
};
