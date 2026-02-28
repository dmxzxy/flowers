/**
 * 采购任务 Hook
 */
import { useCallback } from 'react';
import { FlowerType, Inventory, Currency } from '../types';
import { purchaseTasks } from '../config';

export const usePurchaseTasks = (
  inventory: Inventory,
  currency: Currency,
  spendCoins: (amount: number) => boolean,
  addRewards: (coins: number, water: number) => void,
  removeAnyFlowers: (amount: number) => boolean,
  removeFlowers: (flowers: Partial<Record<FlowerType, number>>) => boolean,
  pushEffect: (e: { type: 'task'; taskRewardCoins?: number; taskRewardWater?: number }) => void
) => {
  const canCompleteTask = useCallback(
    (taskId: string): boolean => {
      const task = purchaseTasks.find(t => t.id === taskId);
      if (!task) return false;
      if (task.costCoins && currency.coins < task.costCoins) return false;
      if (task.costAnyFlowers && inventory.total < task.costAnyFlowers) return false;
      if (task.costFlowers) {
        for (const [flower, count] of Object.entries(task.costFlowers)) {
          if ((inventory.flowers[flower as FlowerType] || 0) < (count || 0)) return false;
        }
      }
      return true;
    },
    [currency, inventory]
  );

  const completePurchaseTask = useCallback(
    (taskId: string): boolean => {
      const task = purchaseTasks.find(t => t.id === taskId);
      if (!task) return false;

      // 扣金币
      if (task.costCoins) {
        if (!spendCoins(task.costCoins)) return false;
      }

      // 扣任意花朵
      if (task.costAnyFlowers) {
        removeAnyFlowers(task.costAnyFlowers);
      }

      // 扣指定花朵
      if (task.costFlowers) {
        removeFlowers(task.costFlowers);
      }

      // 发放奖励
      if (task.rewardCoins || task.rewardWater) {
        addRewards(task.rewardCoins || 0, task.rewardWater || 0);
      }

      pushEffect({
        type: 'task',
        taskRewardCoins: task.rewardCoins,
        taskRewardWater: task.rewardWater,
      });
      return true;
    },
    [spendCoins, addRewards, removeAnyFlowers, removeFlowers, pushEffect]
  );

  return { canCompleteTask, completePurchaseTask };
};
