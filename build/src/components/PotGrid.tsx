import { FC, useMemo } from 'react';
import { PotData } from '../types';
import { Pot } from './Pot';
import { GRID_COLS } from '../config/game.config';
import type { PotLockInfo } from '../hooks/usePotUnlock';

interface PotGridProps {
  pots: PotData[];
  onPotClick: (id: number) => void;
  potImage: string;
  /** 获取花盆锁定信息的函数 */
  getPotLockInfo?: (potId: number) => PotLockInfo;
  /** 可见行数（用于动态裁剪网格高度） */
  visibleRows?: number;
}

export const PotGrid: FC<PotGridProps> = ({ pots, onPotClick, potImage, getPotLockInfo, visibleRows }) => {
  const visiblePots = useMemo(() => {
    if (!visibleRows) return pots;
    const maxId = visibleRows * GRID_COLS;
    return pots.filter(p => p.id < maxId);
  }, [pots, visibleRows]);

  return (
    <div className="pot-grid-wrapper" style={visibleRows ? { height: `${visibleRows * 91 + 15}px` } : undefined}>
      <div className="pot-grid" style={visibleRows ? { gridTemplateRows: `repeat(${visibleRows}, 85px)` } : undefined}>
        {visiblePots.map((pot) => (
          <Pot 
            key={pot.id} 
            pot={pot} 
            onClick={onPotClick}
            potImage={potImage}
            lockInfo={getPotLockInfo?.(pot.id)}
          />
        ))}
      </div>
    </div>
  );
};
