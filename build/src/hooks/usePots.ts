/**
 * 花盆操作 Hook
 * 管理花盆状态 + plantSeed / waterPot / harvestPot
 */
import { useState, useCallback } from 'react';
import { PotData, FlowerType, FlowerLevels, EffectState } from '../types';
import { GRID_COLS, GRID_ROWS, getLevelConfig, XP_PER_HARVEST } from '../config';

const createInitialPots = (): PotData[] => {
  const pots: PotData[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      pots.push({ id: row * GRID_COLS + col, row, col, state: 'empty' });
    }
  }
  return pots;
};

export const usePots = (
  flowerLevels: FlowerLevels,
  spendWater: (amount?: number) => boolean,
  addFlower: (flowerType: FlowerType, count?: number) => void,
  pushEffect: (e: Omit<EffectState, 'id'>) => void,
  addXP: (amount: number) => void,
  tryDropSoul: (flowerType: FlowerType) => boolean
) => {
  const [pots, setPots] = useState<PotData[]>(createInitialPots);

  const plantSeed = useCallback(
    (potId: number, flowerType: FlowerType) => {
      const level = flowerLevels[flowerType] || 1;
      const levelConfig = getLevelConfig(level);

      setPots(prev =>
        prev.map(pot =>
          pot.id === potId && pot.state === 'empty'
            ? {
                ...pot,
                state: 'seeded' as const,
                flowerType,
                harvestsRemaining: levelConfig.maxHarvests,
              }
            : pot
        )
      );
      pushEffect({ type: 'seed', potId, flowerType });
    },
    [flowerLevels, pushEffect]
  );

  const waterPot = useCallback(
    (potId: number): boolean => {
      if (!spendWater()) return false;

      setPots(prev =>
        prev.map(pot =>
          pot.id === potId && (pot.state === 'seeded' || pot.state === 'growing')
            ? { ...pot, state: 'blooming' as const }
            : pot
        )
      );
      pushEffect({ type: 'water', potId });
      return true;
    },
    [spendWater, pushEffect]
  );

  const harvestPot = useCallback(
    (potId: number) => {
      const pot = pots.find(p => p.id === potId);
      if (!pot || pot.state !== 'blooming' || !pot.flowerType) return;

      const flowerType = pot.flowerType;
      const remaining = (pot.harvestsRemaining ?? 1) - 1;
      const level = flowerLevels[flowerType] || 1;
      const levelConfig = getLevelConfig(level);

      setPots(prev =>
        prev.map(p => {
          if (p.id !== potId) return p;
          if (remaining > 0 && levelConfig.cooldownSeconds > 0) {
            return {
              ...p,
              state: 'cooling' as const,
              harvestsRemaining: remaining,
              cooldownUntil: Date.now() + levelConfig.cooldownSeconds * 1000,
            };
          }
          return {
            ...p,
            state: 'empty' as const,
            flowerType: undefined,
            harvestsRemaining: undefined,
            cooldownUntil: undefined,
          };
        })
      );

      // 根据等级产量添加花朵
      const yield_ = levelConfig.yieldPerHarvest;
      addFlower(flowerType, yield_);
      pushEffect({ type: 'harvest', flowerType, potId });

      // 收割赚取经验值
      addXP(XP_PER_HARVEST);

      // 尝试掉落花卉之魂
      tryDropSoul(flowerType);
    },
    [pots, flowerLevels, addFlower, pushEffect, addXP, tryDropSoul]
  );

  return {
    pots,
    setPots,
    plantSeed,
    waterPot,
    harvestPot,
    gridCols: GRID_COLS,
    gridRows: GRID_ROWS,
  };
};
