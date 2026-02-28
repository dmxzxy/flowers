/**
 * 玩家等级 Hook
 * 管理经验值/等级，收割花卉时赚取 XP，升级解锁更多花朵
 */
import { useState, useCallback } from 'react';
import { PlayerLevelState, EffectState } from '../types';
import {
  PLAYER_LEVEL_CONFIGS,
  MAX_PLAYER_LEVEL,
} from '../config';

const createInitialState = (): PlayerLevelState => ({
  level: 1,
  xp: 0,
  xpToNext: PLAYER_LEVEL_CONFIGS[1]?.xpRequired ?? 0,
});

export const usePlayerLevel = (
  pushEffect: (e: Omit<EffectState, 'id'>) => void,
  savedLevel?: PlayerLevelState
) => {
  const [playerLevel, setPlayerLevel] = useState<PlayerLevelState>(savedLevel ?? createInitialState);

  const addXP = useCallback(
    (amount: number) => {
      setPlayerLevel(prev => {
        // 把当前 xp 转为累计经验
        const baseXp = PLAYER_LEVEL_CONFIGS[prev.level - 1].xpRequired;
        let totalXp = baseXp + prev.xp + amount;
        let newLevel = prev.level;

        // 连续升级检测
        while (newLevel < MAX_PLAYER_LEVEL) {
          const nextThreshold = PLAYER_LEVEL_CONFIGS[newLevel].xpRequired;
          if (totalXp >= nextThreshold) {
            newLevel++;
          } else {
            break;
          }
        }

        const newBaseXp = PLAYER_LEVEL_CONFIGS[newLevel - 1].xpRequired;
        const remainingXp = totalXp - newBaseXp;
        const xpToNext = newLevel < MAX_PLAYER_LEVEL
          ? PLAYER_LEVEL_CONFIGS[newLevel].xpRequired - newBaseXp
          : 0;

        // 推送特效（延迟到下一个微任务，避免在 setState 中嵌套更新）
        if (newLevel > prev.level) {
          setTimeout(() => pushEffect({ type: 'playerlevelup', newPlayerLevel: newLevel }), 0);
        }
        setTimeout(() => pushEffect({ type: 'xpgain', xpAmount: amount }), 0);

        return { level: newLevel, xp: remainingXp, xpToNext };
      });
    },
    [pushEffect]
  );

  return { playerLevel, addXP };
};
