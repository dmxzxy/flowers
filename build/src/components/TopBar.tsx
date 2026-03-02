/**
 * 顶部栏组件 — 左侧头像+等级，右侧金币+水
 */
import { FC } from 'react';
import { Currency, PlayerLevelState } from '../types';
import { MAX_PLAYER_LEVEL } from '../config';
import { AvatarIcon, IconCoin, IconWater } from './ToolbarIcons';

interface TopBarProps {
  playerLevel: PlayerLevelState;
  currency: Currency;
  maxWater: number;
  noWaterWarning: boolean;
  waterRegenCountdown: number;
  onOpenProfile: () => void;
}

export const TopBar: FC<TopBarProps> = ({
  playerLevel,
  currency,
  maxWater,
  noWaterWarning,
  waterRegenCountdown,
  onOpenProfile,
}) => {
  const { level, xp, xpToNext } = playerLevel;
  const isMaxLevel = level >= MAX_PLAYER_LEVEL;
  const progress = isMaxLevel ? 100 : xpToNext > 0 ? (xp / xpToNext) * 100 : 0;

  return (
    <div className="top-bar">
      {/* 左侧：头像 + 等级 */}
      <div className="top-bar-left" onClick={onOpenProfile}>
        <div className="top-bar-avatar">
          <AvatarIcon size={36} />
        </div>
        <div className="top-bar-level-info">
          <span className="top-bar-level">Lv.{level}</span>
          <div className="top-bar-xp-track">
            <div className="top-bar-xp-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <span className="top-bar-xp-text">
            {isMaxLevel ? 'MAX' : `${xp}/${xpToNext}`}
          </span>
        </div>
      </div>

      {/* 右侧：货币 */}
      <div className="top-bar-right">
        <div className="top-bar-currency">
          <IconCoin size={18} />
          <span className="top-bar-coins">{currency.coins}</span>
        </div>
        <div className={`top-bar-currency ${noWaterWarning ? 'no-water-shake' : ''}`}>
          <IconWater size={18} />
          <span className="top-bar-water">{currency.water}/{maxWater}</span>
          {currency.water < maxWater && (
            <span className="top-bar-regen">+1:{waterRegenCountdown}s</span>
          )}
        </div>
      </div>
    </div>
  );
};
