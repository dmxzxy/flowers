import { useState, useCallback, useRef, useEffect } from 'react';
import { PotData, FlowerType, Inventory, Currency, FlowerLevels, EffectState, BuyOrder } from '../types';
import { getLevelConfig, MAX_FLOWER_LEVEL, flowers as flowerConfigs } from '../data/flowers';
import { purchaseTasks } from '../data/tasks';

const GRID_COLS = 4;
const GRID_ROWS = 7;

// ==================== 可配置参数 ====================
/** 初始水量 */
const INITIAL_WATER = 100;
/** 水量上限 */
const MAX_WATER = 100;
/** 水量恢复间隔（毫秒） */
const WATER_REGEN_INTERVAL_MS = 10_000;
/** 每次恢复水量 */
const WATER_REGEN_AMOUNT = 1;
// ====================================================

const ALL_FLOWERS: FlowerType[] = [
  'rose','tulip','daisy','sunflower','lavender',
  'orchid','peony','carnation','chrysanthemum','hibiscus',
];

const createInitialPots = (): PotData[] => {
  const pots: PotData[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      pots.push({ id: row * GRID_COLS + col, row, col, state: 'empty' });
    }
  }
  return pots;
};

const createInitialInventory = (): Inventory => ({
  flowers: Object.fromEntries(ALL_FLOWERS.map(f => [f, 0])) as Record<FlowerType, number>,
  total: 0,
});

const createInitialFlowerLevels = (): FlowerLevels =>
  Object.fromEntries(ALL_FLOWERS.map(f => [f, 1])) as FlowerLevels;

