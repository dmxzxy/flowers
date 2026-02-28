import { FlowerConfig } from '../types';

export interface FlowerProps {
  flowerType: string;
  state: string;
  flowerConfig: FlowerConfig | undefined;
}

export const getFlowerImage = (flowerConfig: FlowerConfig | undefined, state: string): string => {
  if (!flowerConfig) return '';
  
  const stateMap: Record<string, keyof typeof flowerConfig.states> = {
    'seeded': 'seed',
    'growing': 'growing',
    'blooming': 'bloom',
    'cooling': 'growing',
  };
  
  const stateKey = stateMap[state] || 'seed';
  return flowerConfig.states[stateKey];
};
