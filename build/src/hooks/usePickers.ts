/**
 * Picker 面板开关 Hook
 * 管理 FlowerPicker / WaterPicker / HarvestPicker 的显隐
 * 含一键种花 / 一键浇水 / 一键收获批量操作
 */
import { useState, useCallback } from 'react';
import { PotData, FlowerType } from '../types';

export const usePickers = (
  pots: PotData[],
  plantSeed: (potId: number, flowerType: FlowerType) => void,
  waterPot: (potId: number) => boolean,
  harvestPot: (potId: number) => void
) => {
  const [selectedFlower, setSelectedFlower] = useState<FlowerType | null>(null);
  const [showFlowerPicker, setShowFlowerPicker] = useState(false);
  const [showWaterPicker, setShowWaterPicker] = useState(false);
  const [showHarvestPicker, setShowHarvestPicker] = useState(false);
  const [selectedPotId, setSelectedPotId] = useState<number | null>(null);

  const handleFlowerSelect = useCallback(
    (flowerType: FlowerType) => {
      setSelectedFlower(flowerType);
      setShowFlowerPicker(false);
      if (selectedPotId !== null) {
        plantSeed(selectedPotId, flowerType);
        setSelectedPotId(null);
      }
    },
    [selectedPotId, plantSeed]
  );

  /** 一键种花：对所有空花盆种植指定花朵 */
  const batchPlantAll = useCallback(
    (flowerType: FlowerType) => {
      setSelectedFlower(flowerType);
      setShowFlowerPicker(false);
      pots.forEach(pot => {
        if (pot.state === 'empty') {
          plantSeed(pot.id, flowerType);
        }
      });
      setSelectedPotId(null);
    },
    [pots, plantSeed]
  );

  const handlePotClick = useCallback(
    (potId: number) => {
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
    },
    [pots]
  );

  const handleWaterFromPicker = useCallback(() => {
    if (selectedPotId !== null) waterPot(selectedPotId);
    setShowWaterPicker(false);
    setSelectedPotId(null);
  }, [selectedPotId, waterPot]);

  /** 一键浇水：对所有已播种/生长中的花盆浇水 */
  const batchWaterAll = useCallback(() => {
    pots.forEach(pot => {
      if (pot.state === 'seeded' || pot.state === 'growing') {
        waterPot(pot.id);
      }
    });
    setShowWaterPicker(false);
    setSelectedPotId(null);
  }, [pots, waterPot]);

  const harvestFromPicker = useCallback(() => {
    if (selectedPotId !== null) harvestPot(selectedPotId);
    setShowHarvestPicker(false);
    setSelectedPotId(null);
  }, [selectedPotId, harvestPot]);

  /** 一键收获：对所有开花的花盆收割 */
  const batchHarvestAll = useCallback(() => {
    pots.forEach(pot => {
      if (pot.state === 'blooming') {
        harvestPot(pot.id);
      }
    });
    setShowHarvestPicker(false);
    setSelectedPotId(null);
  }, [pots, harvestPot]);

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

  return {
    selectedFlower,
    showFlowerPicker,
    showWaterPicker,
    showHarvestPicker,
    selectedPotId,
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
  };
};
