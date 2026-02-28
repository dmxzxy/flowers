import { FC, useCallback, useEffect, useState, useRef } from 'react';
import { PotGrid } from './PotGrid';
import { FlowerPicker } from './FlowerPicker';
import { WaterPicker } from './WaterPicker';
import { HarvestPicker } from './HarvestPicker';
import { Toolbar } from './Toolbar';
import { InventoryPanel } from './InventoryPanel';
import { DragIndicator } from './DragIndicator';
import { HarvestEffect } from './HarvestEffect';
import { CurrencyBar } from './CurrencyBar';
import { PurchasePanel } from './PurchasePanel';
import { FlowerLevelPanel } from './FlowerLevelPanel';
import { PlayerLevelBar } from './PlayerLevelBar';
import { SeedEffect } from './SeedEffect';
import { WaterEffect } from './WaterEffect';
import { LevelUpEffect } from './LevelUpEffect';
import { TaskCompleteEffect } from './TaskCompleteEffect';
import { XpGainEffect } from './XpGainEffect';
import { SoulDropEffect } from './SoulDropEffect';
import { PlayerLevelUpEffect } from './PlayerLevelUpEffect';
import { BuyOrderPanel } from './BuyOrderPanel';
import { PotSkinPanel } from './PotSkinPanel';
import { ProfileMenu } from './ProfileMenu';
import { useGameState } from '../hooks/useGameState';
import { useCooldown } from '../hooks/useCooldown';
import { assets } from '../data/assets';
import { FlowerType } from '../types';

