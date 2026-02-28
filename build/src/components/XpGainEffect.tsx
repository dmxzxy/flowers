/**
 * XP 获取特效：显示 +5 XP 浮动文字
 */
import { FC, useEffect, useState, useRef } from 'react';

interface XpGainEffectProps {
  xpAmount?: number;
  onComplete: () => void;
}

export const XpGainEffect: FC<XpGainEffectProps> = ({ xpAmount = 5, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onCompleteRef.current();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="xp-gain-effect">
      <span className="xp-gain-text">+{xpAmount} XP</span>
    </div>
  );
};
