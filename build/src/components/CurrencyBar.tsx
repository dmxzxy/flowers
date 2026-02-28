import { FC } from 'react';
import { Currency } from '../types';

interface CurrencyBarProps {
  currency: Currency;
  maxWater: number;
  noWaterWarning: boolean;
  waterRegenCountdown: number;
}

export const CurrencyBar: FC<CurrencyBarProps> = ({ currency, maxWater, noWaterWarning, waterRegenCountdown }) => {
  return (
    <div className="currency-bar">
      <div className="currency-item currency-coins">
        <span className="currency-icon coin-icon">$</span>
        <span className="currency-value">{currency.coins}</span>
      </div>
      <div className={`currency-item currency-water ${noWaterWarning ? 'no-water-shake' : ''}`}>
        <span className="currency-icon">💧</span>
        <span className="currency-value">{currency.water}/{maxWater}</span>
        {currency.water < maxWater && (
          <span className="water-regen-timer">+1: {waterRegenCountdown}s</span>
        )}
        {noWaterWarning && <span className="currency-warning">水不足!</span>}
      </div>
    </div>
  );
};
