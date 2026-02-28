import { FC, useEffect, useState, useRef } from 'react';

interface SeedEffectProps {
  potId: number | null;
  onComplete: () => void;
}

/** 播种特效：种子从上方掉落到花盆 */
export const SeedEffect: FC<SeedEffectProps> = ({ potId, onComplete }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (potId === null) return;

    const potEl = document.querySelector(`[data-pot-id="${potId}"]`);
    if (!potEl) { onCompleteRef.current(); return; }

    const rect = potEl.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

    const timer = setTimeout(() => {
      setPos(null);
      onCompleteRef.current();
    }, 600);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potId]);

  if (!pos) return null;

  return (
    <div className="seed-effect" style={{ left: pos.x, top: pos.y }}>
      <div className="seed-drop">🌱</div>
    </div>
  );
};
