/**
 * 仓库 Hook
 * 管理花朵库存
 */
import { useState, useCallback } from 'react';
import { Inventory, FlowerType } from '../types';
import { ALL_FLOWERS } from '../config';

const createInitialInventory = (): Inventory => ({
  flowers: Object.fromEntries(ALL_FLOWERS.map(f => [f, 0])) as Record<FlowerType, number>,
  total: 0,
});

export const useInventory = () => {
  const [inventory, setInventory] = useState<Inventory>(createInitialInventory);

  /** 添加一朵指定花 */
  const addFlower = useCallback((flowerType: FlowerType, count: number = 1) => {
    setInventory(prev => ({
      flowers: { ...prev.flowers, [flowerType]: prev.flowers[flowerType] + count },
      total: prev.total + count,
    }));
  }, []);

  /** 尝试扣除指定花朵，返回是否成功 */
  const removeFlowers = useCallback(
    (flowers: Partial<Record<FlowerType, number>>): boolean => {
      let success = false;
      setInventory(prev => {
        const newFlowers = { ...prev.flowers };
        let totalDeducted = 0;
        for (const [flower, count] of Object.entries(flowers)) {
          const fType = flower as FlowerType;
          const c = count || 0;
          if (newFlowers[fType] < c) return prev; // 不够
          newFlowers[fType] -= c;
          totalDeducted += c;
        }
        success = true;
        return { flowers: newFlowers, total: prev.total - totalDeducted };
      });
      return success;
    },
    []
  );

  /** 尝试扣除任意花朵（按 ALL_FLOWERS 顺序），返回是否成功 */
  const removeAnyFlowers = useCallback((amount: number): boolean => {
    let success = false;
    setInventory(prev => {
      if (prev.total < amount) return prev;
      let remaining = amount;
      const newFlowers = { ...prev.flowers };
      for (const fType of ALL_FLOWERS) {
        if (remaining <= 0) break;
        const take = Math.min(newFlowers[fType], remaining);
        newFlowers[fType] -= take;
        remaining -= take;
      }
      success = true;
      return { flowers: newFlowers, total: prev.total - amount };
    });
    return success;
  }, []);

  return { inventory, addFlower, removeFlowers, removeAnyFlowers, setInventory };
};
