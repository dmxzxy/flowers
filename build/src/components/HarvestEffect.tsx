import { FC, useEffect, useState, useCallback, useRef } from 'react';
import { flowers } from '../data/flowers';

interface Particle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  delay: number;
}

interface HarvestEffectProps {
  isActive: boolean;
  potId: number | null;
  flowerType?: string;
  onComplete: () => void;
}

export const HarvestEffect: FC<HarvestEffectProps> = ({ isActive, potId, flowerType, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showPlusOne, setShowPlusOne] = useState(false);

  // 稳定 ref，避免 onComplete 变化导致 useEffect 重复触发
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const flowerConfig = flowerType ? flowers.find(f => f.id === flowerType) : null;
  const color = flowerConfig?.color || '#FFD700';

  const getInventoryPosition = useCallback(() => {
    const inventoryBtn = document.querySelector('.toolbar-tool-inventory');
    if (inventoryBtn) {
      const rect = inventoryBtn.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: window.innerWidth - 60, y: 60 };
  }, []);

  useEffect(() => {
    if (!isActive || !flowerType || potId === null) return;

    const potElement = document.querySelector(`[data-pot-id="${potId}"]`);
    const inventoryPos = getInventoryPosition();

    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (potElement) {
      const rect = potElement.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    const PARTICLE_COUNT = 10;
    const newParticles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const spread = 30 + Math.random() * 40;
      newParticles.push({
        id: i,
        startX,
        startY,
        endX: inventoryPos.x + Math.cos(angle) * spread * 0.3 + (Math.random() - 0.5) * 15,
        endY: inventoryPos.y + Math.sin(angle) * spread * 0.3 + (Math.random() - 0.5) * 15,
        color: i < 2 ? color : (Math.random() > 0.4 ? '#FFD700' : color),
        delay: i * 25,
      });
    }
    setParticles(newParticles);
    setShowPlusOne(false);

    const plusTimer = setTimeout(() => setShowPlusOne(true), 400);

    const timer = setTimeout(() => {
      setParticles([]);
      setShowPlusOne(false);
      onCompleteRef.current();
    }, 1000);

    return () => { clearTimeout(timer); clearTimeout(plusTimer); };
  // 故意只依赖不变的值，用 ref 读 onComplete
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, flowerType, potId, color, getInventoryPosition]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="harvest-effect">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="harvest-particle"
          style={{
            left: particle.startX,
            top: particle.startY,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}ms`,
            '--end-x': `${particle.endX - particle.startX}px`,
            '--end-y': `${particle.endY - particle.startY}px`,
          } as React.CSSProperties}
        />
      ))}
      {showPlusOne && (
        <div
          className="harvest-plus-one"
          style={{
            left: particles[0]?.endX || 0,
            top: particles[0]?.endY || 0,
          }}
        >
          +1
        </div>
      )}
    </div>
  );
};
