import { FC, useCallback, useState } from 'react';
import { flowers } from '../data/flowers';
import { getFlowerUnlockLevel } from '../config';
import { FlowerType } from '../types';

interface FlowerPickerProps {
  onSelect: (flowerType: FlowerType) => void;
  onClose: () => void;
  onStartDrag?: (flowerType: FlowerType, e: React.MouseEvent | React.TouchEvent) => void;
  playerLevel?: number;
  onBatchPlant?: (flowerType: FlowerType) => void;
}

export const FlowerPicker: FC<FlowerPickerProps> = ({ onSelect, onClose, onStartDrag, playerLevel = 99, onBatchPlant }) => {
  const [selectedFlower, setSelectedFlower] = useState<FlowerType | null>(null);
  const [batchMode, setBatchMode] = useState(false);

  const handleClick = useCallback((flowerType: FlowerType) => {
    setSelectedFlower(flowerType);
    if (batchMode && onBatchPlant) {
      onBatchPlant(flowerType);
    } else {
      onSelect(flowerType);
    }
  }, [onSelect, batchMode, onBatchPlant]);

  const handleDragStart = useCallback((flowerType: FlowerType, e: React.MouseEvent | React.TouchEvent) => {
    // 一键种花模式下不拖拽，让 click 处理批量种植
    if (batchMode) return;
    // mousedown 时阻止后续 click
    if (!('touches' in e)) e.preventDefault();
    setSelectedFlower(flowerType);
    onStartDrag?.(flowerType, e);
    // 鼠标：立即关闭 picker；触摸：由 GameScene 在移动阈值后关闭
    if (!('touches' in e)) onClose();
  }, [onStartDrag, onClose, batchMode]);

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-modal picker-flower-modal" onClick={e => e.stopPropagation()}>
        <div className="picker-header">
          <h2 className="picker-title">选择花朵</h2>
          <span className="picker-hint">{batchMode ? '点击选择花朵，种满所有空盆' : '点击选择 / 拖拽直接播种'}</span>
        </div>
        <label className="batch-checkbox">
          <input
            type="checkbox"
            checked={batchMode}
            onChange={e => setBatchMode(e.target.checked)}
          />
          <span>一键种花（所有空盆）</span>
        </label>
        <div className="picker-grid">
          {flowers.map((flower) => {
            const ft = flower.id as FlowerType;
            const unlockLevel = getFlowerUnlockLevel(ft);
            const locked = playerLevel < unlockLevel;

            return (
              <button
                key={flower.id}
                className={`picker-flower-btn ${selectedFlower === flower.id ? 'selected' : ''} ${locked ? 'picker-locked' : ''}`}
                onClick={() => !locked && handleClick(flower.id)}
                onMouseDown={(e) => !locked && handleDragStart(flower.id, e)}
                onTouchStart={(e) => !locked && handleDragStart(flower.id, e)}
                disabled={locked}
              >
                <div
                  className="picker-flower-icon"
                  style={{ backgroundColor: locked ? '#ccc' : flower.color }}
                >
                  {locked ? '🔒' : flower.name.charAt(0)}
                </div>
                <span className="picker-flower-name">
                  {locked ? `Lv.${unlockLevel}解锁` : flower.name}
                </span>
              </button>
            );
          })}
        </div>
        <button className="picker-cancel" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
};
