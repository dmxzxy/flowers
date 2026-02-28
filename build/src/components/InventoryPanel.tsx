import { FC } from 'react';
import { Inventory as InventoryType } from '../types';
import { flowers } from '../data/flowers';

interface InventoryPanelProps {
  inventory: InventoryType;
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryPanel: FC<InventoryPanelProps> = ({ inventory, isOpen, onClose }) => {
  if (!isOpen) return null;

  const gridItems = flowers.map(flower => ({
    ...flower,
    count: inventory.flowers[flower.id]
  }));

  return (
    <div className="inventory-overlay" onClick={onClose}>
      <div className="inventory-panel" onClick={e => e.stopPropagation()}>
        <div className="inventory-header">
          <div className="inventory-title">📦 仓库</div>
          <div className="inventory-total">总计: {inventory.total}</div>
          <button className="inventory-close" onClick={onClose}>×</button>
        </div>
        <div className="inventory-grid">
          {gridItems.map((item) => (
            <div 
              key={item.id} 
              className={`inventory-slot ${item.count > 0 ? 'has-item' : ''}`}
            >
              <div 
                className="slot-icon"
                style={{ backgroundColor: item.count > 0 ? item.color : 'transparent' }}
              >
                {item.count > 0 && item.name.charAt(0)}
              </div>
              <div className="slot-name">{item.name}</div>
              <div className="slot-count">{item.count > 0 ? `×${item.count}` : ''}</div>
            </div>
          ))}
          {/* 填充空格子 */}
          {Array.from({ length: 16 - gridItems.length }).map((_, i) => (
            <div key={`empty-${i}`} className="inventory-slot empty">
              <div className="slot-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
