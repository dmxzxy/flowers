/**
 * 存档系统 Hook
 * 负责将游戏核心状态持久化到 localStorage，以及读取/清除存档
 */
import { useCallback, useEffect, useRef } from 'react';
import {
  Currency,
  Inventory,
  FlowerLevels,
  FlowerSouls,
  PlayerLevelState,
  PotData,
  PotSkinId,
} from '../types';

const SAVE_KEY = 'flowers_game_save';
const SAVE_INTERVAL_MS = 5000; // 每 5 秒自动保存

/** 存档数据结构 */
export interface SaveData {
  version: 1;
  savedAt: number;
  currency: Currency;
  inventory: Inventory;
  flowerLevels: FlowerLevels;
  flowerSouls: FlowerSouls;
  playerLevel: PlayerLevelState;
  pots: PotData[];
  activeSkin: PotSkinId;
  unlockedSkins: PotSkinId[];
}

/** 从 localStorage 读取存档（失败返回 null） */
export const loadSave = (): SaveData | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
};

/** 清除存档 */
export const clearSave = () => {
  localStorage.removeItem(SAVE_KEY);
};

/** 存档到 localStorage */
const writeSave = (data: SaveData) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // 存储空间不足时静默失败
  }
};

/**
 * 自动保存 Hook
 * 接收所有需要持久化的状态，定时写入 localStorage
 */
export const useSaveGame = (
  currency: Currency,
  inventory: Inventory,
  flowerLevels: FlowerLevels,
  flowerSouls: FlowerSouls,
  playerLevel: PlayerLevelState,
  pots: PotData[],
  activeSkin: PotSkinId,
  unlockedSkins: Set<PotSkinId>
) => {
  // 所有需要持久化的状态用 ref 追踪，以便定时器访问最新值
  const stateRef = useRef({
    currency,
    inventory,
    flowerLevels,
    flowerSouls,
    playerLevel,
    pots,
    activeSkin,
    unlockedSkins,
  });

  // 同步 ref
  stateRef.current = {
    currency,
    inventory,
    flowerLevels,
    flowerSouls,
    playerLevel,
    pots,
    activeSkin,
    unlockedSkins,
  };

  /** 立即保存 */
  const saveNow = useCallback(() => {
    const s = stateRef.current;
    writeSave({
      version: 1,
      savedAt: Date.now(),
      currency: s.currency,
      inventory: s.inventory,
      flowerLevels: s.flowerLevels,
      flowerSouls: s.flowerSouls,
      playerLevel: s.playerLevel,
      pots: s.pots,
      activeSkin: s.activeSkin,
      unlockedSkins: Array.from(s.unlockedSkins) as PotSkinId[],
    });
  }, []);

  // 定时自动保存
  useEffect(() => {
    const timer = setInterval(saveNow, SAVE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [saveNow]);

  // 页面关闭 / 隐藏时保存
  useEffect(() => {
    const handleBeforeUnload = () => saveNow();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveNow();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveNow]);

  return { saveNow };
};
