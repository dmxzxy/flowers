import { FC, useEffect, useState, useRef } from 'react';

interface PotUnlockEffectProps {
  potId: number;
  onComplete: () => void;
}

interface Sparkle {
  id: number;
  angle: number;
  distance: number;
  delay: number;
  size: number;
}

/**
 * 花盆解锁特效
 * 在解锁的花盆位置播放破锁 + 闪光粒子动画
 */
export const PotUnlockEffect: FC<PotUnlockEffectProps> = ({ potId, onComplete }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const potEl = document.querySelector(`[data-pot-id="${potId}"]`);
    if (!potEl) {
      onCompleteRef.current();
      return;
    }

    const rect = potEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: cx, y: cy });

    const SPARKLE_COUNT = 12;
    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      newSparkles.push({
        id: i,
        angle: (i / SPARKLE_COUNT) * 360,
        distance: 25 + Math.random() * 30,
        delay: i * 30,
        size: 4 + Math.random() * 4,
      });
    }
    setSparkles(newSparkles);

    const timer = setTimeout(() => {
      setSparkles([]);
      onCompleteRef.current();
    }, 900);

    return () => clearTimeout(timer);
  }, [potId]);

  if (!pos || sparkles.length === 0) return null;

  return (
    <div className="pot-unlock-effect">
      {/* 中心闪光 */}
      <div
        className="pot-unlock-flash"
        style={{ left: pos.x, top: pos.y }}
      />
      {/* 锁碎片 */}
      <div
        className="pot-unlock-icon"
        style={{ left: pos.x, top: pos.y }}
      >
        🔓
      </div>
      {/* 散射粒子 */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="pot-unlock-sparkle"
          style={{
            left: pos.x,
            top: pos.y,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}ms`,
            '--angle': `${s.angle}deg`,
            '--dist': `${s.distance}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
