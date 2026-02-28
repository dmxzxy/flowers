/**
 * 花盆皮肤选择面板
 */
import { FC } from 'react';
import { PotSkinId } from '../types';
import { POT_SKINS } from '../config';

const CoinIcon: FC = () => <span className="inline-coin">$</span>;

interface PotSkinPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeSkin: PotSkinId;
  isSkinUnlocked: (skinId: PotSkinId) => boolean;
  onSelectSkin: (skinId: PotSkinId) => void;
  onUnlockSkin: (skinId: PotSkinId) => boolean;
  coins: number;
}

export const PotSkinPanel: FC<PotSkinPanelProps> = ({
  isOpen,
  onClose,
  activeSkin,
  isSkinUnlocked,
  onSelectSkin,
  onUnlockSkin,
  coins,
}) => {
  if (!isOpen) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="pot-skin-panel" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h3>🪴 花盆皮肤</h3>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body pot-skin-grid">
          {POT_SKINS.map(skin => {
            const unlocked = isSkinUnlocked(skin.id);
            const isActive = activeSkin === skin.id;
            const canAfford = coins >= skin.unlockCost;

            return (
              <div
                key={skin.id}
                className={`pot-skin-card ${isActive ? 'skin-active' : ''} ${!unlocked ? 'skin-locked' : ''}`}
              >
                <div className="skin-preview">
                  <img src={skin.image} alt={skin.name} className="skin-pot-image" draggable={false} />
                  {isActive && <div className="skin-active-badge">使用中</div>}
                </div>
                <div className="skin-info">
                  <div className="skin-name">{skin.name}</div>
                  <div className="skin-desc">{skin.description}</div>
                </div>
                <div className="skin-action">
                  {unlocked ? (
                    isActive ? (
                      <div className="skin-equipped">✓ 已装备</div>
                    ) : (
                      <button className="skin-select-btn" onClick={() => onSelectSkin(skin.id)}>
                        装备
                      </button>
                    )
                  ) : (
                    <button
                      className={`skin-unlock-btn ${canAfford ? '' : 'btn-disabled'}`}
                      disabled={!canAfford}
                      onClick={() => onUnlockSkin(skin.id)}
                    >
                      <CoinIcon />{skin.unlockCost} 解锁
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
