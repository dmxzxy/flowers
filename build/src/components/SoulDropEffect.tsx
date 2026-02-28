/**
 * 花卉之魂掉落特效：显示灵魂图标浮动
 */
import { FC, useEffect, useState, useRef } from 'react';
import { FlowerType } from '../types';
import { getFlowerConfig } from '../config';

interface SoulDropEffectProps {
  soulFlowerType?: FlowerType;
  onComplete: () => void;
}

export const SoulDropEffect: FC<SoulDropEffectProps> = ({ soulFlowerType, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const flowerConfig = soulFlowerType ? getFlowerConfig(soulFlowerType) : null;
  const flowerName = flowerConfig?.name || '???';

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onCompleteRef.current();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="soul-drop-effect">
      <span className="soul-drop-text">👻 {flowerName}之魂 +1</span>
    </div>
  );
};
