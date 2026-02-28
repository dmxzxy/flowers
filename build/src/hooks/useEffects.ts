/**
 * 特效队列 Hook
 * 管理所有动画特效的创建和销毁
 */
import { useState, useCallback, useRef } from 'react';
import { EffectState } from '../types';

export const useEffects = () => {
  const [effects, setEffects] = useState<EffectState[]>([]);
  const effectIdRef = useRef(0);

  const pushEffect = useCallback((e: Omit<EffectState, 'id'>) => {
    const id = ++effectIdRef.current;
    setEffects(prev => [...prev, { ...e, id } as EffectState]);
  }, []);

  const removeEffect = useCallback((id: number) => {
    setEffects(prev => prev.filter(e => e.id !== id));
  }, []);

  return { effects, pushEffect, removeEffect };
};
