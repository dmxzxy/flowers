import { FC } from 'react';
import { PotData } from '../types';
import { Pot } from './Pot';

interface PotGridProps {
  pots: PotData[];
  onPotClick: (id: number) => void;
}

export const PotGrid: FC<PotGridProps> = ({ pots, onPotClick }) => {
  return (
    <div className="pot-grid-wrapper">
      <div className="pot-grid">
        {pots.map((pot) => (
          <Pot 
            key={pot.id} 
            pot={pot} 
            onClick={onPotClick}
          />
        ))}
      </div>
    </div>
  );
};
