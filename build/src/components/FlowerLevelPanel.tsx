import { FC } from 'react';
import { FlowerType, FlowerLevels } from '../types';
import { flowers, getLevelConfig, MAX_FLOWER_LEVEL } from '../data/flowers';

const CoinIcon: FC = () => <span className="inline-coin">$</span>;

interface FlowerLevelPanelProps {
  isOpen: boolean;
  onClose: () => void;
  flowerLevels: FlowerLevels;
  coins: number;
  onUpgrade: (flowerType: FlowerType) => boolean;
}

export const FlowerLevelPanel: FC<FlowerLevelPanelProps> = ({
  isOpen,
  onClose,
  flowerLevels,
  coins,
  onUpgrade,
}) => {
  if (!isOpen) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="flower-level-panel" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h3>⬆️ 花朵升级</h3>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body">
          {flowers.map(flower => {
            const level = flowerLevels[flower.id as FlowerType] || 1;
            const config = getLevelConfig(level);
            const isMax = level >= MAX_FLOWER_LEVEL;
            const canAfford = !isMax && coins >= config.upgradeCostCoins;

            return (
              <div key={flower.id} className="level-card">
                <div className="level-flower-info">
                  <img
                    src={flower.states.bloom}
                    alt={flower.name}
                    className="level-flower-icon"
                    draggable={false}
                  />
                  <div className="level-flower-name">{flower.name}</div>
                </div>
                <div className="level-stats">
                  <div className="level-badge">Lv.{level}</div>
                  <div className="level-detail">
                    收割{config.maxHarvests}次
                    {config.cooldownSeconds > 0 && ` / ${config.cooldownSeconds}s冷却`}
                  </div>
                </div>
                {isMax ? (
                  <div className="level-max-badge">MAX</div>
                ) : (
                  <button
                    className={`level-upgrade-btn ${canAfford ? '' : 'btn-disabled'}`}
                    disabled={!canAfford}
                    onClick={() => onUpgrade(flower.id as FlowerType)}
                  >
                    <CoinIcon />{config.upgradeCostCoins}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
