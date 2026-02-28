import { FC } from 'react';

interface ToolbarProps {
  onToggleInventory: () => void;
  inventoryTotal: number;
  onOpenPurchase: () => void;
  onOpenLevels: () => void;
  onOpenBuyOrders: () => void;
  buyOrderCount: number;
  onOpenPotSkins: () => void;
  onOpenProfile: () => void;
}

export const Toolbar: FC<ToolbarProps> = ({
  onToggleInventory,
  inventoryTotal,
  onOpenPurchase,
  onOpenLevels,
  onOpenBuyOrders,
  buyOrderCount,
  onOpenPotSkins,
  onOpenProfile,
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
          className="toolbar-tool toolbar-tool-buyorders"
          onClick={onOpenBuyOrders}
          title="收购订单"
        >
          <span className="toolbar-icon">🛍️</span>
          {buyOrderCount > 0 && (
            <span className="toolbar-badge">{buyOrderCount}</span>
          )}
        </div>
        <div
          className="toolbar-tool toolbar-tool-levels"
          onClick={onOpenLevels}
          title="花朵图鉴"
        >
          <span className="toolbar-icon">🌸</span>
        </div>
        <div
          className="toolbar-tool toolbar-tool-potskins"
          onClick={onOpenPotSkins}
          title="花盆皮肤"
        >
          <span className="toolbar-icon">🪴</span>
        </div>
        <div
          className="toolbar-tool toolbar-tool-profile"
          onClick={onOpenProfile}
          title="个人中心"
        >
          <span className="toolbar-icon">👤</span>
        </div>
      </div>
    </div>
  );
};
