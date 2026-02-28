import { FC } from 'react';
import { DragState } from '../types';
import { assets } from '../data/assets';
import { flowers } from '../data/flowers';

interface DragIndicatorProps {
  dragState: DragState;
}

export const DragIndicator: FC<DragIndicatorProps> = ({ dragState }) => {
  if (!dragState.isDragging) return null;

  const flowerData = dragState.flowerType 
    ? flowers.find(f => f.id === dragState.flowerType) 
    : null;

  return (
    <div 
      className="drag-indicator"
      style={{
        left: dragState.x,
        top: dragState.y,
      }}
    >
      {dragState.tool === 'seed' && flowerData && (
        <div 
          className="drag-seed"
          style={{ backgroundColor: flowerData.color }}
        >
          {flowerData.name.charAt(0)}
        </div>
      )}
      {dragState.tool === 'water' && (
        <div className="drag-water">
          <img src={assets.ui.water} alt="水" draggable={false} />
        </div>
      )}
      {dragState.tool === 'harvest' && (
        <div className="drag-harvest">
          <span>🌾</span>
        </div>
      )}
    </div>
  );
};
