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
  FlowerType,
} from '../types';
import { ALL_FLOWERS, INITIAL_COINS, INITIAL_WATER, GRID_TOTAL, GRID_COLS } from '../config';

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

/** 从 localStorage 读取存档（失败返回 null），含字段校验与迁移 */
export const loadSave = (): SaveData | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== 1) return null;

    // ---- 字段完整性校验 & 迁移 ----

    // currency
    if (!data.currency || typeof data.currency.coins !== 'number') {
      data.currency = { coins: INITIAL_COINS, water: INITIAL_WATER };
    }

    // inventory — 确保所有花朵类型都存在
    if (!data.inventory || !data.inventory.flowers) {
      data.inventory = {
        flowers: Object.fromEntries(ALL_FLOWERS.map(f => [f, 0])) as Record<FlowerType, number>,
        total: 0,
      };
    } else {
      for (const ft of ALL_FLOWERS) {
        if (typeof data.inventory.flowers[ft] !== 'number') {
          data.inventory.flowers[ft] = 0;
        }
      }
      data.inventory.total = Object.values(data.inventory.flowers).reduce((s, n) => s + n, 0);
    }

    // flowerLevels — 确保所有花朵都有等级
    if (!data.flowerLevels) {
      data.flowerLevels = Object.fromEntries(ALL_FLOWERS.map(f => [f, 1])) as FlowerLevels;
    } else {
      for (const ft of ALL_FLOWERS) {
        if (typeof data.flowerLevels[ft] !== 'number' || data.flowerLevels[ft] < 1) {
          data.flowerLevels[ft] = 1;
        }
      }
    }

    // flowerSouls — 确保所有花朵都有魂数
    if (!data.flowerSouls) {
      data.flowerSouls = Object.fromEntries(ALL_FLOWERS.map(f => [f, 0])) as FlowerSouls;
    } else {
      for (const ft of ALL_FLOWERS) {
        if (typeof data.flowerSouls[ft] !== 'number') {
          data.flowerSouls[ft] = 0;
        }
      }
    }

    // playerLevel
    if (!data.playerLevel || typeof data.playerLevel.level !== 'number') {
      data.playerLevel = { level: 1, xp: 0, xpToNext: 100 };
    }

    // pots — 确保花盆数量正确
    if (!Array.isArray(data.pots) || data.pots.length === 0) {
      data.pots = Array.from({ length: GRID_TOTAL }, (_, i) => ({
        id: i,
        row: Math.floor(i / GRID_COLS),
        col: i % GRID_COLS,
        state: 'empty' as const,
      }));
    }

    // activeSkin
    if (!data.activeSkin) data.activeSkin = 'default';

    // unlockedSkins
    if (!Array.isArray(data.unlockedSkins)) {
      data.unlockedSkins = ['default'];
    }

    return data;
  } catch {
    return null;
  }
};

/** 是否已请求重置（阻止 beforeunload 回写存档） */
let _resetRequested = false;

/** 清除存档 */
export const clearSave = () => {
  _resetRequested = true;
  localStorage.removeItem(SAVE_KEY);
};

/** 检查是否处于重置状态 */
export const isResetRequested = () => _resetRequested;

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

  /** 立即保存（如果重置已请求则跳过） */
  const saveNow = useCallback(() => {
    if (_resetRequested) return;
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
