/**
 * 个人菜单面板
 * 显示玩家信息、存档状态，并提供清除存档功能
 */
import { FC, useState } from 'react';
import {
  PlayerLevelState,
  Currency,
  Inventory,
  FlowerSouls,
} from '../types';

const CoinIcon: FC = () => <span className="inline-coin">$</span>;

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  playerLevel: PlayerLevelState;
  currency: Currency;
  inventory: Inventory;
  flowerSouls: FlowerSouls;
  maxWater: number;
  saveInfo: { hasSave: boolean; savedAt: number | null };
  onSaveNow: () => void;
  onResetGame: () => void;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({
  isOpen,
  onClose,
  playerLevel,
  currency,
  inventory,
  flowerSouls,
  maxWater,
  saveInfo,
  onSaveNow,
  onResetGame,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const totalSouls = Object.values(flowerSouls).reduce((a, b) => a + b, 0);

  const formatTime = (ts: number | null) => {
    if (!ts) return '无';
    const d = new Date(ts);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    onResetGame();
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="profile-panel" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h3>👤 个人中心</h3>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body">
          {/* 玩家信息 */}
          <div className="profile-section">
            <div className="profile-section-title">🌟 玩家信息</div>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-label">等级</span>
                <span className="profile-value">Lv.{playerLevel.level}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">经验</span>
                <span className="profile-value">{playerLevel.xp}/{playerLevel.xpToNext || '已满'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">金币</span>
                <span className="profile-value"><CoinIcon />{currency.coins}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">水量</span>
                <span className="profile-value">💧{currency.water}/{maxWater}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">花朵库存</span>
                <span className="profile-value">🌸{inventory.total}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">花卉之魂</span>
                <span className="profile-value">✨{totalSouls}</span>
              </div>
            </div>
          </div>

          {/* 存档管理 */}
          <div className="profile-section">
            <div className="profile-section-title">💾 存档管理</div>
            <div className="profile-save-info">
              <div className="profile-save-row">
                <span className="profile-label">自动保存</span>
                <span className="profile-value profile-auto-save">✅ 已开启</span>
              </div>
              <div className="profile-save-row">
                <span className="profile-label">上次存档</span>
                <span className="profile-value">{formatTime(saveInfo.savedAt)}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="profile-btn profile-btn-save" onClick={onSaveNow}>
                💾 立即保存
              </button>
              <button
                className={`profile-btn profile-btn-delete ${showConfirm ? 'profile-btn-confirm' : ''}`}
                onClick={handleDelete}
              >
                {showConfirm ? '⚠️ 确认删除？不可恢复！' : '🗑️ 删除存档'}
              </button>
              {showConfirm && (
                <button
                  className="profile-btn profile-btn-cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  取消
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
