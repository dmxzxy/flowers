import { FC, useEffect, useRef, useState } from 'react';
import {
  IconInventory,
  IconPurchase,
  IconBuyOrders,
  IconFlowerGuide,
  IconPotSkins,
  IconAchievements,
} from './ToolbarIcons';

interface ToolbarProps {
  onToggleInventory: () => void;
  inventoryTotal: number;
  onOpenPurchase: () => void;
  onOpenLevels: () => void;
  onOpenBuyOrders: () => void;
  buyOrderCount: number;
  buyOrderFulfillable: boolean;
  onOpenPotSkins: () => void;
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
    <div className="toolbar-float">
      {/* 左侧主要功能组：仓库 + 采购 + 收购 */}
      <div className="toolbar-group toolbar-group-main">
        <div
          className="toolbar-btn toolbar-btn-inventory"
          onClick={onToggleInventory}
          title="仓库"
        >
          <IconInventory size={20} />
          {inventoryTotal > 0 && (
            <span className="toolbar-badge">{inventoryTotal}</span>
          )}
        </div>
        <div
          className="toolbar-btn toolbar-btn-purchase"
          onClick={onOpenPurchase}
          title="采购任务"
        >
          <IconPurchase size={20} />
        </div>
        <div
          className={`toolbar-btn toolbar-btn-buyorders ${orderBounce ? 'toolbar-btn-bounce' : ''}`}
          onClick={onOpenBuyOrders}
          title="收购订单"
        >
          <IconBuyOrders size={20} />
          {buyOrderCount > 0 && (
            <span className="toolbar-badge">{buyOrderCount}</span>
          )}
          {buyOrderFulfillable && (
            <span className="toolbar-red-dot" />
          )}
        </div>
      </div>

      {/* 右侧辅助功能组：图鉴 + 花盆 + 成就 */}
      <div className="toolbar-group toolbar-group-aux">
        <div
          className="toolbar-btn toolbar-btn-levels"
          onClick={onOpenLevels}
          title="花朵图鉴"
        >
          <IconFlowerGuide size={20} />
        </div>
        <div
          className="toolbar-btn toolbar-btn-potskins"
          onClick={onOpenPotSkins}
          title="花盆皮肤"
        >
          <IconPotSkins size={20} />
        </div>
        <div
          className="toolbar-btn toolbar-btn-achievements"
          onClick={onOpenAchievements}
          title="成就"
        >
          <IconAchievements size={20} />
          {achievementUnclaimedCount > 0 && (
            <span className="toolbar-badge">{achievementUnclaimedCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};
