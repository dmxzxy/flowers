/**
 * 全局游戏配置
 * 所有可调数值集中在此，方便策划调整
 */

// ==================== 花盆网格 ====================
/** 花盆列数 */
export const GRID_COLS = 4;
/** 花盆行数 */
export const GRID_ROWS = 7;
/** 花盆总数 */
export const GRID_TOTAL = GRID_COLS * GRID_ROWS;

// ==================== 货币：水量 ====================
/** 初始水量 */
export const INITIAL_WATER = 100;
/** 水量上限 */
export const MAX_WATER = 100;
/** 水量自动恢复间隔（毫秒） */
export const WATER_REGEN_INTERVAL_MS = 10_000;
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
export const BUY_ORDER_INTERVAL_MS = 45_000;
/** 收购订单有效期（毫秒） */
export const BUY_ORDER_DURATION_MS = 30_000;
/** 首次收购订单延迟（毫秒） */
export const BUY_ORDER_FIRST_DELAY_MS = 10_000;
/** 收购数量区间 [min, max] */
export const BUY_ORDER_AMOUNT_RANGE: [number, number] = [1, 4];
/** 收购单价区间 [min, max] */
export const BUY_ORDER_PRICE_RANGE: [number, number] = [8, 25];

// ==================== 拖拽 ====================
/** 触摸拖拽判定阈值（px） */
export const DRAG_THRESHOLD_PX = 8;
