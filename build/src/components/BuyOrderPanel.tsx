/**
 * 收购订单面板（独立页面）
 * 显示最多3个累积的随机收购订单，支持多花种
 */
import { FC, useState, useEffect } from 'react';
import { BuyOrder, Inventory, FlowerType } from '../types';
import { flowers as flowerConfigs } from '../config';

const CoinIcon: FC = () => <span className="inline-coin">$</span>;

interface BuyOrderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  buyOrders: BuyOrder[];
  inventory: Inventory;
  onAccept: (orderId: number) => boolean;
  onDismiss: (orderId: number) => void;
  canFulfillOrder: (order: BuyOrder, inventory: Inventory) => boolean;
}

export const BuyOrderPanel: FC<BuyOrderPanelProps> = ({
  isOpen,
  onClose,
  buyOrders,
  inventory,
  onAccept,
  onDismiss,
  canFulfillOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="buy-order-panel" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h3>🛍️ 收购订单</h3>
          <div className="panel-header-actions">
            <span className="order-slot-count">{buyOrders.length}/3</span>
            <button className="panel-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="panel-body">
          {buyOrders.length === 0 ? (
            <div className="empty-orders">暂无订单，稍后会自动刷新...</div>
          ) : (
            buyOrders.map(order => (
              <BuyOrderCard
                key={order.id}
                order={order}
                inventory={inventory}
                canFulfill={canFulfillOrder(order, inventory)}
                onAccept={() => onAccept(order.id)}
                onDismiss={() => onDismiss(order.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/** 获取花朵名称 */
const getFlowerName = (ft: FlowerType): string => {
  return flowerConfigs.find(f => f.id === ft)?.name ?? ft;
};

const BuyOrderCard: FC<{
  order: BuyOrder;
  inventory: Inventory;
  canFulfill: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}> = ({ order, inventory, canFulfill, onAccept, onDismiss }) => {
  const [remainingSec, setRemainingSec] = useState(() =>
    Math.max(0, Math.ceil((order.expiresAt - Date.now()) / 1000))
  );
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const sec = Math.max(0, Math.ceil((order.expiresAt - Date.now()) / 1000));
      setRemainingSec(sec);
      if (sec <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [order.expiresAt]);

  const handleAccept = () => {
    if (!canFulfill) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    onAccept();
  };

  const flowerEntries = Object.entries(order.costFlowers) as [FlowerType, number][];
  const isMulti = flowerEntries.length > 1;

  return (
    <div className={`order-card ${shaking ? 'buy-order-shake' : ''} ${canFulfill ? 'order-card-ready' : ''}`}>
      <div className="order-card-header">
        <span className="order-flower-name">{order.description}</span>
        <span className="order-timer">⏱ {remainingSec}s</span>
      </div>
      <div className="order-card-body">
        <div className="order-demand-list">
          {flowerEntries.map(([ft, need]) => {
            const stock = inventory.flowers[ft] || 0;
            const enough = stock >= need;
            return (
              <div key={ft} className="order-demand-row">
                <span className="order-demand-name">{getFlowerName(ft)}</span>
                <span className="order-demand-need">×{need}</span>
                <span className={`order-stock ${enough ? 'stock-enough' : 'stock-short'}`}>
                  (库存: {stock})
                </span>
              </div>
            );
          })}
        </div>
        <div className="order-price">
          报价: <CoinIcon /><strong>{order.totalPrice}</strong>
          {isMulti && <small className="order-multi-tag">📦 组合订单</small>}
        </div>
      </div>
      <div className="order-card-actions">
        <button
          className={`order-accept-btn ${canFulfill ? '' : 'btn-disabled'}`}
          onClick={handleAccept}
          disabled={!canFulfill}
        >
          出售
        </button>
        <button className="order-dismiss-btn" onClick={onDismiss}>拒绝</button>
      </div>
    </div>
  );
};
