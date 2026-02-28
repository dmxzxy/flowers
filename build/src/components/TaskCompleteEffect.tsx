import { FC, useEffect, useState, useRef } from 'react';

interface TaskCompleteEffectProps {
  rewardCoins?: number;
  rewardWater?: number;
  onComplete: () => void;
}

/** 交付任务完成特效：✓ 弹出 + 金币/水滴飘字 + 光圈扩散 */
export const TaskCompleteEffect: FC<TaskCompleteEffectProps> = ({
  rewardCoins,
  rewardWater,
  onComplete,
}) => {
  const [active, setActive] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
      onCompleteRef.current();
    }, 1600);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    <div className="task-effect-overlay">
      {/* 背景光晕 */}
      <div className="task-effect-glow" />

      {/* 主图标 */}
      <div className="task-effect-check">✓</div>

      {/* 完成文字 */}
      <div className="task-effect-text">交付成功!</div>

      {/* 奖励飘字 */}
      <div className="task-effect-rewards">
        {!!rewardCoins && (
          <div className="task-reward-float task-reward-coins">
            +{rewardCoins} <span className="inline-coin">$</span>
          </div>
        )}
        {!!rewardWater && (
          <div className="task-reward-float task-reward-water">
            +{rewardWater} 💧
          </div>
        )}
      </div>

      {/* 装饰粒子 */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="task-effect-spark"
          style={{
            '--spark-angle': `${i * 22.5}deg`,
            '--spark-delay': `${i * 30}ms`,
            '--spark-dist': `${60 + Math.random() * 40}px`,
            '--spark-color': i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#4CAF50' : '#42A5F5',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