export const GameScene: FC = () => {
  const {
    pots,
    setPots,
    showFlowerPicker,
    showWaterPicker,
    showHarvestPicker,
    inventory,
    currency,
    flowerLevels,
    flowerSouls,
    playerLevel,
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
    batchPlantAll,
    batchWaterAll,
    batchHarvestAll,
    plantSeed,
    waterPot,
    harvestPot,
    upgradeFlower,
    canCompleteTask,
    completePurchaseTask,
    purchaseTasks,
    isTaskOnCooldown,
    getTaskCooldownRemaining,
    refreshTasks,
    buyOrders,
    acceptBuyOrder,
    dismissBuyOrder,
    maxWater,
    waterRegenCountdown,
    activeSkin,
    getSkinImage,
    selectSkin,
    unlockSkin,
    isSkinUnlocked,
    saveNow,
    resetGame,
    saveInfo,
  } = useGameState();

  // 冷却计时器
  useCooldown(pots, setPots);

  const [showInventory, setShowInventory] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [showBuyOrders, setShowBuyOrders] = useState(false);
  const [showPotSkins, setShowPotSkins] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const potImage = getSkinImage();
  const [dragState, setDragState] = useState({
    isDragging: false,
    tool: 'none' as 'none' | 'seed' | 'water' | 'harvest',
    flowerType: undefined as FlowerType | undefined,
    x: 0,
    y: 0,
  });

  const isDraggingRef = useRef(false);
  const dragToolRef = useRef<'none' | 'seed' | 'water' | 'harvest'>('none');
  const dragFlowerTypeRef = useRef<FlowerType | undefined>(undefined);
  const processedPotsRef = useRef<Set<number>>(new Set());
  const justDraggedRef = useRef(false);

  // 触摸拖拽：tap-vs-drag 检测
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const closePendingPickerRef = useRef<(() => void) | null>(null);
  const [pickerHidden, setPickerHidden] = useState(false);

  const updateDrag = useCallback((x: number, y: number) => {
    if (!isDraggingRef.current) return;

    setDragState(prev => ({ ...prev, x, y }));

    const elements = document.elementsFromPoint(x, y);
    const potElement = elements.find(el => el.classList.contains('pot'));

    if (potElement) {
      const potId = parseInt(potElement.getAttribute('data-pot-id') || '-1', 10);
      if (potId >= 0 && !processedPotsRef.current.has(potId)) {
        processedPotsRef.current.add(potId);

        const pot = pots.find(p => p.id === potId);
        if (!pot) return;

        if (dragToolRef.current === 'seed' && pot.state === 'empty' && dragFlowerTypeRef.current) {
          plantSeed(potId, dragFlowerTypeRef.current);
        } else if (dragToolRef.current === 'water' && (pot.state === 'seeded' || pot.state === 'growing')) {
          waterPot(potId);
        } else if (dragToolRef.current === 'harvest' && pot.state === 'blooming') {
          harvestPot(potId);
        }
      }
    }
  }, [pots, plantSeed, waterPot, harvestPot]);

  const endDrag = useCallback(() => {
    isDraggingRef.current = false;
    dragToolRef.current = 'none';
    dragFlowerTypeRef.current = undefined;
    justDraggedRef.current = true;
    processedPotsRef.current.clear();
    setDragState({ isDragging: false, tool: 'none', flowerType: undefined, x: 0, y: 0 });
  }, []);

  // 使用 ref 让事件处理函数引用保持稳定，避免反复注册/注销监听器
  const updateDragRef = useRef(updateDrag);
  updateDragRef.current = updateDrag;
  const endDragRef = useRef(endDrag);
  endDragRef.current = endDrag;

  const handlePotClickGuarded = useCallback((potId: number) => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    handlePotClick(potId);
  }, [handlePotClick]);

  // 稳定的事件处理器 — 不依赖变化的回调，通过 ref 读取最新逻辑
  useEffect(() => {
    const DRAG_THRESHOLD = 8; // px

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) updateDragRef.current(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      if (isDraggingRef.current) endDragRef.current();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;
      e.preventDefault();
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      // 检测是否超过拖拽阈值 → 隐藏 picker（保留 DOM 以维持触摸链）
      if (closePendingPickerRef.current && dragStartPosRef.current) {
        const dx = x - dragStartPosRef.current.x;
        const dy = y - dragStartPosRef.current.y;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          setPickerHidden(true);
          dragStartPosRef.current = null; // 标记阈值已超过
          // closePendingPickerRef 保留 → touchend 时真正关闭
        }
      }

      updateDragRef.current(x, y);
    };
    const onTouchEnd = () => {
      if (closePendingPickerRef.current) {
        if (dragStartPosRef.current !== null) {
          // TAP：阈值未超过 → 取消拖拽，让 click 处理
          isDraggingRef.current = false;
          dragToolRef.current = 'none';
          dragFlowerTypeRef.current = undefined;
          processedPotsRef.current.clear();
          closePendingPickerRef.current = null;
          dragStartPosRef.current = null;
          setDragState({ isDragging: false, tool: 'none', flowerType: undefined, x: 0, y: 0 });
          return;
        }
        // DRAG：阈值已超过，picker 已隐藏 → 真正关闭 picker
        closePendingPickerRef.current();
        closePendingPickerRef.current = null;
        setPickerHidden(false);
      }
      if (isDraggingRef.current) endDragRef.current();
    };
    const onTouchCancel = () => {
      // 系统取消触摸 → 清理所有状态
      if (closePendingPickerRef.current) {
        closePendingPickerRef.current();
        closePendingPickerRef.current = null;
      }
      dragStartPosRef.current = null;
      setPickerHidden(false);
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        dragToolRef.current = 'none';
        dragFlowerTypeRef.current = undefined;
        processedPotsRef.current.clear();
        setDragState({ isDragging: false, tool: 'none', flowerType: undefined, x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchCancel);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只注册一次，通过 ref 读取最新逻辑

  const toggleInventory = useCallback(() => setShowInventory(p => !p), []);
  const togglePurchase = useCallback(() => setShowPurchase(p => !p), []);
  const toggleLevels = useCallback(() => setShowLevels(p => !p), []);
  const toggleBuyOrders = useCallback(() => setShowBuyOrders(p => !p), []);
  const togglePotSkins = useCallback(() => setShowPotSkins(p => !p), []);

  const handleStartDragFromPicker = useCallback((flowerType: FlowerType, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const isTouch = 'touches' in e;
    isDraggingRef.current = true;
    dragToolRef.current = 'seed';
    dragFlowerTypeRef.current = flowerType;
    processedPotsRef.current.clear();
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    setDragState({ isDragging: true, tool: 'seed', flowerType, x: clientX, y: clientY });
    if (isTouch) {
      dragStartPosRef.current = { x: clientX, y: clientY };
      closePendingPickerRef.current = closeFlowerPicker;
    }
  }, [closeFlowerPicker]);

  const handleStartDragWater = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const isTouch = 'touches' in e;
    isDraggingRef.current = true;
    dragToolRef.current = 'water';
    dragFlowerTypeRef.current = undefined;
    processedPotsRef.current.clear();
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    setDragState({ isDragging: true, tool: 'water', flowerType: undefined, x: clientX, y: clientY });
    if (isTouch) {
      dragStartPosRef.current = { x: clientX, y: clientY };
      closePendingPickerRef.current = closeWaterPicker;
    }
  }, [closeWaterPicker]);

  const handleStartDragHarvest = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const isTouch = 'touches' in e;
    isDraggingRef.current = true;
    dragToolRef.current = 'harvest';
    dragFlowerTypeRef.current = undefined;
    processedPotsRef.current.clear();
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    setDragState({ isDragging: true, tool: 'harvest', flowerType: undefined, x: clientX, y: clientY });
    if (isTouch) {
      dragStartPosRef.current = { x: clientX, y: clientY };
      closePendingPickerRef.current = closeHarvestPicker;
    }
  }, [closeHarvestPicker]);

  return (
    <div className="game-scene" onDragStart={e => e.preventDefault()}>
      <img src={assets.background} alt="背景" className="game-background" draggable={false} />
      <div className="game-content">
        <CurrencyBar currency={currency} maxWater={maxWater} noWaterWarning={noWaterWarning} waterRegenCountdown={waterRegenCountdown} />
        <PlayerLevelBar playerLevel={playerLevel} />
        <Toolbar
          onToggleInventory={toggleInventory}
          inventoryTotal={inventory.total}
          onOpenPurchase={togglePurchase}
          onOpenLevels={toggleLevels}
          onOpenBuyOrders={toggleBuyOrders}
          buyOrderCount={buyOrders.length}
          onOpenPotSkins={togglePotSkins}
          onOpenProfile={() => setShowProfile(true)}
        />
        <div className="garden-container">
          <PotGrid pots={pots} onPotClick={handlePotClickGuarded} potImage={potImage} />
        </div>
        <div className="game-hint">
          {dragState.tool === 'seed' && '🌱 拖拽到空花盆进行播种'}
          {dragState.tool === 'water' && '💧 拖拽到花盆进行浇水'}
          {dragState.tool === 'harvest' && '🌾 拖拽到开花的花盆进行收获'}
          {dragState.tool === 'none' && '点击花盆进行操作'}
        </div>
      </div>

      <DragIndicator dragState={dragState} />

      {/* 拖拽时隐藏 picker 但保留 DOM，防止 touchcancel */}
      <div style={pickerHidden ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}>
        {showFlowerPicker && (
          <FlowerPicker
            onSelect={handleFlowerSelect}
            onClose={closeFlowerPicker}
            onStartDrag={handleStartDragFromPicker}
            playerLevel={playerLevel.level}
            onBatchPlant={batchPlantAll}
          />
        )}
        {showWaterPicker && (
          <WaterPicker
            onSelect={handleWaterFromPicker}
            onClose={closeWaterPicker}
            onStartDrag={handleStartDragWater}
            onBatchWater={batchWaterAll}
          />
        )}
        {showHarvestPicker && (
          <HarvestPicker
            onSelect={harvestFromPicker}
            onClose={closeHarvestPicker}
            onStartDrag={handleStartDragHarvest}
            onBatchHarvest={batchHarvestAll}
          />
        )}
      </div>

      <InventoryPanel
        inventory={inventory}
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
      />
      <PurchasePanel
        isOpen={showPurchase}
        onClose={() => setShowPurchase(false)}
        inventory={inventory}
        currency={currency}
        tasks={purchaseTasks}
        canCompleteTask={canCompleteTask}
        onCompleteTask={completePurchaseTask}
        isTaskOnCooldown={isTaskOnCooldown}
        getTaskCooldownRemaining={getTaskCooldownRemaining}
        onRefreshTasks={refreshTasks}
      />
      <FlowerLevelPanel
        isOpen={showLevels}
        onClose={() => setShowLevels(false)}
        flowerLevels={flowerLevels}
        flowerSouls={flowerSouls}
        coins={currency.coins}
        onUpgrade={upgradeFlower}
      />
      <PotSkinPanel
        isOpen={showPotSkins}
        onClose={() => setShowPotSkins(false)}
        activeSkin={activeSkin}
        isSkinUnlocked={isSkinUnlocked}
        onSelectSkin={selectSkin}
        onUnlockSkin={unlockSkin}
        coins={currency.coins}
      />

      {/* 所有特效并行渲染 */}
      {effects.map(eff => {
        switch (eff.type) {
          case 'seed':
            return eff.potId !== undefined ? (
              <SeedEffect key={eff.id} potId={eff.potId} onComplete={() => removeEffect(eff.id)} />
            ) : null;
          case 'water':
            return eff.potId !== undefined ? (
              <WaterEffect key={eff.id} potId={eff.potId} onComplete={() => removeEffect(eff.id)} />
            ) : null;
          case 'harvest':
            return (
              <HarvestEffect
                key={eff.id}
                isActive
                potId={eff.potId ?? null}
                flowerType={eff.flowerType}
                onComplete={() => removeEffect(eff.id)}
              />
            );
          case 'levelup':
            return (
              <LevelUpEffect key={eff.id} flowerType={eff.flowerType || null} onComplete={() => removeEffect(eff.id)} />
            );
          case 'task':
            return (
              <TaskCompleteEffect
                key={eff.id}
                rewardCoins={eff.taskRewardCoins}
                rewardWater={eff.taskRewardWater}
                onComplete={() => removeEffect(eff.id)}
              />
            );
          case 'xpgain':
            return (
              <XpGainEffect
                key={eff.id}
                xpAmount={eff.xpAmount}
                onComplete={() => removeEffect(eff.id)}
              />
            );
          case 'souldrop':
            return (
              <SoulDropEffect
                key={eff.id}
                soulFlowerType={eff.soulFlowerType}
                onComplete={() => removeEffect(eff.id)}
              />
            );
          case 'playerlevelup':
            return (
              <PlayerLevelUpEffect
                key={eff.id}
                newPlayerLevel={eff.newPlayerLevel}
                onComplete={() => removeEffect(eff.id)}
              />
            );
          default:
            return null;
        }
      })}

      {/* 收购订单面板 */}
      <BuyOrderPanel
        isOpen={showBuyOrders}
        onClose={() => setShowBuyOrders(false)}
        buyOrders={buyOrders}
        inventory={inventory}
        onAccept={acceptBuyOrder}
        onDismiss={dismissBuyOrder}
      />

      {/* 个人中心面板 */}
      <ProfileMenu
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        playerLevel={playerLevel}
        currency={currency}
        inventory={inventory}
        flowerSouls={flowerSouls}
        maxWater={maxWater}
        saveInfo={saveInfo}
        onSaveNow={saveNow}
        onResetGame={resetGame}
      />
    </div>
  );
};
