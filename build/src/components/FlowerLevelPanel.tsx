import { FC } from 'react';
import { FlowerType, FlowerLevels, FlowerSouls } from '../types';
import { flowers, getLevelConfig, MAX_FLOWER_LEVEL } from '../data/flowers';

const CoinIcon: FC = () => <span className="inline-coin">$</span>;
const SoulIcon: FC = () => <span className="inline-soul">👻</span>;

/** 等级阶段名称 */
const getStageName = (level: number): string => {
  if (level <= 5) return '基础';
  if (level <= 10) return '成长';
  if (level <= 15) return '精通';
  return '大师';
};
const getStageColor = (level: number): string => {
  if (level <= 5) return '#8BC34A';
  if (level <= 10) return '#42A5F5';
  if (level <= 15) return '#AB47BC';
  return '#FF6F00';
};

interface FlowerLevelPanelProps {
  isOpen: boolean;
  onClose: () => void;
  flowerLevels: FlowerLevels;
  flowerSouls: FlowerSouls;
  coins: number;
  onUpgrade: (flowerType: FlowerType, coins: number, souls: number) => boolean;
}

export const FlowerLevelPanel: FC<FlowerLevelPanelProps> = ({
  isOpen,
  onClose,
  flowerLevels,
  flowerSouls,
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
            const ft = flower.id as FlowerType;
            const level = flowerLevels[ft] || 1;
            const config = getLevelConfig(level);
            const isMax = level >= MAX_FLOWER_LEVEL;
            const souls = flowerSouls[ft] || 0;
            const canAfford = !isMax
              && coins >= config.upgradeCostCoins
              && souls >= config.upgradeCostSouls;

            const progressPct = ((level - 1) / (MAX_FLOWER_LEVEL - 1)) * 100;
            const stageColor = getStageColor(level);

            return (
              <div key={flower.id} className="level-card">
                {/* 左侧：花朵图标 + 名称 + 魂数 */}
                <div className="level-flower-info">
                  <img
                    src={flower.states.bloom}
                    alt={flower.name}
                    className="level-flower-icon"
                    draggable={false}
                  />
                  <div className="level-flower-name">{flower.name}</div>
                  <div className="level-soul-count">
                    <SoulIcon /> {souls}
                  </div>
                </div>

                {/* 中间：等级信息 + 进度条 */}
                <div className="level-stats">
                  <div className="level-header-row">
                    <span className="level-badge" style={{ color: stageColor }}>
                      Lv.{level}
                    </span>
                    <span className="level-stage" style={{ background: stageColor }}>
                      {getStageName(level)}
                    </span>
                  </div>
                  {/* 经验进度条 */}
                  <div className="level-progress-bar">
                    <div
                      className="level-progress-fill"
                      style={{ width: `${progressPct}%`, background: stageColor }}
                    />
                    <span className="level-progress-text">{level}/{MAX_FLOWER_LEVEL}</span>
                  </div>
                  <div className="level-detail">
                    <span>🌾{config.maxHarvests}次</span>
                    <span>🌸×{config.yieldPerHarvest}</span>
                    {config.cooldownSeconds > 0 && <span>⏱{config.cooldownSeconds}s</span>}
                  </div>
                  {!isMax && config.upgradeLabel && (
                    <div className="level-next-hint">
                      下一级: {config.upgradeLabel}
                    </div>
                  )}
                </div>

                {/* 右侧：升级按钮或 MAX */}
                {isMax ? (
                  <div className="level-max-badge">✨ MAX</div>
                ) : (
                  <button
                    className={`level-upgrade-btn ${canAfford ? '' : 'btn-disabled'}`}
                    disabled={!canAfford}
                    onClick={() => onUpgrade(ft, coins, souls)}
                  >
                    <div className="upgrade-cost-line"><SoulIcon />{config.upgradeCostSouls}</div>
                    <div className="upgrade-cost-line"><CoinIcon />{config.upgradeCostCoins}</div>
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
