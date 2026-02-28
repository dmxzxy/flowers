import { FC, useMemo, ReactNode, useState, useEffect } from 'react';
import { PurchaseTask, Inventory, Currency, FlowerType } from '../types';
import { flowers } from '../data/flowers';

const CoinIcon: FC = () => <span className="inline-coin">$</span>;

interface PurchasePanelProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Inventory;
  currency: Currency;
  tasks: PurchaseTask[];
  canCompleteTask: (taskId: string) => boolean;
  onCompleteTask: (taskId: string) => boolean;
  isTaskOnCooldown: (taskId: string) => boolean;
  getTaskCooldownRemaining: (taskId: string) => number;
  onRefreshTasks: () => void;
}

export const PurchasePanel: FC<PurchasePanelProps> = ({
  isOpen,
  onClose,
  inventory,
  currency: _currency,
  tasks,
  canCompleteTask,
  onCompleteTask,
  isTaskOnCooldown,
  getTaskCooldownRemaining,
  onRefreshTasks,
}) => {
  if (!isOpen) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="purchase-panel" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h3>🛒 采购任务</h3>
          <div className="panel-header-actions">
            <button className="refresh-tasks-btn" onClick={onRefreshTasks}>🔄 刷新</button>
            <button className="panel-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="panel-body">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              canComplete={canCompleteTask(task.id)}
              onComplete={() => onCompleteTask(task.id)}
              inventory={inventory}
              onCooldown={isTaskOnCooldown(task.id)}
              cooldownRemaining={getTaskCooldownRemaining(task.id)}
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
  onCooldown: boolean;
  cooldownRemaining: number;
}> = ({ task, canComplete, onComplete, inventory, onCooldown, cooldownRemaining }) => {
  const [cdSec, setCdSec] = useState(0);

  useEffect(() => {
    if (!onCooldown) { setCdSec(0); return; }
    const updateCd = () => setCdSec(Math.ceil(cooldownRemaining / 1000));
    updateCd();
    const timer = setInterval(updateCd, 1000);
    return () => clearInterval(timer);
  }, [onCooldown, cooldownRemaining]);

  const costParts = useMemo(() => {
    const parts: ReactNode[] = [];
    if (task.costFlowers) {
      for (const [fId, count] of Object.entries(task.costFlowers)) {
        const flowerCfg = flowers.find(f => f.id === fId);
        const name = flowerCfg?.name || fId;
        const have = inventory.flowers[fId as FlowerType] || 0;
        const enough = have >= (count || 0);
        parts.push(
          <span key={fId} className={enough ? 'cost-enough' : 'cost-short'}>
            {name}×{count}<small>({have})</small>
          </span>
        );
      }
    }
    return parts;
  }, [task, inventory]);

  const rewardParts = useMemo(() => {
    const parts: ReactNode[] = [];
    if (task.rewardCoins) parts.push(<span key="rc"><CoinIcon />{task.rewardCoins}</span>);
    if (task.rewardXp) parts.push(<span key="xp">⭐{task.rewardXp} XP</span>);
    return parts;
  }, [task]);

  return (
    <div className={`task-card ${canComplete ? 'task-available' : 'task-locked'} ${onCooldown ? 'task-cooldown' : ''}`}>
      <div className="task-info">
        <div className="task-name">{task.name}</div>
        <div className="task-cost">需要: {costParts.map((p, i) => <span key={i}>{i > 0 && ' + '}{p}</span>)}</div>
        <div className="task-reward">奖励: {rewardParts.map((p, i) => <span key={i}>{i > 0 && ' + '}{p}</span>)}</div>
      </div>
      {onCooldown ? (
        <div className="task-cd-badge">⏱ {cdSec}s</div>
      ) : (
        <button
          className="task-btn"
          disabled={!canComplete}
          onClick={onComplete}
        >
          交付
        </button>
      )}
    </div>
  );
};
