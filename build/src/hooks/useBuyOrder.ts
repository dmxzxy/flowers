/**
 * 随机收购订单 Hook
 * 支持最多 3 个累积订单，可包含多种花卉
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { BuyOrder, FlowerType, Inventory } from '../types';
import {
  ALL_FLOWERS,
  flowers as flowerConfigs,
  getFlowerPrice,
  BUY_ORDER_INTERVAL_MS,
  BUY_ORDER_DURATION_MS,
  BUY_ORDER_FIRST_DELAY_MS,
  BUY_ORDER_AMOUNT_RANGE,
  BUY_ORDER_PRICE_MULTIPLIER,
  BUY_ORDER_MAX_SLOTS,
} from '../config';

/** 随机整数 [min, max] */
const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const randFloat = (min: number, max: number) => min + Math.random() * (max - min);

/** 从数组随机取 n 个不重复元素 */
const pickRandom = <T,>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
};

export const useBuyOrders = (
  removeFlowersFromInventory: (flowers: Partial<Record<FlowerType, number>>) => boolean,
  addCoins: (amount: number) => void,
  pushEffect: (e: { type: 'task'; taskRewardCoins?: number }) => void
) => {
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const buyOrderIdRef = useRef(0);

  const generateBuyOrder = useCallback((): BuyOrder => {
    // 决定本次订单包含几种花：60% 一种，30% 两种，10% 三种
    const roll = Math.random();
    const typeCount = roll < 0.6 ? 1 : roll < 0.9 ? 2 : 3;

    const selectedFlowers = pickRandom(ALL_FLOWERS, typeCount);
    const [minAmt, maxAmt] = BUY_ORDER_AMOUNT_RANGE;
    const [minMul, maxMul] = BUY_ORDER_PRICE_MULTIPLIER;

    const costFlowers: Partial<Record<FlowerType, number>> = {};
    let totalPrice = 0;
    const descParts: string[] = [];

    for (const ft of selectedFlowers) {
      // 多花种时每种数量适当减少
      const adjMin = typeCount === 1 ? minAmt : Math.max(1, minAmt - 1);
      const adjMax = typeCount === 1 ? maxAmt : Math.max(2, Math.ceil(maxAmt / typeCount));
      const amount = randInt(adjMin, adjMax);
      costFlowers[ft] = amount;

      const basePrice = getFlowerPrice(ft);
      const multiplier = randFloat(minMul, maxMul);
      totalPrice += amount * Math.round(basePrice * multiplier);

      const cfg = flowerConfigs.find(f => f.id === ft);
      descParts.push(`${cfg?.name ?? ft}×${amount}`);
    }

    return {
      id: ++buyOrderIdRef.current,
      costFlowers,
      description: descParts.join(' + '),
      totalPrice: Math.round(totalPrice),
      expiresAt: Date.now() + BUY_ORDER_DURATION_MS,
    };
  }, []);

  // 定时生成（不超过最大槽位数）
  useEffect(() => {
    const tryAdd = () => {
      setBuyOrders(prev => {
        if (prev.length >= BUY_ORDER_MAX_SLOTS) return prev;
        return [...prev, generateBuyOrder()];
      });
    };

    const firstTimer = setTimeout(tryAdd, BUY_ORDER_FIRST_DELAY_MS);
    const interval = setInterval(tryAdd, BUY_ORDER_INTERVAL_MS);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [generateBuyOrder]);

  // 过期自动清除
  useEffect(() => {
    if (buyOrders.length === 0) return;
    const nearestExpiry = Math.min(...buyOrders.map(o => o.expiresAt));
    const remaining = nearestExpiry - Date.now();
    if (remaining <= 0) {
      setBuyOrders(prev => prev.filter(o => o.expiresAt > Date.now()));
      return;
    }
    const timer = setTimeout(() => {
      setBuyOrders(prev => prev.filter(o => o.expiresAt > Date.now()));
    }, remaining + 100);
    return () => clearTimeout(timer);
  }, [buyOrders]);

  const acceptBuyOrder = useCallback((orderId: number): boolean => {
    const order = buyOrders.find(o => o.id === orderId);
    if (!order) return false;

    const success = removeFlowersFromInventory(order.costFlowers);
    if (!success) return false;

    addCoins(order.totalPrice);
    pushEffect({ type: 'task', taskRewardCoins: order.totalPrice });
    setBuyOrders(prev => prev.filter(o => o.id !== orderId));
    return true;
  }, [buyOrders, removeFlowersFromInventory, addCoins, pushEffect]);

  const dismissBuyOrder = useCallback((orderId: number) => {
    setBuyOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  /** 检查某个订单是否可完成 */
  const canFulfillOrder = useCallback((order: BuyOrder, inventory: Inventory): boolean => {
    for (const [ft, need] of Object.entries(order.costFlowers)) {
      if ((inventory.flowers[ft as FlowerType] || 0) < (need || 0)) return false;
    }
    return true;
  }, []);

  /** 是否有任意一个订单可完成 */
  const hasAnyFulfillable = useCallback((inventory: Inventory): boolean => {
    return buyOrders.some(o => canFulfillOrder(o, inventory));
  }, [buyOrders, canFulfillOrder]);

  return { buyOrders, acceptBuyOrder, dismissBuyOrder, canFulfillOrder, hasAnyFulfillable };
};
