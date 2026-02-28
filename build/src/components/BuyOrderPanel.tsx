/**
 * 收购订单面板（独立页面）
 * 显示最多3个累积的随机收购订单
 */
import { FC, useState, useEffect } from 'react';
import { BuyOrder, Inventory } from '../types';

const CoinIcon: FC = () => <span className="inline-coin">$</span>;

interface BuyOrderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  buyOrders: BuyOrder[];
  inventory: Inventory;
  onAccept: (orderId: number) => boolean;
  onDismiss: (orderId: number) => void;
}

export const BuyOrderPanel: FC<BuyOrderPanelProps> = ({
  isOpen,
  onClose,
  buyOrders,
  inventory,
  onAccept,
  onDismiss,
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
                currentStock={inventory.flowers[order.flowerType] || 0}
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

const BuyOrderCard: FC<{
  order: BuyOrder;
  currentStock: number;
  onAccept: () => void;
  onDismiss: () => void;
}> = ({ order, currentStock, onAccept, onDismiss }) => {
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

  const canAccept = currentStock >= order.amount;

  const handleAccept = () => {
    if (!canAccept) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    onAccept();
  };

  return (
    <div className={`order-card ${shaking ? 'buy-order-shake' : ''}`}>
      <div className="order-card-header">
        <span className="order-flower-name">{order.flowerName}</span>
        <span className="order-timer">⏱ {remainingSec}s</span>
      </div>
      <div className="order-card-body">
        <div className="order-demand">
          需要: <strong>{order.amount}</strong> 朵
          <span className={`order-stock ${canAccept ? 'stock-enough' : 'stock-short'}`}>
            (库存: {currentStock})
          </span>
        </div>
        <div className="order-price">
          报价: <CoinIcon /><strong>{order.totalPrice}</strong>
          <small> ({order.pricePerFlower}/朵)</small>
        </div>
      </div>
      <div className="order-card-actions">
        <button
          className={`order-accept-btn ${canAccept ? '' : 'btn-disabled'}`}
          onClick={handleAccept}
          disabled={!canAccept}
        >
          出售
        </button>
        <button className="order-dismiss-btn" onClick={onDismiss}>拒绝</button>
      </div>
    </div>
  );
};
