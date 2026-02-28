/**
 * 随机收购订单 Hook
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { BuyOrder, FlowerType } from '../types';
import {
  ALL_FLOWERS,
  flowers as flowerConfigs,
  BUY_ORDER_INTERVAL_MS,
  BUY_ORDER_DURATION_MS,
  BUY_ORDER_FIRST_DELAY_MS,
  BUY_ORDER_AMOUNT_RANGE,
  BUY_ORDER_PRICE_RANGE,
} from '../config';

export const useBuyOrder = (
  removeFlowersFromInventory: (flowers: Partial<Record<FlowerType, number>>) => boolean,
  addCoins: (amount: number) => void,
  pushEffect: (e: { type: 'task'; taskRewardCoins?: number }) => void
) => {
  const [activeBuyOrder, setActiveBuyOrder] = useState<BuyOrder | null>(null);
  const buyOrderIdRef = useRef(0);

  const generateBuyOrder = useCallback((): BuyOrder => {
    const idx = Math.floor(Math.random() * ALL_FLOWERS.length);
    const flowerType = ALL_FLOWERS[idx];
    const cfg = flowerConfigs.find(f => f.id === flowerType)!;
    const [minAmt, maxAmt] = BUY_ORDER_AMOUNT_RANGE;
    const amount = minAmt + Math.floor(Math.random() * (maxAmt - minAmt + 1));
    const [minPrice, maxPrice] = BUY_ORDER_PRICE_RANGE;
    const pricePerFlower = minPrice + Math.floor(Math.random() * (maxPrice - minPrice + 1));
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

  // 定时生成
  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setActiveBuyOrder(generateBuyOrder());
    }, BUY_ORDER_FIRST_DELAY_MS);

    const interval = setInterval(() => {
      setActiveBuyOrder(generateBuyOrder());
    }, BUY_ORDER_INTERVAL_MS);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [generateBuyOrder]);

  // 过期自动清除
  useEffect(() => {
    if (!activeBuyOrder) return;
    const remaining = activeBuyOrder.expiresAt - Date.now();
    if (remaining <= 0) {
      setActiveBuyOrder(null);
      return;
    }
    const timer = setTimeout(() => setActiveBuyOrder(null), remaining);
    return () => clearTimeout(timer);
  }, [activeBuyOrder]);

  const acceptBuyOrder = useCallback((): boolean => {
    if (!activeBuyOrder) return false;
    const { flowerType, amount, totalPrice } = activeBuyOrder;

    const success = removeFlowersFromInventory({ [flowerType]: amount });
    if (!success) return false;

    addCoins(totalPrice);
    pushEffect({ type: 'task', taskRewardCoins: totalPrice });
    setActiveBuyOrder(null);
    return true;
  }, [activeBuyOrder, removeFlowersFromInventory, addCoins, pushEffect]);

  const dismissBuyOrder = useCallback(() => {
    setActiveBuyOrder(null);
  }, []);

  return { activeBuyOrder, acceptBuyOrder, dismissBuyOrder };
};
