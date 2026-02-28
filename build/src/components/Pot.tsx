import { FC, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { PotData } from '../types';
import { getFlowerConfig } from '../data/flowers';
import { assets } from '../data/assets';
import { getFlowerImage } from '../hooks/useFlower';
import { getCooldownRemaining } from '../hooks/useCooldown';

interface PotProps {
  pot: PotData;
  onClick: (id: number) => void;
}

export const Pot: FC<PotProps> = ({ pot, onClick }) => {
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

  // 本地每秒刷新倒计时
  const [cooldownSec, setCooldownSec] = useState(() =>
    isCooling ? getCooldownRemaining(pot) : 0
  );

  useEffect(() => {
    if (!isCooling) {
      setCooldownSec(0);
      return;
    }
    // 立即计算一次
    setCooldownSec(getCooldownRemaining(pot));
    const timer = setInterval(() => {
      const remaining = getCooldownRemaining(pot);
      setCooldownSec(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCooling, pot.cooldownUntil]);

  useEffect(() => {
    prevStateRef.current = pot.state;
  }, [pot.state]);

  return (
    <div 
      className="pot"
      data-pot-id={pot.id}
      onClick={handleClick}
    >
      <div className="pot-container">
        {/* 花朵在花盆圈内 */}
        {pot.state !== 'empty' && flowerImage && (
          <img
            src={flowerImage}
            alt={flowerConfig?.name}
            className={`pot-flower-image ${isBlooming ? 'blooming' : ''} ${pot.state === 'blooming' ? 'bloom-float' : ''}`}
            draggable={false}
          />
        )}
        {/* 花盆 */}
        <img
          src={assets.pot}
          alt="花盆"
          className="pot-base"
          draggable={false}
        />
        {/* 状态文字在底部，与花盆重叠 */}
        {pot.state === 'seeded' && (
          <div className="pot-status pot-status-seeded">种子</div>
        )}
        {pot.state === 'blooming' && (
          <div className={`pot-status pot-status-bloomed ${isBlooming ? 'bloomed' : ''}`}>🌸</div>
        )}
        {/* 冷却倒计时 */}
        {isCooling && (
          <div className="pot-cooldown">{cooldownSec}s</div>
        )}
        {/* 剩余收割次数 */}
        {pot.harvestsRemaining && pot.harvestsRemaining > 1 && pot.state === 'blooming' && (
          <div className="pot-harvest-badge">×{pot.harvestsRemaining}</div>
        )}
      </div>
    </div>
  );
};
