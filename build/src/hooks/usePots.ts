/**
 * 花盆操作 Hook
 * 管理花盆状态 + plantSeed / waterPot / harvestPot
 */
import { useState, useCallback } from 'react';
import { PotData, FlowerType, FlowerLevels, EffectState } from '../types';
import { GRID_COLS, GRID_ROWS, getLevelConfig, XP_PER_HARVEST, GROWING_DURATION_MS } from '../config';

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
  tryDropSoul: (flowerType: FlowerType) => boolean,
  savedPots?: PotData[]
) => {
  const [pots, setPots] = useState<PotData[]>(savedPots ?? createInitialPots);

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
            ? {
                ...pot,
                state: 'growing' as const,
                growingUntil: Date.now() + GROWING_DURATION_MS,
              }
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
      // 使用 ref + setPots updater 避免闭包读取到过期 pots 状态
      let harvestedFlower: FlowerType | undefined;
      let harvestedYield = 0;

      setPots(prev => {
        const pot = prev.find(p => p.id === potId);
        if (!pot || pot.state !== 'blooming' || !pot.flowerType) return prev;

        const flowerType = pot.flowerType;
        const remaining = (pot.harvestsRemaining ?? 1) - 1;
        const level = flowerLevels[flowerType] || 1;
        const levelConfig = getLevelConfig(level);

        // 记录收割信息，setPots 结束后再执行副作用
        harvestedFlower = flowerType;
        harvestedYield = levelConfig.yieldPerHarvest;

        return prev.map(p => {
          if (p.id !== potId) return p;
          if (remaining > 0 && levelConfig.cooldownSeconds > 0) {
            const totalMs = levelConfig.cooldownSeconds * 1000;
            return {
              ...p,
              state: 'cooling' as const,
              harvestsRemaining: remaining,
              cooldownUntil: Date.now() + totalMs,
              cooldownTotalMs: totalMs,
            };
          }
          return {
            ...p,
            state: 'empty' as const,
            flowerType: undefined,
            harvestsRemaining: undefined,
            cooldownUntil: undefined,
            cooldownTotalMs: undefined,
          };
        });
      });

      // 副作用：在 setPots updater 之后，根据捕获值执行
      // React 批处理保证这些在同一微任务内顺序执行
      if (harvestedFlower) {
        addFlower(harvestedFlower, harvestedYield);
        pushEffect({ type: 'harvest', flowerType: harvestedFlower, potId });
        addXP(XP_PER_HARVEST);
        tryDropSoul(harvestedFlower);
      }
    },
    [flowerLevels, addFlower, pushEffect, addXP, tryDropSoul]
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
