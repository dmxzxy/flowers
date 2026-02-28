import { FC, memo, useMemo } from 'react';
import type { TimeOfDay, Weather } from '../hooks/useAtmosphere';

interface Props {
  timeOfDay: TimeOfDay;
  timeColor: string;
  weather: Weather;
}

const RAIN_COUNT = 35;
const FIREFLY_COUNT = 6;

export const GreenhouseAtmosphere: FC<Props> = memo(({ timeOfDay, timeColor, weather }) => {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk';
  const showSunRays = !isNight && (weather === 'clear' || weather === 'cloudy');
  const showRain = weather === 'rainy';
  const showFog = weather === 'foggy';

  /* 雨滴数组 — 仅在 rain 时生成 */
  const rainDrops = useMemo(() => {
    if (!showRain) return [];
    return Array.from({ length: RAIN_COUNT }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 13) % 100}%`,
      delay: `${(i * 0.19) % 3}s`,
      duration: `${0.7 + (i % 5) * 0.15}s`,
      height: 14 + (i % 4) * 5,
    }));
  }, [showRain]);

  /* 萤火虫数组 — 仅夜晚 */
  const fireflies = useMemo(() => {
    if (timeOfDay !== 'night') return [];
    return Array.from({ length: FIREFLY_COUNT }, (_, i) => ({
      id: i,
      left: `${12 + (i * 43 + 17) % 76}%`,
      top: `${28 + (i * 31 + 11) % 42}%`,
      delay: `${i * 0.9}s`,
      duration: `${3 + (i % 3)}s`,
    }));
  }, [timeOfDay]);

  return (
    <div className="greenhouse-atmosphere" aria-hidden="true">
      {/* ——— 暖色晕影（始终存在） ——— */}
      <div className="atmo-vignette" />

      {/* ——— 昼夜色调叠加 ——— */}
      <div className="atmo-time-overlay" style={{ background: timeColor }} />

      {/* ——— 阳光光柱（白天+晴/多云） ——— */}
      {showSunRays && (
        <div className="atmo-sun-rays">
          <div className="atmo-ray atmo-ray-1" />
          <div className="atmo-ray atmo-ray-2" />
          <div className="atmo-ray atmo-ray-3" />
        </div>
      )}

      {/* ——— 雨天效果 ——— */}
      {showRain && (
        <>
          <div className="atmo-rain-tint" />
          <div className="atmo-rain">
            {rainDrops.map(d => (
              <div
                key={d.id}
                className="atmo-raindrop"
                style={{
                  left: d.left,
                  animationDelay: d.delay,
                  animationDuration: d.duration,
                  height: d.height,
                }}
              />
            ))}
          </div>
          {/* 玻璃上的水珠 */}
          <div className="atmo-glass-drops">
            <div className="atmo-glass-drop" style={{ left: '25%', top: '8%' }} />
            <div className="atmo-glass-drop" style={{ left: '42%', top: '15%' }} />
            <div className="atmo-glass-drop" style={{ left: '58%', top: '5%' }} />
            <div className="atmo-glass-drop" style={{ left: '70%', top: '18%' }} />
            <div className="atmo-glass-drop" style={{ left: '33%', top: '22%' }} />
            <div className="atmo-glass-drop" style={{ left: '80%', top: '12%' }} />
          </div>
        </>
      )}

      {/* ——— 雾天 ——— */}
      {showFog && <div className="atmo-fog" />}

      {/* ——— 阴天加暗 ——— */}
      {weather === 'cloudy' && <div className="atmo-clouds-dim" />}

      {/* ——— 灰尘浮粒（始终可见，夜晚减淡） ——— */}
      <div className={`atmo-dust${isNight ? ' atmo-dust--night' : ''}`}>
        <div className="atmo-mote atmo-mote-1" />
        <div className="atmo-mote atmo-mote-2" />
        <div className="atmo-mote atmo-mote-3" />
        <div className="atmo-mote atmo-mote-4" />
        <div className="atmo-mote atmo-mote-5" />
        <div className="atmo-mote atmo-mote-6" />
      </div>

      {/* ——— 蝴蝶（白天且非雨天） ——— */}
      {!isNight && !showRain && (
        <div className="atmo-butterflies">
          <div className="atmo-butterfly atmo-butterfly-1">🦋</div>
          <div className="atmo-butterfly atmo-butterfly-2">🦋</div>
        </div>
      )}

      {/* ——— 萤火虫（夜晚） ——— */}
      {fireflies.map(f => (
        <div
          key={f.id}
          className="atmo-firefly"
          style={{
            left: f.left,
            top: f.top,
            animationDelay: f.delay,
            animationDuration: f.duration,
          }}
        />
      ))}
    </div>
  );
});

GreenhouseAtmosphere.displayName = 'GreenhouseAtmosphere';
