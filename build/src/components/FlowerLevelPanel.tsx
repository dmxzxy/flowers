import { FC, useState } from 'react';
import { FlowerType, FlowerLevels, FlowerSouls } from '../types';
import { flowers, getLevelConfig, MAX_FLOWER_LEVEL, getFlowerPrice } from '../data/flowers';

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
  const [selectedId, setSelectedId] = useState<FlowerType>('rose');

  if (!isOpen) return null;

  const selected = flowers.find(f => f.id === selectedId) || flowers[0];
  const ft = selected.id as FlowerType;
  const level = flowerLevels[ft] || 1;
  const config = getLevelConfig(level);
  const isMax = level >= MAX_FLOWER_LEVEL;
  const souls = flowerSouls[ft] || 0;
  const canAfford = !isMax
    && coins >= config.upgradeCostCoins
    && souls >= config.upgradeCostSouls;
  const progressPct = ((level - 1) / (MAX_FLOWER_LEVEL - 1)) * 100;
  const stageColor = getStageColor(level);
  const price = getFlowerPrice(ft);

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="fp-panel" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h3>🌸 花朵图鉴</h3>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="fp-body">
          {/* 左侧：花朵列表 */}
          <div className="fp-list">
            {flowers.map(flower => {
              const fLevel = flowerLevels[flower.id as FlowerType] || 1;
              const fStageColor = getStageColor(fLevel);
              return (
                <button
                  key={flower.id}
                  className={`fp-list-item ${flower.id === selectedId ? 'fp-list-active' : ''}`}
                  onClick={() => setSelectedId(flower.id as FlowerType)}
                >
                  <img src={flower.states.bloom} alt={flower.name} className="fp-list-icon" draggable={false} />
                  <div className="fp-list-info">
                    <span className="fp-list-name">{flower.name}</span>
                    <span className="fp-list-lv" style={{ color: fStageColor }}>Lv.{fLevel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 右侧：花朵详情 */}
          <div className="fp-detail">
            {/* 大图 */}
            <div className="fp-bloom-wrap">
              <img
                src={selected.states.bloom}
                alt={selected.name}
                className="fp-bloom-img"
                draggable={false}
              />
            </div>

            {/* 名称 + 等级 */}
            <div className="fp-name-row">
              <span className="fp-name">{selected.name}</span>
              <span className="fp-lv-badge" style={{ color: stageColor }}>Lv.{level}</span>
              <span className="fp-stage-tag" style={{ background: stageColor }}>{getStageName(level)}</span>
            </div>

            {/* 进度条 */}
            <div className="level-progress-bar" style={{ marginBottom: 10 }}>
              <div className="level-progress-fill" style={{ width: `${progressPct}%`, background: stageColor }} />
              <span className="level-progress-text">{level}/{MAX_FLOWER_LEVEL}</span>
            </div>

            {/* 属性 */}
            <div className="fp-attrs">
              <div className="fp-attr">
                <span className="fp-attr-icon">🌾</span>
                <span className="fp-attr-label">收割次数</span>
                <span className="fp-attr-val">{config.maxHarvests}</span>
              </div>
              <div className="fp-attr">
                <span className="fp-attr-icon">🌸</span>
                <span className="fp-attr-label">每次产量</span>
                <span className="fp-attr-val">×{config.yieldPerHarvest}</span>
              </div>
              <div className="fp-attr">
                <span className="fp-attr-icon">⏱️</span>
                <span className="fp-attr-label">冷却时间</span>
                <span className="fp-attr-val">{config.cooldownSeconds > 0 ? `${config.cooldownSeconds}s` : '无'}</span>
              </div>
              <div className="fp-attr">
                <span className="fp-attr-icon">💰</span>
                <span className="fp-attr-label">单价</span>
                <span className="fp-attr-val">{price}</span>
              </div>
              <div className="fp-attr">
                <span className="fp-attr-icon">👻</span>
                <span className="fp-attr-label">持有魂</span>
                <span className="fp-attr-val">{souls}</span>
              </div>
            </div>

            {/* 升级区域 */}
            <div className="fp-upgrade-area">
              {isMax ? (
                <div className="level-max-badge">✨ 已满级</div>
              ) : (
                <>
                  {config.upgradeLabel && (
                    <div className="fp-next-hint">下一级: {config.upgradeLabel}</div>
                  )}
                  <button
                    className={`fp-upgrade-btn ${canAfford ? '' : 'btn-disabled'}`}
                    disabled={!canAfford}
                    onClick={() => onUpgrade(ft, coins, souls)}
                  >
                    升级 <SoulIcon />{config.upgradeCostSouls} <CoinIcon />{config.upgradeCostCoins}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
