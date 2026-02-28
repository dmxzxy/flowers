/**
 * 货币系统 Hook
 * 管理金币 + 水量，含水量自动恢复
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Currency } from '../types';
import {
  INITIAL_COINS,
  INITIAL_WATER,
  MAX_WATER,
  WATER_REGEN_INTERVAL_MS,
  WATER_REGEN_AMOUNT,
  NO_WATER_WARNING_MS,
  WATER_COST_PER_USE,
} from '../config';

export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>({
    coins: INITIAL_COINS,
    water: INITIAL_WATER,
  });
  const [noWaterWarning, setNoWaterWarning] = useState(false);

  // 同步 ref 跟踪货币，避免 setState updater 异步导致判断失败
  const currencyRef = useRef<Currency>({ coins: INITIAL_COINS, water: INITIAL_WATER });

  const updateCurrency = useCallback((fn: (prev: Currency) => Currency) => {
    setCurrency(prev => {
      const next = fn(prev);
      currencyRef.current = next;
      return next;
    });
  }, []);

  /** 同步扣水，返回是否成功 */
  const spendWater = useCallback((amount: number = WATER_COST_PER_USE): boolean => {
    if (currencyRef.current.water < amount) {
      setNoWaterWarning(true);
      setTimeout(() => setNoWaterWarning(false), NO_WATER_WARNING_MS);
      return false;
    }
    currencyRef.current = { ...currencyRef.current, water: currencyRef.current.water - amount };
    updateCurrency(() => currencyRef.current);
    return true;
  }, [updateCurrency]);

  /** 同步扣金币，返回是否成功 */
  const spendCoins = useCallback((amount: number): boolean => {
    if (currencyRef.current.coins < amount) return false;
    currencyRef.current = { ...currencyRef.current, coins: currencyRef.current.coins - amount };
    updateCurrency(() => currencyRef.current);
    return true;
  }, [updateCurrency]);

  /** 同步加金币 */
  const addCoins = useCallback((amount: number) => {
    currencyRef.current = { ...currencyRef.current, coins: currencyRef.current.coins + amount };
    updateCurrency(() => currencyRef.current);
  }, [updateCurrency]);

  /** 同步加水（不超过上限） */
  const addWater = useCallback((amount: number) => {
    currencyRef.current = {
      ...currencyRef.current,
      water: Math.min(currencyRef.current.water + amount, MAX_WATER),
    };
    updateCurrency(() => currencyRef.current);
  }, [updateCurrency]);

  /** 同步加金币和水 */
  const addRewards = useCallback((coins: number, water: number) => {
    currencyRef.current = {
      coins: currencyRef.current.coins + coins,
      water: Math.min(currencyRef.current.water + water, MAX_WATER),
    };
    updateCurrency(() => currencyRef.current);
  }, [updateCurrency]);

  // 水量自动恢复
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrency(prev => {
        if (prev.water >= MAX_WATER) return prev;
        const next = { ...prev, water: Math.min(prev.water + WATER_REGEN_AMOUNT, MAX_WATER) };
        currencyRef.current = next;
        return next;
      });
    }, WATER_REGEN_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return {
    currency,
    currencyRef,
    noWaterWarning,
    maxWater: MAX_WATER,
    spendWater,
    spendCoins,
    addCoins,
    addWater,
    addRewards,
  };
};
