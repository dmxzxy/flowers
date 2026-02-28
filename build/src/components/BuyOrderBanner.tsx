import { FC, useState, useEffect } from 'react';
import { BuyOrder } from '../types';

interface BuyOrderBannerProps {
  order: BuyOrder;
  currentStock: number;
  onAccept: () => boolean;
  onDismiss: () => void;
}

export const BuyOrderBanner: FC<BuyOrderBannerProps> = ({
  order,
  currentStock,
  onAccept,
  onDismiss,
}) => {
  const [remainingSec, setRemainingSec] = useState(() =>
    Math.max(0, Math.ceil((order.expiresAt - Date.now()) / 1000))
  );
  const [shaking, setShaking] = useState(false);

  // 倒计时
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
    <div className={`buy-order-banner ${shaking ? 'buy-order-shake' : ''}`}>
      <div className="buy-order-timer">
        <span className="buy-order-timer-icon">⏱</span>
        <span>{remainingSec}s</span>
      </div>
      <div className="buy-order-content">
        <div className="buy-order-title">🛍️ 收购订单</div>
        <div className="buy-order-detail">
          收购 <strong>{order.amount}</strong> 朵<strong>{order.flowerName}</strong>
          <span className="buy-order-stock">
            (库存: {currentStock})
          </span>
        </div>
        <div className="buy-order-price">
          报价: <span className="inline-coin">$</span>
          <strong>{order.totalPrice}</strong>
          <span className="buy-order-unit">({order.pricePerFlower}/朵)</span>
        </div>
      </div>
      <div className="buy-order-actions">
        <button
          className={`buy-order-accept ${canAccept ? '' : 'btn-disabled'}`}
          onClick={handleAccept}
        >
          出售
        </button>
        <button className="buy-order-dismiss" onClick={onDismiss}>
          ✕
        </button>
      </div>
    </div>
  );
};
