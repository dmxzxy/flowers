/**
 * 花盆皮肤 Hook
 * 管理已解锁皮肤、当前选中皮肤（全局），支持切换 + 购买解锁
 */
import { useState, useCallback } from 'react';
import { PotSkinId } from '../types';
import { POT_SKINS, getPotSkinConfig } from '../config';

export const usePotSkins = (
  spendCoins: (amount: number) => boolean
) => {
  // 默认皮肤免费已解锁
  const [unlockedSkins, setUnlockedSkins] = useState<Set<PotSkinId>>(new Set(['default']));
  const [activeSkin, setActiveSkin] = useState<PotSkinId>('default');

  /** 获取当前皮肤图片路径 */
  const getSkinImage = useCallback((): string => {
    return getPotSkinConfig(activeSkin).image;
  }, [activeSkin]);

  /** 切换到已解锁的皮肤 */
  const selectSkin = useCallback((skinId: PotSkinId) => {
    if (unlockedSkins.has(skinId)) {
      setActiveSkin(skinId);
    }
  }, [unlockedSkins]);

  /** 解锁皮肤（花费金币） */
  const unlockSkin = useCallback((skinId: PotSkinId): boolean => {
    if (unlockedSkins.has(skinId)) return true; // 已解锁
    const config = POT_SKINS.find(s => s.id === skinId);
    if (!config) return false;
    if (config.unlockCost > 0 && !spendCoins(config.unlockCost)) return false;
    setUnlockedSkins(prev => new Set([...prev, skinId]));
    setActiveSkin(skinId);
    return true;
  }, [unlockedSkins, spendCoins]);

  /** 检查皮肤是否已解锁 */
  const isSkinUnlocked = useCallback((skinId: PotSkinId): boolean => {
    return unlockedSkins.has(skinId);
  }, [unlockedSkins]);

  return {
    activeSkin,
    unlockedSkins,
    getSkinImage,
    selectSkin,
    unlockSkin,
    isSkinUnlocked,
  };
};
