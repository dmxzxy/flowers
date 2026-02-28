import { FC, useCallback } from 'react';
import { assets } from '../data/assets';

interface WaterPickerProps {
  onSelect: () => void;
  onClose: () => void;
  onStartDrag?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const WaterPicker: FC<WaterPickerProps> = ({ onSelect, onClose, onStartDrag }) => {
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onStartDrag?.(e);
    // 鼠标：立即关闭；触摸：由 GameScene 在移动阈值后关闭
    if (!('touches' in e)) onClose();
  }, [onStartDrag, onClose]);

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-modal picker-modal-small" onClick={(e) => e.stopPropagation()}>
        <h2 className="picker-title">选择操作</h2>
        <div className="picker-options">
          <button
            className="picker-option picker-option-water"
            onClick={onSelect}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <img
              src={assets.ui.water}
              alt="浇水"
              className="picker-icon picker-icon-water"
              draggable={false}
            />
            <span className="picker-name">浇水</span>
            <span className="picker-hint">点击 / 拖拽</span>
          </button>
        </div>
        <button className="picker-cancel" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
};
