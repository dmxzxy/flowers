import { useEffect, useRef } from 'react';
import { PotData } from '../types';

/** 纯函数：获取花盆冷却剩余秒数 */
export const getCooldownRemaining = (pot: PotData): number => {
  if (pot.state !== 'cooling' || !pot.cooldownUntil) return 0;
  return Math.max(0, Math.ceil((pot.cooldownUntil - Date.now()) / 1000));
};

/** 纯函数：获取生长剩余秒数 */
export const getGrowingRemaining = (pot: PotData): number => {
  if (pot.state !== 'growing' || !pot.growingUntil) return 0;
  return Math.max(0, Math.ceil((pot.growingUntil - Date.now()) / 1000));
};

/**
 * 每秒扫描所有花盆：
 * - growing → blooming（生长完成）
 * - cooling → blooming（冷却结束）
 */
export const useCooldown = (
  _pots: PotData[],
  setPots: React.Dispatch<React.SetStateAction<PotData[]>>
) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      setPots(prev => {
        const hasTransition = prev.some(
          p =>
            (p.state === 'cooling' && p.cooldownUntil && now >= p.cooldownUntil) ||
            (p.state === 'growing' && p.growingUntil && now >= p.growingUntil)
        );
        if (!hasTransition) return prev;
        return prev.map(p => {
          // growing → blooming
          if (p.state === 'growing' && p.growingUntil && now >= p.growingUntil) {
            return { ...p, state: 'blooming' as const, growingUntil: undefined };
          }
          // cooling → blooming
          if (p.state === 'cooling' && p.cooldownUntil && now >= p.cooldownUntil) {
            return { ...p, state: 'blooming' as const, cooldownUntil: undefined };
          }
          return p;
        });
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [setPots]);
};
