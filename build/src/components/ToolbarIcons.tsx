/**
 * SVG 图标组件 — 替换 emoji 文字，用于工具栏按钮
 */
import { FC } from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/** 仓库 - 箱子图标 */
export const IconInventory: FC<IconProps> = ({ size = 22, color = '#8D6E63' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="20" height="14" rx="2" fill={color} opacity="0.85" />
    <rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M2 11h20" stroke="#5D4037" strokeWidth="1.2" />
    <rect x="9" y="9" width="6" height="4" rx="1" fill="#FFE0B2" stroke="#A1887F" strokeWidth="0.8" />
    <path d="M4 7L6 3h12l2 4" stroke={color} strokeWidth="1.5" fill="#A1887F" opacity="0.5" />
  </svg>
);

/** 采购任务 - 购物车图标 */
export const IconPurchase: FC<IconProps> = ({ size = 22, color = '#7B1FA2' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 3h2l1.5 2H20a1 1 0 0 1 .97 1.24l-1.8 7.2A1 1 0 0 1 18.2 14H8.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 5L8.5 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="9" cy="19" r="1.5" fill={color} />
    <circle cx="17" cy="19" r="1.5" fill={color} />
    <path d="M10 9h6" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

/** 收购订单 - 订单/清单图标 */
export const IconBuyOrders: FC<IconProps> = ({ size = 22, color = '#E65100' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" fill="#FFF3E0" stroke={color} strokeWidth="1.5" />
    <path d="M8 7h8M8 11h6M8 15h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 14l-1.5 1.5L16 17" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 2v2M17 2v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** 花朵图鉴 - 花朵图标 */
export const IconFlowerGuide: FC<IconProps> = ({ size = 22, color = '#EC407A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="10" r="3" fill="#FFD54F" />
    <ellipse cx="12" cy="5" rx="2.5" ry="3.5" fill={color} opacity="0.85" />
    <ellipse cx="12" cy="15" rx="2.5" ry="3.5" fill={color} opacity="0.85" />
    <ellipse cx="7" cy="10" rx="3.5" ry="2.5" fill={color} opacity="0.75" />
    <ellipse cx="17" cy="10" rx="3.5" ry="2.5" fill={color} opacity="0.75" />
    <ellipse cx="8.5" cy="6.5" rx="2.5" ry="3" fill={color} opacity="0.7" transform="rotate(-40 8.5 6.5)" />
    <ellipse cx="15.5" cy="6.5" rx="2.5" ry="3" fill={color} opacity="0.7" transform="rotate(40 15.5 6.5)" />
    <path d="M12 14v7" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 17c-2-1-3-3-3-3" stroke="#66BB6A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);

/** 花盆皮肤 - 花盆图标 */
export const IconPotSkins: FC<IconProps> = ({ size = 22, color = '#795548' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 10h12l-1.5 10a2 2 0 0 1-2 1.7H9.5a2 2 0 0 1-2-1.7L6 10z" fill="#D7CCC8" stroke={color} strokeWidth="1.5" />
    <rect x="5" y="8" width="14" height="3" rx="1" fill={color} opacity="0.8" />
    <path d="M10 5c0-2 4-2 4 0" stroke="#66BB6A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <circle cx="12" cy="4" r="1" fill="#E91E63" />
  </svg>
);

/** 成就 - 奖杯图标 */
export const IconAchievements: FC<IconProps> = ({ size = 22, color = '#F9A825' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M8 2h8v8a4 4 0 0 1-8 0V2z" fill={color} opacity="0.9" />
    <path d="M8 4H5a2 2 0 0 0 0 4h3" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M16 4h3a2 2 0 0 1 0 4h-3" stroke={color} strokeWidth="1.5" fill="none" />
    <rect x="10" y="14" width="4" height="3" rx="0.5" fill={color} opacity="0.7" />
    <rect x="7" y="17" width="10" height="3" rx="1.5" fill={color} opacity="0.8" />
    <circle cx="12" cy="7" r="1.5" fill="#FFF9C4" />
  </svg>
);

/** 个人中心 - 用户图标 */
export const IconProfile: FC<IconProps> = ({ size = 22, color = '#5C6BC0' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill={color} opacity="0.8" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" fill={color} opacity="0.5" />
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

/** 金币图标 */
export const IconCoin: FC<IconProps> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" fill="url(#coinGrad)" stroke="#B8860B" strokeWidth="1" />
    <circle cx="10" cy="10" r="6.5" stroke="#B8860B" strokeWidth="0.8" fill="none" opacity="0.4" />
    <text x="10" y="14" textAnchor="middle" fill="#8B6914" fontSize="10" fontWeight="bold" fontFamily="Arial">$</text>
    <defs>
      <linearGradient id="coinGrad" x1="2" y1="2" x2="18" y2="18">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="50%" stopColor="#FFD54F" />
        <stop offset="100%" stopColor="#FFB300" />
      </linearGradient>
    </defs>
  </svg>
);

/** 水滴图标 */
export const IconWater: FC<IconProps> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M10 2C10 2 4 9 4 13a6 6 0 0 0 12 0C16 9 10 2 10 2z" fill="url(#waterGrad)" stroke="#1976D2" strokeWidth="0.8" />
    <ellipse cx="8" cy="12" rx="1.5" ry="2" fill="rgba(255,255,255,0.4)" transform="rotate(-15 8 12)" />
    <defs>
      <linearGradient id="waterGrad" x1="4" y1="4" x2="16" y2="18">
        <stop offset="0%" stopColor="#81D4FA" />
        <stop offset="100%" stopColor="#42A5F5" />
      </linearGradient>
    </defs>
  </svg>
);

/** 头像 - 花园少女头像 */
export const AvatarIcon: FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* 圆形背景 */}
    <circle cx="20" cy="20" r="19" fill="url(#avatarBg)" stroke="#E8B4C0" strokeWidth="1.5" />
    {/* 头发 */}
    <ellipse cx="20" cy="16" rx="12" ry="11" fill="#5D4037" />
    <path d="M8 16c0 0 0 10 5 14" stroke="#4E342E" strokeWidth="1" fill="none" opacity="0.3" />
    <path d="M32 16c0 0 0 10 -5 14" stroke="#4E342E" strokeWidth="1" fill="none" opacity="0.3" />
    {/* 脸 */}
    <ellipse cx="20" cy="20" rx="9" ry="10" fill="#FFCCBC" />
    {/* 刘海 */}
    <path d="M10 14c2-4 6-6 10-6s8 2 10 6c-2-2-5-3-10-3s-8 1-10 3z" fill="#5D4037" />
    {/* 腮红 */}
    <ellipse cx="14" cy="23" rx="2.2" ry="1.4" fill="#F48FB1" opacity="0.4" />
    <ellipse cx="26" cy="23" rx="2.2" ry="1.4" fill="#F48FB1" opacity="0.4" />
    {/* 眼睛 */}
    <ellipse cx="15.5" cy="20" rx="1.3" ry="1.6" fill="#3E2723" />
    <ellipse cx="24.5" cy="20" rx="1.3" ry="1.6" fill="#3E2723" />
    <circle cx="15" cy="19.2" r="0.5" fill="white" />
    <circle cx="24" cy="19.2" r="0.5" fill="white" />
    {/* 微笑 */}
    <path d="M17 25c1.5 1.5 4.5 1.5 6 0" stroke="#5D4037" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    {/* 头花 */}
    <circle cx="28" cy="12" r="3" fill="#EC407A" opacity="0.9" />
    <circle cx="28" cy="12" r="1.2" fill="#FFD54F" />
    <circle cx="26" cy="10" r="1.5" fill="#F48FB1" opacity="0.7" />
    <circle cx="30" cy="11" r="1.2" fill="#F06292" opacity="0.7" />
    <defs>
      <linearGradient id="avatarBg" x1="2" y1="2" x2="38" y2="38">
        <stop offset="0%" stopColor="#FCE4EC" />
        <stop offset="100%" stopColor="#F8BBD0" />
      </linearGradient>
    </defs>
  </svg>
);
