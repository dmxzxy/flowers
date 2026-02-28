/**
 * 花朵等级 Hook
 * 管理每种花的等级 + 升级逻辑
 * 升级消耗花卉之魂 + 金币
 */
import { useState, useCallback } from 'react';
import { FlowerType, FlowerLevels } from '../types';
import { ALL_FLOWERS, MAX_FLOWER_LEVEL, getLevelConfig } from '../config';

const createInitialFlowerLevels = (): FlowerLevels =>
  Object.fromEntries(ALL_FLOWERS.map(f => [f, 1])) as FlowerLevels;

export const useFlowerLevels = (
  spendCoins: (amount: number) => boolean,
  spendSouls: (flowerType: FlowerType, amount: number) => boolean,
  pushEffect: (e: { type: 'levelup'; flowerType: FlowerType }) => void,
  savedLevels?: FlowerLevels
) => {
  const [flowerLevels, setFlowerLevels] = useState<FlowerLevels>(savedLevels ?? createInitialFlowerLevels);

  const upgradeFlower = useCallback(
    (flowerType: FlowerType, currentCoins: number, currentSouls: number): boolean => {
      const currentLevel = flowerLevels[flowerType] || 1;
      if (currentLevel >= MAX_FLOWER_LEVEL) return false;

      const levelConfig = getLevelConfig(currentLevel);
      const coinCost = levelConfig.upgradeCostCoins;
      const soulCost = levelConfig.upgradeCostSouls;

      // 预检查资源是否足够
      if (currentCoins < coinCost || currentSouls < soulCost) return false;

      // 扣除花卉之魂
      if (!spendSouls(flowerType, soulCost)) return false;
      // 扣除金币
      if (!spendCoins(coinCost)) return false;

      setFlowerLevels(prev => ({ ...prev, [flowerType]: currentLevel + 1 }));
      pushEffect({ type: 'levelup', flowerType });
      return true;
    },
    [flowerLevels, spendCoins, spendSouls, pushEffect]
  );

  /** 检查是否有足够资源升级（UI展示用） */
  const canUpgradeFlower = useCallback(
    (flowerType: FlowerType, coins: number, souls: number): boolean => {
      const currentLevel = flowerLevels[flowerType] || 1;
      if (currentLevel >= MAX_FLOWER_LEVEL) return false;
      const levelConfig = getLevelConfig(currentLevel);
      return coins >= levelConfig.upgradeCostCoins && souls >= levelConfig.upgradeCostSouls;
    },
    [flowerLevels]
  );

  return { flowerLevels, upgradeFlower, canUpgradeFlower };
};
