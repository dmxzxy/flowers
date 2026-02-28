import { useState, useEffect } from 'react';

/* ========== 类型 ========== */
export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night';
export type Weather = 'clear' | 'cloudy' | 'rainy' | 'foggy';

export interface AtmosphereState {
  timeOfDay: TimeOfDay;
  /** 连续插值的 rgba 色值，用于昼夜叠加层 */
  timeColor: string;
  weather: Weather;
}

/* ========== 昼夜颜色插值 ========== */
// [hour, r, g, b, alpha]
type Stop = [number, number, number, number, number];

const TIME_STOPS: Stop[] = [
  //  h     R    G    B    A
  [0,    20,  20,  60,  0.38],   // 午夜
  [5,    20,  20,  60,  0.32],   // 黎明前
  [6,    200, 150, 110, 0.16],   // 破晓
  [7.5,  255, 248, 225, 0.05],   // 清晨
  [12,   255, 252, 235, 0.03],   // 正午
  [15,   255, 225, 160, 0.08],   // 午后
  [17.5, 230, 140, 80,  0.20],   // 黄昏
  [19,   100, 60,  110, 0.28],   // 入夜
  [21,   20,  20,  60,  0.38],   // 深夜
  [24,   20,  20,  60,  0.38],   // 子夜
];

function lerpColor(hour: number): string {
  for (let i = 0; i < TIME_STOPS.length - 1; i++) {
    const [h0, r0, g0, b0, a0] = TIME_STOPS[i];
    const [h1, r1, g1, b1, a1] = TIME_STOPS[i + 1];
    if (hour >= h0 && hour < h1) {
      const t = (hour - h0) / (h1 - h0);
      const r = (r0 + (r1 - r0) * t) | 0;
      const g = (g0 + (g1 - g0) * t) | 0;
      const b = (b0 + (b1 - b0) * t) | 0;
      const a = +(a0 + (a1 - a0) * t).toFixed(3);
      return `rgba(${r},${g},${b},${a})`;
    }
  }
  return 'transparent';
}

function classifyTime(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 19.5) return 'dusk';
  return 'night';
}

/* ========== 天气系统 ========== */
const WEATHER_KEY = 'flowers_weather';
const WEATHER_MIN_MS = 20 * 60_000;   // 20 min
const WEATHER_MAX_MS = 50 * 60_000;   // 50 min

function pickWeather(): Weather {
  const r = Math.random();
  if (r < 0.40) return 'clear';
  if (r < 0.65) return 'cloudy';
  if (r < 0.85) return 'rainy';
  return 'foggy';
}

interface StoredWeather {
  weather: Weather;
  expiresAt: number;
}

const VALID_WEATHERS: string[] = ['clear', 'cloudy', 'rainy', 'foggy'];

function saveWeather(w: Weather) {
  const data: StoredWeather = {
    weather: w,
    expiresAt: Date.now() + WEATHER_MIN_MS + Math.random() * (WEATHER_MAX_MS - WEATHER_MIN_MS),
  };
  localStorage.setItem(WEATHER_KEY, JSON.stringify(data));
}

function loadOrRefreshWeather(): Weather {
  try {
    const raw = localStorage.getItem(WEATHER_KEY);
    if (raw) {
      const { weather, expiresAt } = JSON.parse(raw) as StoredWeather;
      if (VALID_WEATHERS.includes(weather) && Date.now() < expiresAt) return weather;
    }
  } catch { /* ignore */ }
  const w = pickWeather();
  saveWeather(w);
  return w;
}

/* ========== Hook ========== */
export function useAtmosphere(): AtmosphereState {
  const [state, setState] = useState<AtmosphereState>(() => {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    return {
      timeOfDay: classifyTime(hour),
      timeColor: lerpColor(hour),
      weather: loadOrRefreshWeather(),
    };
  });

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60;
      setState({
        timeOfDay: classifyTime(hour),
        timeColor: lerpColor(hour),
        weather: loadOrRefreshWeather(),
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return state;
}