export const useGameState = () => {
  const [pots, setPots] = useState<PotData[]>(createInitialPots);
  const [selectedFlower, setSelectedFlower] = useState<FlowerType | null>(null);
  const [showFlowerPicker, setShowFlowerPicker] = useState(false);
  const [showWaterPicker, setShowWaterPicker] = useState(false);
  const [showHarvestPicker, setShowHarvestPicker] = useState(false);
  const [selectedPotId, setSelectedPotId] = useState<number | null>(null);
  const [inventory, setInventory] = useState<Inventory>(createInitialInventory);
  const [currency, setCurrency] = useState<Currency>({ coins: 0, water: INITIAL_WATER });
  const [flowerLevels, setFlowerLevels] = useState<FlowerLevels>(createInitialFlowerLevels);
  const [effects, setEffects] = useState<EffectState[]>([]);
  const [noWaterWarning, setNoWaterWarning] = useState(false);
  const [activeBuyOrder, setActiveBuyOrder] = useState<BuyOrder | null>(null);

  // 效果 ID 自增
  const effectIdRef = useRef(0);
  const pushEffect = useCallback((e: Omit<EffectState, 'id'>) => {
    const id = ++effectIdRef.current;
    setEffects(prev => [...prev, { ...e, id } as EffectState]);
  }, []);
  const removeEffect = useCallback((id: number) => {
    setEffects(prev => prev.filter(e => e.id !== id));
  }, []);

  // ----- 同步 ref 跟踪货币，避免 setState updater 异步导致判断失败 -----
  const currencyRef = useRef<Currency>({ coins: 0, water: INITIAL_WATER });
  const updateCurrency = useCallback((fn: (prev: Currency) => Currency) => {
    setCurrency(prev => {
      const next = fn(prev);
      currencyRef.current = next;
      return next;
    });
  }, []);

  // ----- 水量自动恢复 -----
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrency(prev => {
        if (prev.water >= MAX_WATER) return prev;
        const next = { ...prev, water: Math.min(prev.water + WATER_REGEN_AMOUNT, MAX_WATER) };
        currencyRef.current = next;
        return next;
      });
    }, WATER_REGEN_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // ==================== 核心操作 ====================

  const plantSeed = useCallback((potId: number, flowerType?: FlowerType) => {
    const flower = flowerType || selectedFlower;
    if (!flower) return;

    const level = flowerLevels[flower] || 1;
    const levelConfig = getLevelConfig(level);

    setPots(prev =>
      prev.map(pot =>
        pot.id === potId && pot.state === 'empty'
          ? { ...pot, state: 'seeded' as const, flowerType: flower, harvestsRemaining: levelConfig.maxHarvests }
          : pot
      )
    );

    // 播种特效
    pushEffect({ type: 'seed', potId, flowerType: flower });
  }, [selectedFlower, flowerLevels, pushEffect]);

  /** 浇水：消耗 1 水，水不够时返回 false */
  const doWaterPot = useCallback((potId: number): boolean => {
    // 同步读 ref 判断水量
    if (currencyRef.current.water < 1) {
      setNoWaterWarning(true);
      setTimeout(() => setNoWaterWarning(false), 2000);
      return false;
    }

    // 同步扣 ref + 异步更新 state
    currencyRef.current = { ...currencyRef.current, water: currencyRef.current.water - 1 };
    updateCurrency(() => currencyRef.current);

    setPots(prev =>
      prev.map(pot =>
        pot.id === potId && (pot.state === 'seeded' || pot.state === 'growing')
          ? { ...pot, state: 'blooming' as const }
          : pot
      )
    );
    pushEffect({ type: 'water', potId });
    return true;
  }, [updateCurrency, pushEffect]);

  const harvestPot = useCallback((potId: number) => {
    const pot = pots.find(p => p.id === potId);
    if (!pot || pot.state !== 'blooming' || !pot.flowerType) return;

    const flowerType = pot.flowerType;
    const remaining = (pot.harvestsRemaining ?? 1) - 1;
    const level = flowerLevels[flowerType] || 1;
    const levelConfig = getLevelConfig(level);

    // 更新花盆状态
    setPots(prev =>
      prev.map(p => {
        if (p.id !== potId) return p;
        if (remaining > 0 && levelConfig.cooldownSeconds > 0) {
          return {
            ...p,
            state: 'cooling' as const,
            harvestsRemaining: remaining,
            cooldownUntil: Date.now() + levelConfig.cooldownSeconds * 1000,
          };
        }
        return { ...p, state: 'empty' as const, flowerType: undefined, harvestsRemaining: undefined, cooldownUntil: undefined };
      })
    );

    // 加入库存（在 setPots 外部）
    setInventory(inv => ({
      flowers: { ...inv.flowers, [flowerType]: inv.flowers[flowerType] + 1 },
      total: inv.total + 1,
    }));

    // 收割特效（在 setPots 外部）
    pushEffect({ type: 'harvest', flowerType, potId });
  }, [pots, flowerLevels, pushEffect]);

  // ==================== 花朵升级 ====================

  const upgradeFlower = useCallback((flowerType: FlowerType): boolean => {
    const currentLevel = flowerLevels[flowerType] || 1;
    if (currentLevel >= MAX_FLOWER_LEVEL) return false;

    const levelConfig = getLevelConfig(currentLevel);
    const cost = levelConfig.upgradeCostCoins;

    if (currencyRef.current.coins < cost) return false;

    currencyRef.current = { ...currencyRef.current, coins: currencyRef.current.coins - cost };
    updateCurrency(() => currencyRef.current);

    setFlowerLevels(prev => ({ ...prev, [flowerType]: currentLevel + 1 }));
    pushEffect({ type: 'levelup', flowerType });
    return true;
  }, [flowerLevels, updateCurrency, pushEffect]);

  // ==================== 采购任务 ====================

  const canCompleteTask = useCallback((taskId: string): boolean => {
    const task = purchaseTasks.find(t => t.id === taskId);
    if (!task) return false;

    if (task.costCoins && currency.coins < task.costCoins) return false;

    if (task.costAnyFlowers && inventory.total < task.costAnyFlowers) return false;

    if (task.costFlowers) {
      for (const [flower, count] of Object.entries(task.costFlowers)) {
        if ((inventory.flowers[flower as FlowerType] || 0) < (count || 0)) return false;
      }
    }
    return true;
  }, [currency, inventory]);

  const completePurchaseTask = useCallback((taskId: string): boolean => {
    const task = purchaseTasks.find(t => t.id === taskId);
    if (!task) return false;

    // 先同步检查金币
    if (task.costCoins && currencyRef.current.coins < task.costCoins) return false;

    // 扣金币（同步 ref + 异步 state）
    if (task.costCoins) {
      currencyRef.current = { ...currencyRef.current, coins: currencyRef.current.coins - task.costCoins };
      updateCurrency(() => currencyRef.current);
    }

    // 扣任意花朵
    if (task.costAnyFlowers) {
      setInventory(prev => {
        let remaining = task.costAnyFlowers || 0;
        if (prev.total < remaining) return prev; // safety

        const newFlowers = { ...prev.flowers };
        for (const fType of ALL_FLOWERS) {
          if (remaining <= 0) break;
          const take = Math.min(newFlowers[fType], remaining);
          newFlowers[fType] -= take;
          remaining -= take;
        }
        return { flowers: newFlowers, total: prev.total - (task.costAnyFlowers || 0) };
      });
    }

    // 扣指定花朵
    if (task.costFlowers) {
      setInventory(prev => {
        const newFlowers = { ...prev.flowers };
        let totalDeducted = 0;
        for (const [flower, count] of Object.entries(task.costFlowers!)) {
          const fType = flower as FlowerType;
          const c = count || 0;
          if (newFlowers[fType] < c) return prev; // safety
          newFlowers[fType] -= c;
          totalDeducted += c;
        }
        return { flowers: newFlowers, total: prev.total - totalDeducted };
      });
    }

    // 发放奖励（水量不超过上限）
    if (task.rewardCoins || task.rewardWater) {
      currencyRef.current = {
        coins: currencyRef.current.coins + (task.rewardCoins || 0),
        water: Math.min(currencyRef.current.water + (task.rewardWater || 0), MAX_WATER),
      };
      updateCurrency(() => currencyRef.current);
    }

    // 交付完成特效
    pushEffect({
      type: 'task',
      taskRewardCoins: task.rewardCoins,
      taskRewardWater: task.rewardWater,
    });

    return true;
  }, [updateCurrency, pushEffect]);

  // ==================== UI 交互 ====================

  const handleFlowerSelect = useCallback((flowerType: FlowerType) => {
    setSelectedFlower(flowerType);
    setShowFlowerPicker(false);
    if (selectedPotId !== null) {
      plantSeed(selectedPotId, flowerType);
      setSelectedPotId(null);
    }
  }, [selectedPotId, plantSeed]);

  const handlePotClick = useCallback((potId: number) => {
    const pot = pots.find(p => p.id === potId);
    if (!pot) return;

    setSelectedPotId(potId);
    if (pot.state === 'empty') {
      setShowFlowerPicker(true);
    } else if (pot.state === 'seeded' || pot.state === 'growing') {
      setShowWaterPicker(true);
    } else if (pot.state === 'blooming') {
      setShowHarvestPicker(true);
    }
    // cooling 状态不弹菜单
  }, [pots]);

  const handleWaterFromPicker = useCallback(() => {
    if (selectedPotId !== null) {
      doWaterPot(selectedPotId);
    }
    setShowWaterPicker(false);
    setSelectedPotId(null);
  }, [selectedPotId, doWaterPot]);

  const harvestFromPicker = useCallback(() => {
    if (selectedPotId !== null) {
      harvestPot(selectedPotId);
    }
    setShowHarvestPicker(false);
    setSelectedPotId(null);
  }, [selectedPotId, harvestPot]);

  const closeFlowerPicker = useCallback(() => {
    setShowFlowerPicker(false);
    setSelectedPotId(null);
  }, []);

  const closeWaterPicker = useCallback(() => {
    setShowWaterPicker(false);
    setSelectedPotId(null);
  }, []);

  const closeHarvestPicker = useCallback(() => {
    setShowHarvestPicker(false);
    setSelectedPotId(null);
  }, []);

  // ==================== 随机收购订单 ====================
  const BUY_ORDER_INTERVAL = 45_000; // 45秒
  const BUY_ORDER_DURATION = 30_000; // 30秒过期
  const buyOrderIdRef = useRef(0);

  const generateBuyOrder = useCallback((): BuyOrder => {
    const idx = Math.floor(Math.random() * ALL_FLOWERS.length);
    const flowerType = ALL_FLOWERS[idx];
    const cfg = flowerConfigs.find(f => f.id === flowerType)!;
    const amount = 1 + Math.floor(Math.random() * 4); // 1–4
    const pricePerFlower = 8 + Math.floor(Math.random() * 18); // 8–25
    return {
      id: ++buyOrderIdRef.current,
      flowerType,
      flowerName: cfg.name,
      amount,
      pricePerFlower,
      totalPrice: amount * pricePerFlower,
      expiresAt: Date.now() + BUY_ORDER_DURATION,
    };
  }, []);

  // 定时生成收购订单
  useEffect(() => {
    // 初始 10 秒后第一次
    const firstTimer = setTimeout(() => {
      setActiveBuyOrder(generateBuyOrder());
    }, 10_000);

    const interval = setInterval(() => {
      setActiveBuyOrder(generateBuyOrder());
    }, BUY_ORDER_INTERVAL);

    return () => { clearTimeout(firstTimer); clearInterval(interval); };
  }, [generateBuyOrder]);

  // 过期自动清除
  useEffect(() => {
    if (!activeBuyOrder) return;
    const remaining = activeBuyOrder.expiresAt - Date.now();
    if (remaining <= 0) { setActiveBuyOrder(null); return; }
    const timer = setTimeout(() => setActiveBuyOrder(null), remaining);
    return () => clearTimeout(timer);
  }, [activeBuyOrder]);

  const acceptBuyOrder = useCallback((): boolean => {
    if (!activeBuyOrder) return false;
    const { flowerType, amount, totalPrice } = activeBuyOrder;
    // 同步检查库存
    // 注意：inventory 是 state，可能有延迟，但收购是用户点击触发，state 已经 stable
    let success = false;
    setInventory(prev => {
      if ((prev.flowers[flowerType] || 0) < amount) return prev;
      success = true;
      return {
        flowers: { ...prev.flowers, [flowerType]: prev.flowers[flowerType] - amount },
        total: prev.total - amount,
      };
    });
    // React 18 batching: setInventory updater 会在当次同步执行
    // 但 success 变量在 updater 中赋值，需要绕过
    // 改用直接读 state (React 18 auto-batching 中 updater 同步运行)
    if (!success) return false;

    currencyRef.current = { ...currencyRef.current, coins: currencyRef.current.coins + totalPrice };
    updateCurrency(() => currencyRef.current);

    pushEffect({ type: 'task', taskRewardCoins: totalPrice });
    setActiveBuyOrder(null);
    return true;
  }, [activeBuyOrder, updateCurrency, pushEffect]);

  const dismissBuyOrder = useCallback(() => {
    setActiveBuyOrder(null);
  }, []);

  return {
    pots,
    setPots,
    showFlowerPicker,
    showWaterPicker,
    showHarvestPicker,
    selectedPotId,
    inventory,
    currency,
    flowerLevels,
    effects,
    removeEffect,
    noWaterWarning,
    handleFlowerSelect,
    handlePotClick,
    handleWaterFromPicker,
    harvestFromPicker,
    closeFlowerPicker,
    closeWaterPicker,
    closeHarvestPicker,
    plantSeed,
    waterPot: doWaterPot,
    harvestPot,
    upgradeFlower,
    canCompleteTask,
    completePurchaseTask,
    activeBuyOrder,
    acceptBuyOrder,
    dismissBuyOrder,
    maxWater: MAX_WATER,
    gridCols: GRID_COLS,
    gridRows: GRID_ROWS,
  };
};
