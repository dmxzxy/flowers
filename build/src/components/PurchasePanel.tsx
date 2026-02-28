import { FC, useMemo, ReactNode } from 'react';
import { PurchaseTask, Inventory, Currency } from '../types';
import { purchaseTasks } from '../data/tasks';
import { flowers } from '../data/flowers';

const CoinIcon: FC = () => <span className="inline-coin">$</span>;

interface PurchasePanelProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Inventory;
  currency: Currency;
  canCompleteTask: (taskId: string) => boolean;
  onCompleteTask: (taskId: string) => boolean;
}

export const PurchasePanel: FC<PurchasePanelProps> = ({
  isOpen,
  onClose,
  inventory,
  currency,
  canCompleteTask,
  onCompleteTask,
}) => {
  if (!isOpen) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="purchase-panel" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h3>🛒 采购任务</h3>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body">
          {purchaseTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              canComplete={canCompleteTask(task.id)}
              onComplete={() => onCompleteTask(task.id)}
              inventory={inventory}
              currency={currency}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TaskCard: FC<{
  task: PurchaseTask;
  canComplete: boolean;
  onComplete: () => void;
  inventory: Inventory;
  currency: Currency;
}> = ({ task, canComplete, onComplete, inventory, currency }) => {
  const costParts = useMemo(() => {
    const parts: ReactNode[] = [];
    if (task.costFlowers) {
      for (const [fId, count] of Object.entries(task.costFlowers)) {
        const flowerCfg = flowers.find(f => f.id === fId);
        const name = flowerCfg?.name || fId;
        const have = inventory.flowers[fId as keyof typeof inventory.flowers] || 0;
        parts.push(`${name}×${count}(${have})`);
      }
    }
    if (task.costAnyFlowers) {
      parts.push(`任意花朵×${task.costAnyFlowers}(${inventory.total})`);
    }
    if (task.costCoins) {
      parts.push(<span key="coins"><CoinIcon />{task.costCoins}({currency.coins})</span>);
    }
    return parts;
  }, [task, inventory, currency]);

  const rewardParts = useMemo(() => {
    const parts: ReactNode[] = [];
    if (task.rewardCoins) parts.push(<span key="rc"><CoinIcon />{task.rewardCoins}</span>);
    if (task.rewardWater) parts.push(`💧${task.rewardWater}`);
    return parts;
  }, [task]);

  return (
    <div className={`task-card ${canComplete ? 'task-available' : 'task-locked'}`}>
      <div className="task-info">
        <div className="task-name">{task.name}</div>
        <div className="task-desc">{task.description}</div>
        <div className="task-cost">需要: {costParts.map((p, i) => <span key={i}>{i > 0 && ' + '}{p}</span>)}</div>
        <div className="task-reward">奖励: {rewardParts.map((p, i) => <span key={i}>{i > 0 && ' + '}{p}</span>)}</div>
      </div>
      <button
        className="task-btn"
        disabled={!canComplete}
        onClick={onComplete}
      >
        交付
      </button>
    </div>
  );
};
