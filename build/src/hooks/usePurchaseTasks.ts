/**
 * 采购任务 Hook
 * 支持冷却时间，奖励金币+经验（无水滴）
 */
import { useState, useCallback } from 'react';
import { FlowerType, Inventory, Currency } from '../types';
import { purchaseTasks, generatePurchaseTasks } from '../config';

export const usePurchaseTasks = (
  inventory: Inventory,
  _currency: Currency,
  _spendCoins: (amount: number) => boolean,
  addCoins: (amount: number) => void,
  _removeAnyFlowers: (amount: number) => boolean,
  removeFlowers: (flowers: Partial<Record<FlowerType, number>>) => boolean,
  pushEffect: (e: { type: 'task'; taskRewardCoins?: number; taskRewardWater?: number }) => void,
  addXP: (amount: number) => void
) => {
  // 每个任务的冷却到期时间
  const [taskCooldowns, setTaskCooldowns] = useState<Record<string, number>>({});
  // 当前任务列表（可刷新）
  const [tasks, setTasks] = useState(purchaseTasks);

  const isTaskOnCooldown = useCallback(
    (taskId: string): boolean => {
      const until = taskCooldowns[taskId];
      return !!until && Date.now() < until;
    },
    [taskCooldowns]
  );

  const getTaskCooldownRemaining = useCallback(
    (taskId: string): number => {
      const until = taskCooldowns[taskId];
      if (!until) return 0;
      return Math.max(0, until - Date.now());
    },
    [taskCooldowns]
  );

  const canCompleteTask = useCallback(
    (taskId: string): boolean => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;
      if (isTaskOnCooldown(taskId)) return false;
      if (task.costFlowers) {
        for (const [flower, count] of Object.entries(task.costFlowers)) {
          if ((inventory.flowers[flower as FlowerType] || 0) < (count || 0)) return false;
        }
      }
      return true;
    },
    [tasks, inventory, isTaskOnCooldown]
  );

  const completePurchaseTask = useCallback(
    (taskId: string): boolean => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;
      if (isTaskOnCooldown(taskId)) return false;

      // 扣指定花朵
      if (task.costFlowers) {
        if (!removeFlowers(task.costFlowers)) return false;
      }

      // 发放金币奖励
      if (task.rewardCoins) addCoins(task.rewardCoins);

      // 发放经验奖励
      if (task.rewardXp) addXP(task.rewardXp);

      // 设置冷却
      if (task.cooldownMs > 0) {
        setTaskCooldowns(prev => ({
          ...prev,
          [taskId]: Date.now() + task.cooldownMs,
        }));
      }

      pushEffect({
        type: 'task',
        taskRewardCoins: task.rewardCoins,
      });
      return true;
    },
    [tasks, isTaskOnCooldown, removeFlowers, addCoins, addXP, pushEffect]
  );

  /** 刷新采购任务列表 */
  const refreshTasks = useCallback(() => {
    setTasks(generatePurchaseTasks());
    setTaskCooldowns({});
  }, []);

  return {
    tasks,
    canCompleteTask,
    completePurchaseTask,
    isTaskOnCooldown,
    getTaskCooldownRemaining,
    refreshTasks,
  };
};
