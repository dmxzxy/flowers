/**
 * 玩家等级经验条组件
 * 显示当前等级、经验进度条
 */
import { FC } from 'react';
import { PlayerLevelState } from '../types';
import { MAX_PLAYER_LEVEL } from '../config';

interface PlayerLevelBarProps {
  playerLevel: PlayerLevelState;
}

export const PlayerLevelBar: FC<PlayerLevelBarProps> = ({ playerLevel }) => {
  const { level, xp, xpToNext } = playerLevel;
  const isMaxLevel = level >= MAX_PLAYER_LEVEL;
  const progress = isMaxLevel ? 100 : xpToNext > 0 ? (xp / xpToNext) * 100 : 0;

  return (
    <div className="player-level-bar">
      <div className="player-level-badge">
        <span className="player-level-icon">⭐</span>
        <span className="player-level-num">Lv.{level}</span>
      </div>
      <div className="player-xp-track">
        <div className="player-xp-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        <span className="player-xp-text">
          {isMaxLevel ? 'MAX' : `${xp} / ${xpToNext}`}
        </span>
      </div>
    </div>
  );
};
