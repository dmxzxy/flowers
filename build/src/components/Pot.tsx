import { FC, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { PotData } from '../types';
import { getFlowerConfig } from '../data/flowers';
import { getFlowerImage } from '../hooks/useFlower';
import { getCooldownRemaining, getGrowingRemaining } from '../hooks/useCooldown';
import type { PotLockInfo } from '../hooks/usePotUnlock';

interface PotProps {
  pot: PotData;
  onClick: (id: number) => void;
  potImage: string;
  /** 花盆锁定信息（未提供则视为已解锁） */
  lockInfo?: PotLockInfo;
}

export const Pot: FC<PotProps> = ({ pot, onClick, potImage, lockInfo }) => {
  const isLocked = lockInfo ? !lockInfo.unlocked : false;
  const flowerConfig = useMemo(() => {
    if (!pot.flowerType) return undefined;
    return getFlowerConfig(pot.flowerType);
  }, [pot.flowerType]);

  const flowerImage = useMemo(() => {
    return getFlowerImage(flowerConfig, pot.state);
  }, [flowerConfig, pot.state]);

  const prevStateRef = useRef(pot.state);

  const handleClick = useCallback(() => {
    onClick(pot.id);
  }, [pot.id, onClick]);

  const isBlooming = pot.state === 'blooming' && prevStateRef.current !== 'blooming';
  const isCooling = pot.state === 'cooling';
  const isGrowing = pot.state === 'growing';

  // 本地每秒刷新冷却倒计时
  const [cooldownSec, setCooldownSec] = useState(() =>
    isCooling ? getCooldownRemaining(pot) : 0
  );

  // 本地每秒刷新生长倒计时
  const [growingSec, setGrowingSec] = useState(() =>
    isGrowing ? getGrowingRemaining(pot) : 0
  );

  useEffect(() => {
    if (!isCooling) {
      setCooldownSec(0);
      return;
    }
    setCooldownSec(getCooldownRemaining(pot));
    const timer = setInterval(() => {
      const remaining = getCooldownRemaining(pot);
      setCooldownSec(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCooling, pot.cooldownUntil]);

  useEffect(() => {
    if (!isGrowing) {
      setGrowingSec(0);
      return;
    }
    setGrowingSec(getGrowingRemaining(pot));
    const timer = setInterval(() => {
      const remaining = getGrowingRemaining(pot);
      setGrowingSec(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGrowing, pot.growingUntil]);

  useEffect(() => {
    prevStateRef.current = pot.state;
  }, [pot.state]);

  return (
    <div 
      className={`pot ${isLocked ? 'pot-locked' : ''} ${isLocked && lockInfo?.canBuy ? 'pot-buyable' : ''}`}
      data-pot-id={pot.id}
      onClick={handleClick}
    >
      <div className="pot-container">
        {/* 锁定状态 */}
        {isLocked ? (
          <>
            <img
              src={potImage}
              alt="花盆"
              className="pot-base pot-base-locked"
              draggable={false}
            />
            {lockInfo?.rowAvailable ? (
              <div className="pot-lock-overlay pot-lock-buyable">
                <span className="pot-lock-icon">🔓</span>
                <span className="pot-lock-cost">💰 {lockInfo.cost}</span>
              </div>
            ) : (
              <div className="pot-lock-overlay">
                <span className="pot-lock-icon">🔒</span>
                <span className="pot-lock-level">Lv.{lockInfo?.requiredLevel}</span>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 花朵在花盆圈内 */}
            {pot.state !== 'empty' && flowerImage && (
              <img
                src={flowerImage}
                alt={flowerConfig?.name}
                className={`pot-flower-image ${isBlooming ? 'blooming' : ''} ${pot.state === 'blooming' ? 'bloom-float' : ''} ${isGrowing ? 'growing-sprout' : ''}`}
                draggable={false}
              />
            )}
            {/* 花盆 */}
            <img
              src={potImage}
              alt="花盆"
              className="pot-base"
              draggable={false}
            />
            {/* 状态文字在底部，与花盆重叠 */}
            {pot.state === 'seeded' && (
              <div className="pot-status pot-status-seeded">种子</div>
            )}
            {isGrowing && (
              <div className="pot-status pot-status-growing">🌱 {growingSec}s</div>
            )}
            {pot.state === 'blooming' && (
              <div className={`pot-status pot-status-bloomed ${isBlooming ? 'bloomed' : ''}`}>🌸</div>
            )}
            {/* 冷却进度条 + 倒计时 */}
            {isCooling && (
              <>
                <div className="pot-cooldown-bar">
                  <div
                    className="pot-cooldown-fill"
                    style={{
                      width: pot.cooldownTotalMs
                        ? `${Math.max(0, Math.min(100, (1 - (cooldownSec * 1000) / pot.cooldownTotalMs) * 100))}%`
                        : '0%',
                    }}
                  />
                </div>
                <div className="pot-cooldown">{cooldownSec}s</div>
              </>
            )}
            {/* 剩余收割次数 */}
            {pot.harvestsRemaining && pot.harvestsRemaining > 1 && pot.state === 'blooming' && (
              <div className="pot-harvest-badge">×{pot.harvestsRemaining}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
