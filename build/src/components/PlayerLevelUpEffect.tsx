/**
 * 玩家等级提升特效：全屏等级提示
 */
import { FC, useEffect, useState, useRef } from 'react';

interface PlayerLevelUpEffectProps {
  newPlayerLevel?: number;
  onComplete: () => void;
}

export const PlayerLevelUpEffect: FC<PlayerLevelUpEffectProps> = ({ newPlayerLevel, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onCompleteRef.current();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="player-levelup-effect">
      <div className="player-levelup-content">
        <div className="player-levelup-icon">🎉</div>
        <div className="player-levelup-title">等级提升!</div>
        <div className="player-levelup-level">Lv.{newPlayerLevel}</div>
      </div>
    </div>
  );
};
