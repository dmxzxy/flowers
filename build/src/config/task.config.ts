/**
 * 采购任务配置
 * 从 data/tasks.ts 迁移，纯数据无逻辑
 */
import { PurchaseTask } from '../types';

export const purchaseTasks: PurchaseTask[] = [
  {
    id: 'retail_order',
    name: '零售订单',
    description: '出售 5 朵任意花朵换取水',
    costAnyFlowers: 5,
    rewardWater: 8,
  },
  {
    id: 'water_supply',
    name: '水资源补给',
    description: '花费 30 金币购买水',
    costCoins: 30,
    rewardWater: 15,
  },
  {
    id: 'festival_bouquet',
    name: '节日花束',
    description: '3 玫瑰 + 3 郁金香 换取金币',
    costFlowers: { rose: 3, tulip: 3 },
    rewardCoins: 60,
    rewardWater: 2,
  },
  {
    id: 'garden_party',
    name: '花园派对',
    description: '2 雏菊 + 2 向日葵 + 2 薰衣草',
    costFlowers: { daisy: 2, sunflower: 2, lavender: 2 },
    rewardCoins: 80,
  },
  {
    id: 'luxury_arrangement',
    name: '豪华花艺',
    description: '2 兰花 + 2 牡丹 + 2 康乃馨',
    costFlowers: { orchid: 2, peony: 2, carnation: 2 },
    rewardCoins: 100,
    rewardWater: 3,
  },
  {
    id: 'flower_exhibition',
    name: '花卉展览',
    description: '每种花各 1 朵，大奖励',
    costFlowers: {
      rose: 1, tulip: 1, daisy: 1, sunflower: 1, lavender: 1,
      orchid: 1, peony: 1, carnation: 1, chrysanthemum: 1, hibiscus: 1,
    },
    rewardCoins: 200,
    rewardWater: 5,
  },
];
