/**
 * 随机收购订单 Hook
 * 支持最多 3 个累积订单，采购量更大，收获更多
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { BuyOrder, FlowerType } from '../types';
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

export const useBuyOrders = (
  removeFlowersFromInventory: (flowers: Partial<Record<FlowerType, number>>) => boolean,
  addCoins: (amount: number) => void,
  pushEffect: (e: { type: 'task'; taskRewardCoins?: number }) => void
) => {
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const buyOrderIdRef = useRef(0);

  const generateBuyOrder = useCallback((): BuyOrder => {
    const idx = Math.floor(Math.random() * ALL_FLOWERS.length);
    const flowerType = ALL_FLOWERS[idx];
    const cfg = flowerConfigs.find(f => f.id === flowerType)!;
    const [minAmt, maxAmt] = BUY_ORDER_AMOUNT_RANGE;
    const amount = randInt(minAmt, maxAmt);
    const basePrice = getFlowerPrice(flowerType);
    const [minMul, maxMul] = BUY_ORDER_PRICE_MULTIPLIER;
    const multiplier = randFloat(minMul, maxMul);
    const pricePerFlower = Math.round(basePrice * multiplier);
    return {
      id: ++buyOrderIdRef.current,
      flowerType,
      flowerName: cfg.name,
      amount,
      pricePerFlower,
      totalPrice: amount * pricePerFlower,
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
    const { flowerType, amount, totalPrice } = order;

    const success = removeFlowersFromInventory({ [flowerType]: amount });
    if (!success) return false;

    addCoins(totalPrice);
    pushEffect({ type: 'task', taskRewardCoins: totalPrice });
    setBuyOrders(prev => prev.filter(o => o.id !== orderId));
    return true;
  }, [buyOrders, removeFlowersFromInventory, addCoins, pushEffect]);

  const dismissBuyOrder = useCallback((orderId: number) => {
    setBuyOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  return { buyOrders, acceptBuyOrder, dismissBuyOrder };
};
