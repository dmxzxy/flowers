import { useEffect, useRef } from 'react';
import { PotData } from '../types';

/** 纯函数：获取花盆冷却剩余秒数 */
export const getCooldownRemaining = (pot: PotData): number => {
  if (pot.state !== 'cooling' || !pot.cooldownUntil) return 0;
  return Math.max(0, Math.ceil((pot.cooldownUntil - Date.now()) / 1000));
};

/**
 * 每秒扫描所有 cooling 花盆，当冷却结束时转回 blooming 状态。
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
        const hasCooling = prev.some(
          p => p.state === 'cooling' && p.cooldownUntil && now >= p.cooldownUntil
        );
        if (!hasCooling) return prev;
        return prev.map(p =>
          p.state === 'cooling' && p.cooldownUntil && now >= p.cooldownUntil
            ? { ...p, state: 'blooming' as const, cooldownUntil: undefined }
            : p
        );
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [setPots]);
};
