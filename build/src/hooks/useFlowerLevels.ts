/**
 * 花朵等级 Hook
 * 管理每种花的等级 + 升级逻辑
 */
import { useState, useCallback } from 'react';
import { FlowerType, FlowerLevels } from '../types';
import { ALL_FLOWERS, MAX_FLOWER_LEVEL, getLevelConfig } from '../config';

const createInitialFlowerLevels = (): FlowerLevels =>
  Object.fromEntries(ALL_FLOWERS.map(f => [f, 1])) as FlowerLevels;

export const useFlowerLevels = (
  spendCoins: (amount: number) => boolean,
  pushEffect: (e: { type: 'levelup'; flowerType: FlowerType }) => void
) => {
  const [flowerLevels, setFlowerLevels] = useState<FlowerLevels>(createInitialFlowerLevels);

  const upgradeFlower = useCallback(
    (flowerType: FlowerType): boolean => {
      const currentLevel = flowerLevels[flowerType] || 1;
      if (currentLevel >= MAX_FLOWER_LEVEL) return false;

      const levelConfig = getLevelConfig(currentLevel);
      const cost = levelConfig.upgradeCostCoins;

      if (!spendCoins(cost)) return false;

      setFlowerLevels(prev => ({ ...prev, [flowerType]: currentLevel + 1 }));
      pushEffect({ type: 'levelup', flowerType });
      return true;
    },
    [flowerLevels, spendCoins, pushEffect]
  );

  return { flowerLevels, upgradeFlower };
};
