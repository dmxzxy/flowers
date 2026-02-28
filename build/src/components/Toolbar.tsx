import { FC, useEffect, useRef, useState } from 'react';

interface ToolbarProps {
  onToggleInventory: () => void;
  inventoryTotal: number;
  onOpenPurchase: () => void;
  onOpenLevels: () => void;
  onOpenBuyOrders: () => void;
  buyOrderCount: number;
  buyOrderFulfillable: boolean;
  onOpenPotSkins: () => void;
  onOpenProfile: () => void;
  onOpenAchievements: () => void;
  achievementUnclaimedCount: number;
}

export const Toolbar: FC<ToolbarProps> = ({
  onToggleInventory,
  inventoryTotal,
  onOpenPurchase,
  onOpenLevels,
  onOpenBuyOrders,
  buyOrderCount,
  buyOrderFulfillable,
  onOpenPotSkins,
  onOpenProfile,
  onOpenAchievements,
  achievementUnclaimedCount,
}) => {
  // 新订单到达时按钮弹跳动画
  const prevCountRef = useRef(buyOrderCount);
  const [orderBounce, setOrderBounce] = useState(false);

  useEffect(() => {
    if (buyOrderCount > prevCountRef.current) {
      setOrderBounce(true);
      const timer = setTimeout(() => setOrderBounce(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = buyOrderCount;
  }, [buyOrderCount]);

  useEffect(() => {
    prevCountRef.current = buyOrderCount;
  }, [buyOrderCount]);

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
          className={`toolbar-tool toolbar-tool-buyorders ${orderBounce ? 'toolbar-tool-bounce' : ''}`}
          onClick={onOpenBuyOrders}
          title="收购订单"
        >
          <span className="toolbar-icon">🛍️</span>
          {buyOrderCount > 0 && (
            <span className="toolbar-badge">{buyOrderCount}</span>
          )}
          {buyOrderFulfillable && (
            <span className="toolbar-red-dot" />
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
          className="toolbar-tool toolbar-tool-achievements"
          onClick={onOpenAchievements}
          title="成就"
        >
          <span className="toolbar-icon">🏆</span>
          {achievementUnclaimedCount > 0 && (
            <span className="toolbar-badge">{achievementUnclaimedCount}</span>
          )}
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
