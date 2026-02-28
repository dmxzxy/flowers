import { FC, useCallback, useState } from 'react';
import { flowers } from '../data/flowers';
import { FlowerType } from '../types';

interface FlowerPickerProps {
  onSelect: (flowerType: FlowerType) => void;
  onClose: () => void;
  onStartDrag?: (flowerType: FlowerType, e: React.MouseEvent | React.TouchEvent) => void;
}

export const FlowerPicker: FC<FlowerPickerProps> = ({ onSelect, onClose, onStartDrag }) => {
  const [selectedFlower, setSelectedFlower] = useState<FlowerType | null>(null);

  const handleClick = useCallback((flowerType: FlowerType) => {
    setSelectedFlower(flowerType);
    onSelect(flowerType);
  }, [onSelect]);

  const handleDragStart = useCallback((flowerType: FlowerType, e: React.MouseEvent | React.TouchEvent) => {
    // mousedown 时阻止后续 click
    if (!('touches' in e)) e.preventDefault();
    setSelectedFlower(flowerType);
    onStartDrag?.(flowerType, e);
    // 鼠标：立即关闭 picker；触摸：由 GameScene 在移动阈值后关闭
    if (!('touches' in e)) onClose();
  }, [onStartDrag, onClose]);

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-modal picker-flower-modal" onClick={e => e.stopPropagation()}>
        <div className="picker-header">
          <h2 className="picker-title">选择花朵</h2>
          <span className="picker-hint">点击选择 / 拖拽直接播种</span>
        </div>
        <div className="picker-grid">
          {flowers.map((flower) => (
            <button
              key={flower.id}
              className={`picker-flower-btn ${selectedFlower === flower.id ? 'selected' : ''}`}
              onClick={() => handleClick(flower.id)}
              onMouseDown={(e) => handleDragStart(flower.id, e)}
              onTouchStart={(e) => handleDragStart(flower.id, e)}
            >
              <div
                className="picker-flower-icon"
                style={{ backgroundColor: flower.color }}
              >
                {flower.name.charAt(0)}
              </div>
              <span className="picker-flower-name">{flower.name}</span>
            </button>
          ))}
        </div>
        <button className="picker-cancel" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
};
