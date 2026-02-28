import { FC } from 'react';

interface ToolbarProps {
  onToggleInventory: () => void;
  inventoryTotal: number;
  onOpenPurchase: () => void;
  onOpenLevels: () => void;
}

export const Toolbar: FC<ToolbarProps> = ({
  onToggleInventory,
  inventoryTotal,
  onOpenPurchase,
  onOpenLevels,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <div
          className="toolbar-tool toolbar-tool-inventory"
          onClick={onToggleInventory}
          title="仓库"
        >
          <span className="toolbar-icon">📦</span>
          {inventoryTotal > 0 && (
            <span className="toolbar-badge">{inventoryTotal}</span>
          )}
        </div>
        <div
          className="toolbar-tool toolbar-tool-purchase"
          onClick={onOpenPurchase}
          title="采购任务"
        >
          <span className="toolbar-icon">🛒</span>
        </div>
        <div
          className="toolbar-tool toolbar-tool-levels"
          onClick={onOpenLevels}
          title="花朵升级"
        >
          <span className="toolbar-icon">⬆️</span>
        </div>
      </div>
    </div>
  );
};
