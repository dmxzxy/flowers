import { FC, useEffect, useState, useRef } from 'react';

interface LevelUpEffectProps {
  flowerType: string | null;
  onComplete: () => void;
}

/** 升级特效：星星爆发 + 文字 */
export const LevelUpEffect: FC<LevelUpEffectProps> = ({ flowerType, onComplete }) => {
  const [active, setActive] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!flowerType) return;
    setActive(true);

    const timer = setTimeout(() => {
      setActive(false);
      onCompleteRef.current();
    }, 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowerType]);

  if (!active) return null;

  return (
    <div className="levelup-effect">
      <div className="levelup-burst">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="levelup-star"
            style={{
              '--angle': `${i * 30}deg`,
              '--delay': `${i * 40}ms`,
            } as React.CSSProperties}
          >
            ⭐
          </div>
        ))}
      </div>
      <div className="levelup-text">LEVEL UP!</div>
    </div>
  );
};
