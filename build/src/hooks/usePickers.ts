/**
 * Picker 面板开关 Hook
 * 管理 FlowerPicker / WaterPicker / HarvestPicker 的显隐
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

  const harvestFromPicker = useCallback(() => {
    if (selectedPotId !== null) harvestPot(selectedPotId);
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
  };
};
