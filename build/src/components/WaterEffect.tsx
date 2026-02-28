import { FC, useEffect, useState, useRef } from 'react';

interface WaterEffectProps {
  potId: number | null;
  onComplete: () => void;
}

/** 浇水特效：水滴涟漪扩散 */
export const WaterEffect: FC<WaterEffectProps> = ({ potId, onComplete }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (potId === null) return;

    const potEl = document.querySelector(`[data-pot-id="${potId}"]`);
    if (!potEl) { onCompleteRef.current(); return; }

    const rect = potEl.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 3 });

    const timer = setTimeout(() => {
      setPos(null);
      onCompleteRef.current();
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potId]);

  if (!pos) return null;

  return (
    <div className="water-effect" style={{ left: pos.x, top: pos.y }}>
      <div className="water-ripple ripple-1" />
      <div className="water-ripple ripple-2" />
      <div className="water-ripple ripple-3" />
      <div className="water-drop">💧</div>
    </div>
  );
};
