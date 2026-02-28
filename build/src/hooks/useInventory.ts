/**
 * 仓库 Hook
 * 管理花朵库存
 *
 * 使用 inventoryRef 同步跟踪库存状态，避免 React 18 createRoot
 * 自动批处理导致 setState updater 不被立即执行，从而使同步返回值
 * （如 removeFlowers 返回 boolean）不可靠的问题。
 */
import { useState, useCallback, useRef } from 'react';
import { Inventory, FlowerType } from '../types';
import { ALL_FLOWERS } from '../config';

const createInitialInventory = (): Inventory => ({
  flowers: Object.fromEntries(ALL_FLOWERS.map(f => [f, 0])) as Record<FlowerType, number>,
  total: 0,
});

export const useInventory = (savedInventory?: Inventory) => {
  const [inventory, setInventory] = useState<Inventory>(savedInventory ?? createInitialInventory);
  // 同步 ref 跟踪库存，确保扣除判断始终基于最新值
  const inventoryRef = useRef<Inventory>(savedInventory ? { ...savedInventory, flowers: { ...savedInventory.flowers } } : createInitialInventory());

  /** 添加一朵指定花 */
  const addFlower = useCallback((flowerType: FlowerType, count: number = 1) => {
    const cur = inventoryRef.current;
    const next: Inventory = {
      flowers: { ...cur.flowers, [flowerType]: cur.flowers[flowerType] + count },
      total: cur.total + count,
    };
    inventoryRef.current = next;
    setInventory(next);
  }, []);

  /** 尝试扣除指定花朵，返回是否成功 */
  const removeFlowers = useCallback(
    (flowers: Partial<Record<FlowerType, number>>): boolean => {
      const cur = inventoryRef.current;
      const newFlowers = { ...cur.flowers };
      let totalDeducted = 0;
      for (const [flower, count] of Object.entries(flowers)) {
        const fType = flower as FlowerType;
        const c = count || 0;
        if ((newFlowers[fType] || 0) < c) return false; // 不够
        newFlowers[fType] -= c;
        totalDeducted += c;
      }
      const next: Inventory = { flowers: newFlowers, total: cur.total - totalDeducted };
      inventoryRef.current = next;
      setInventory(next);
      return true;
    },
    []
  );

  /** 尝试扣除任意花朵（按 ALL_FLOWERS 顺序），返回是否成功 */
  const removeAnyFlowers = useCallback((amount: number): boolean => {
    const cur = inventoryRef.current;
    if (cur.total < amount) return false;
    let remaining = amount;
    const newFlowers = { ...cur.flowers };
    for (const fType of ALL_FLOWERS) {
      if (remaining <= 0) break;
      const take = Math.min(newFlowers[fType], remaining);
      newFlowers[fType] -= take;
      remaining -= take;
    }
    const next: Inventory = { flowers: newFlowers, total: cur.total - amount };
    inventoryRef.current = next;
    setInventory(next);
    return true;
  }, []);

  return { inventory, addFlower, removeFlowers, removeAnyFlowers, setInventory };
};
