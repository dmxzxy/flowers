/**
 * 采购任务配置
 * 随机生成 5 个采购任务，每个需求 1~3 种花朵，每种 1~4 朵
 * 奖励根据所需花朵的基础售价来计算
 */
import { PurchaseTask, FlowerType } from '../types';
import {
  PURCHASE_TASK_COUNT,
  TASK_FLOWER_TYPES_RANGE,
  TASK_FLOWER_AMOUNT_RANGE,
  TASK_REWARD_COIN_MULTIPLIER,
  TASK_REWARD_XP_MULTIPLIER,
  TASK_COOLDOWN_MS,
  ALL_FLOWERS,
  flowers as flowerConfigs,
  getFlowerPrice,
} from './flower.config';

const TASK_NAMES = ['花束订单', '花艺委托', '鲜花配送', '节庆花篮', '花园装饰'];

/** 随机整数 [min, max] */
const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/** 从数组随机取 n 个不重复元素 */
const pickRandom = <T>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

export const generatePurchaseTasks = (): PurchaseTask[] => {
  const tasks: PurchaseTask[] = [];

  for (let i = 0; i < PURCHASE_TASK_COUNT; i++) {
    const [minTypes, maxTypes] = TASK_FLOWER_TYPES_RANGE;
    const [minAmt, maxAmt] = TASK_FLOWER_AMOUNT_RANGE;
    const typeCount = randInt(minTypes, maxTypes);
    const selectedFlowers = pickRandom(ALL_FLOWERS, typeCount);

    const costFlowers: Partial<Record<FlowerType, number>> = {};
    let totalValue = 0;

    for (const ft of selectedFlowers) {
      const amount = randInt(minAmt, maxAmt);
      costFlowers[ft] = amount;
      totalValue += getFlowerPrice(ft) * amount;
    }

    // 构建描述
    const descParts = selectedFlowers.map(ft => {
      const cfg = flowerConfigs.find(f => f.id === ft);
      return `${cfg?.name || ft}×${costFlowers[ft]}`;
    });

    const rewardCoins = Math.round(totalValue * TASK_REWARD_COIN_MULTIPLIER);
    const rewardXp = Math.max(1, Math.round(totalValue * TASK_REWARD_XP_MULTIPLIER));

    tasks.push({
      id: `task_${i}`,
      name: TASK_NAMES[i % TASK_NAMES.length],
      description: descParts.join(' + '),
      costFlowers,
      rewardCoins,
      rewardXp,
      cooldownMs: TASK_COOLDOWN_MS,
    });
  }

  return tasks;
};

/** 预生成的采购任务列表 */
export const purchaseTasks: PurchaseTask[] = generatePurchaseTasks();
