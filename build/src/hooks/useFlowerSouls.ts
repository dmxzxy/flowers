/**
 * 花卉之魂 Hook
 * 管理每种花的花卉之魂数量
 * 收割花卉时有概率掉落，用于花朵升级
 */
import { useState, useCallback, useRef } from 'react';
import { FlowerType, FlowerSouls, EffectState } from '../types';
import { ALL_FLOWERS, SOUL_DROP_CHANCE } from '../config';

const createInitialSouls = (): FlowerSouls =>
  Object.fromEntries(ALL_FLOWERS.map(f => [f, 0])) as FlowerSouls;

export const useFlowerSouls = (
  pushEffect: (e: Omit<EffectState, 'id'>) => void
) => {
  const [flowerSouls, setFlowerSouls] = useState<FlowerSouls>(createInitialSouls);
  const soulsRef = useRef<FlowerSouls>(createInitialSouls());

  const updateSouls = useCallback((fn: (prev: FlowerSouls) => FlowerSouls) => {
    setFlowerSouls(prev => {
      const next = fn(prev);
      soulsRef.current = next;
      return next;
    });
  }, []);

  /** 尝试掉落花卉之魂（收割时调用）。返回是否掉落成功 */
  const tryDropSoul = useCallback(
    (flowerType: FlowerType): boolean => {
      if (Math.random() >= SOUL_DROP_CHANCE) return false;

      soulsRef.current = {
        ...soulsRef.current,
        [flowerType]: (soulsRef.current[flowerType] || 0) + 1,
      };
      updateSouls(() => soulsRef.current);
      pushEffect({ type: 'souldrop', soulFlowerType: flowerType });
      return true;
    },
    [pushEffect, updateSouls]
  );

  /** 同步消耗花卉之魂（升级时调用） */
  const spendSouls = useCallback(
    (flowerType: FlowerType, amount: number): boolean => {
      if ((soulsRef.current[flowerType] || 0) < amount) return false;
      soulsRef.current = {
        ...soulsRef.current,
        [flowerType]: soulsRef.current[flowerType] - amount,
      };
      updateSouls(() => soulsRef.current);
      return true;
    },
    [updateSouls]
  );

  return { flowerSouls, tryDropSoul, spendSouls };
};
