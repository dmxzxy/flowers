import { FC, memo, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ACHIEVEMENT_DEFS,
  ACHIEVEMENT_CATEGORIES,
  AchievementCategory,
  getAchievementDef,
} from '../config/achievement.config';
import { getFlowerConfig } from '../config/flower.config';
import type { AchievementStats } from '../hooks/useAchievements';
import type { AchievementId } from '../config/achievement.config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unlocked: AchievementId[];
  claimed: AchievementId[];
  stats: AchievementStats;
  onClaim: (id: AchievementId) => void;
}

export const AchievementPanel: FC<Props> = memo(({
  isOpen,
  onClose,
  unlocked,
  claimed,
  stats,
  onClaim,
}) => {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  /** 正在播放领取动画的成就 ID */
  const [claimingId, setClaimingId] = useState<AchievementId | null>(null);
  /** 刚完成领取动画的成就（短暂高亮） */
  const [justClaimedId, setJustClaimedId] = useState<AchievementId | null>(null);
  const claimTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const filtered = useMemo(() => {
    const base = activeCategory === 'all'
      ? ACHIEVEMENT_DEFS
      : ACHIEVEMENT_DEFS.filter(a => a.category === activeCategory);
    // 排序：可领取 > 已解锁未领取 > 已领取 > 未解锁
    return [...base].sort((a, b) => {
      const aUnlocked = unlocked.includes(a.id);
      const bUnlocked = unlocked.includes(b.id);
      const aClaimed = claimed.includes(a.id);
      const bClaimed = claimed.includes(b.id);
      const aCanClaim = aUnlocked && !aClaimed;
      const bCanClaim = bUnlocked && !bClaimed;
      if (aCanClaim !== bCanClaim) return aCanClaim ? -1 : 1;
      if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;
      return 0;
    });
  }, [activeCategory, unlocked, claimed]);

  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENT_DEFS.length;

  /** 领取动画 → 延迟后真正领取 */
  const handleClaim = useCallback((id: AchievementId) => {
    if (claimingId) return; // 避免重复
    setClaimingId(id);
    clearTimeout(claimTimerRef.current);
    claimTimerRef.current = setTimeout(() => {
      onClaim(id);
      setClaimingId(null);
      setJustClaimedId(id);
      // 高亮一段时间后清除
      setTimeout(() => setJustClaimedId(null), 1200);
    }, 600);
  }, [claimingId, onClaim]);

  // 清除计时器
  useEffect(() => () => clearTimeout(claimTimerRef.current), []);

  if (!isOpen) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="achievement-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="achievement-header">
          <div className="achievement-title">
            🏆 成就
            <span className="achievement-counter">{unlockedCount} / {totalCount}</span>
          </div>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        {/* Stats Bar */}
        <div className="achievement-stats">
          <div className="achievement-stat">
            <span className="achievement-stat-icon">🌱</span>
            <span className="achievement-stat-val">{stats.totalPlanted}</span>
            <span className="achievement-stat-label">播种</span>
          </div>
          <div className="achievement-stat">
            <span className="achievement-stat-icon">🌸</span>
            <span className="achievement-stat-val">{stats.totalHarvested}</span>
            <span className="achievement-stat-label">收获</span>
          </div>
          <div className="achievement-stat">
            <span className="achievement-stat-icon">💰</span>
            <span className="achievement-stat-val">{formatNumber(stats.totalCoinsEarned)}</span>
            <span className="achievement-stat-label">金币</span>
          </div>
          <div className="achievement-stat">
            <span className="achievement-stat-icon">📜</span>
            <span className="achievement-stat-val">{stats.totalOrdersCompleted}</span>
            <span className="achievement-stat-label">订单</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="achievement-tabs">
          <button
            className={`achievement-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            全部
          </button>
          {ACHIEVEMENT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`achievement-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="achievement-grid">
          {filtered.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            const isClaimed = claimed.includes(ach.id);
            const canClaim = isUnlocked && !isClaimed;
            const isHidden = ach.hidden && !isUnlocked;
            const isClaiming = claimingId === ach.id;
            const isJustClaimed = justClaimedId === ach.id;

            return (
              <div
                key={ach.id}
                className={[
                  'achievement-card',
                  isUnlocked ? 'unlocked' : 'locked',
                  isClaimed ? 'claimed' : '',
                  isClaiming ? 'claiming' : '',
                  isJustClaimed ? 'just-claimed' : '',
                  canClaim ? 'can-claim' : '',
                ].filter(Boolean).join(' ')}
              >
                <div className="achievement-card-icon">
                  {isHidden ? '❓' : ach.icon}
                </div>
                <div className="achievement-card-info">
                  <div className="achievement-card-name">
                    {isHidden ? '???' : ach.name}
                  </div>
                  <div className="achievement-card-desc">
                    {isHidden ? '达成后揭晓' : ach.description}
                  </div>
                  {!isHidden && (
                    <div className="achievement-card-reward">
                      {ach.rewardFlower ? (
                        <>
                          <span className="reward-flower-tag">🌺 解锁「{getFlowerConfig(ach.rewardFlower)?.name ?? ach.rewardFlower}」</span>
                          {ach.rewardCoins > 0 && <span className="reward-coins-tag">💰 {ach.rewardCoins}</span>}
                        </>
                      ) : (
                        <span className="reward-coins-tag">💰 {ach.rewardCoins} 金币</span>
                      )}
                    </div>
                  )}
                </div>
                {canClaim && !isClaiming && (
                  <button
                    className="achievement-claim-btn"
                    onClick={() => handleClaim(ach.id)}
                  >
                    领取
                  </button>
                )}
                {/* 领取动画中的光效 */}
                {isClaiming && (
                  <div className="achievement-claim-anim">
                    <span className="claim-sparkle">✨</span>
                    <span className="claim-sparkle s2">💫</span>
                    <span className="claim-sparkle s3">⭐</span>
                  </div>
                )}
                {isClaimed && !isJustClaimed && (
                  <div className="achievement-claimed-badge">✓</div>
                )}
                {isJustClaimed && (
                  <div className="achievement-claimed-badge just-claimed-badge">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

AchievementPanel.displayName = 'AchievementPanel';

/** Achievement toast notification */
export const AchievementToastUI: FC<{
  achievementId: AchievementId;
  onDismiss: () => void;
}> = memo(({ achievementId, onDismiss }) => {
  const def = getAchievementDef(achievementId);
  if (!def) return null;

  const flowerName = def.rewardFlower ? getFlowerConfig(def.rewardFlower)?.name : null;

  return (
    <div className="achievement-toast" onAnimationEnd={onDismiss}>
      <div className="achievement-toast-icon">{def.icon}</div>
      <div className="achievement-toast-text">
        <div className="achievement-toast-label">🏆 成就达成！</div>
        <div className="achievement-toast-name">{def.name}</div>
        <div className="achievement-toast-reward">
          {flowerName
            ? <span>🌺 解锁「{flowerName}」</span>
            : <span>💰 +{def.rewardCoins} 金币</span>
          }
        </div>
      </div>
    </div>
  );
});

AchievementToastUI.displayName = 'AchievementToastUI';

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}
