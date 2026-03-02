/**
 * 全局游戏配置
 * 所有可调数值集中在此，方便策划调整
 * ⚠️ 由配置编辑器生成，请勿手动修改
 */

// ==================== 花盆网格 ====================
/** 花盆列数 */
export const GRID_COLS = 4;
/** 花盆行数 */
export const GRID_ROWS = 7;
/** 花盆总数 */
export const GRID_TOTAL = GRID_COLS * GRID_ROWS;

// ==================== 花盆分排解锁 ====================
/** 每排花盆的解锁条件：所需玩家等级 + 每个花盆的购买价格 */
export interface PotRowConfig {
  row: number;
  /** 该排可见/可购买的最低玩家等级 */
  requiredLevel: number;
  /** 每个花盆的购买价格（0 = 免费自动解锁） */
  costPerPot: number;
}

export const POT_ROW_UNLOCKS: PotRowConfig[] = [
  { row: 0, requiredLevel: 1,  costPerPot: 0 },
  { row: 1, requiredLevel: 3,  costPerPot: 100 },
  { row: 2, requiredLevel: 5,  costPerPot: 300 },
  { row: 3, requiredLevel: 7,  costPerPot: 600 },
  { row: 4, requiredLevel: 9,  costPerPot: 1200 },
  { row: 5, requiredLevel: 12, costPerPot: 2500 },
  { row: 6, requiredLevel: 15, costPerPot: 5000 },
];

/** 获取某排花盆的配置 */
export const getPotRowConfig = (row: number): PotRowConfig =>
  POT_ROW_UNLOCKS[row] ?? POT_ROW_UNLOCKS[0];

/** 初始免费解锁的花盆 ID 列表（costPerPot === 0 的行） */
export const INITIAL_UNLOCKED_POTS: number[] = POT_ROW_UNLOCKS
  .filter(r => r.costPerPot === 0)
  .flatMap(r => Array.from({ length: GRID_COLS }, (_, c) => r.row * GRID_COLS + c));

// ==================== 货币：水量 ====================
/** 初始水量 */
export const INITIAL_WATER = 100;
/** 水量上限 */
export const MAX_WATER = 100;
/** 水量自动恢复间隔（毫秒） */
export const WATER_REGEN_INTERVAL_MS = 10000;
/** 每次恢复水量 */
export const WATER_REGEN_AMOUNT = 1;
/** 浇水消耗水量 */
export const WATER_COST_PER_USE = 1;
/** 水不足警告持续时间（毫秒） */
export const NO_WATER_WARNING_MS = 2000;

// ==================== 货币：金币 ====================
/** 初始金币 */
export const INITIAL_COINS = 0;

// ==================== 收购订单 ====================
/** 收购订单生成间隔（毫秒） */
export const BUY_ORDER_INTERVAL_MS = 45000;
/** 收购订单有效期（毫秒） */
export const BUY_ORDER_DURATION_MS = 60000;
/** 首次收购订单延迟（毫秒） */
export const BUY_ORDER_FIRST_DELAY_MS = 10000;
/** 收购数量区间 [min, max]（更大量） */
export const BUY_ORDER_AMOUNT_RANGE: [number, number] = [3, 10];
/** 收购单价加成倍率（基于花朵 basePrice） */
export const BUY_ORDER_PRICE_MULTIPLIER: [number, number] = [1.5, 2.5];
/** 最大同时存在的收购订单数 */
export const BUY_ORDER_MAX_SLOTS = 3;

// ==================== 拖拽 ====================
/** 触摸拖拽判定阈值（px） */
export const DRAG_THRESHOLD_PX = 8;

// ==================== 生长阶段 ====================
/** 浇水后嫩芽生长时间（毫秒），生长结束后进入开花状态 */
export const GROWING_DURATION_MS = 5000;

// ==================== 花盆皮肤 ====================
import { PotSkinConfig } from '../types';

export const POT_SKINS: PotSkinConfig[] = [
  {
    id: 'default',
    name: '经典赤陶',
    description: '经典的赤陶花盆，温暖朴素',
    image: '/art/pot/pot_default.svg',
    unlockCost: 0,
  },
  {
    id: 'ceramic_blue',
    name: '青花瓷盆',
    description: '典雅的青花瓷花盆，别具一格',
    image: '/art/pot/pot_ceramic_blue.svg',
    unlockCost: 500,
  }
];

export const getPotSkinConfig = (skinId: string): PotSkinConfig => {
  return POT_SKINS.find(s => s.id === skinId) || POT_SKINS[0];
};
