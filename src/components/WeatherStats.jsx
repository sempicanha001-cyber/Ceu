import { memo, useMemo } from 'react';
import {
  getUVLabel,
  getUVColor,
  getUVPercentage,
  getWindDirection,
  formatTime,
} from '../utils/formatters.js';

const WeatherStats = memo(({ weatherData }) => {
  const { current, sunrise, sunset, days } = weatherData;
  const uv = Math.round(current.uv ?? 0);

  const stats = useMemo(
    () => [
      {
        label: '💧 Umidade',
        value: `${current.humidity}%`,
        subtext:
          current.humidity > 70 ? 'Ar úmido' : 'Ar seco',
      },
      {
        label: '💨 Vento',
        value: `${Math.round(current.windSpeed)} km/h`,
        subtext: getWindDirection(current.windDirection),
      },
      {
        label: '☀️ Índice UV',
        value: uv,
        subtext: getUVLabel(uv),
        hasUVBar: true,
        uvColor: getUVColor(uv),
        uvPercent: getUVPercentage(uv),
      },
      {
        label: '🌅 Nascer / Pôr',
        value: formatTime(sunrise),
        subtext: `Pôr do sol: ${formatTime(sunset)}`,
      },
    ],
    [current, sunrise, sunset, uv]
  );

  return (
    <div className="stats-section">
      <div className="section-title">Detalhes</div>
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-subtext">{stat.subtext}</div>
            {stat.hasUVBar && (
              <div className="uv-bar-container">
                <div className="uv-bar-bg">
                  <div
                    className="uv-bar-fill"
                    style={{
                      width: `${stat.uvPercent}%`,
                      backgroundColor: stat.uvColor,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="stats-spacer" />

      <style>{`
        .stats-section {
          animation: fadeUp 0.7s 0.45s ease both;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.65;
          padding: 22px 20px 8px;
          scroll-margin-top: 10px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 0 18px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(14px);
          border-radius: 20px;
          padding: 18px 16px;
          transition: all 0.15s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          opacity: 0.6;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .stat-value {
          font-size: 1.6rem;
          font-weight: 300;
          margin-bottom: 6px;
        }

        .stat-subtext {
          font-size: 0.78rem;
          opacity: 0.65;
        }

        .uv-bar-container {
          margin-top: 8px;
        }

        .uv-bar-bg {
          height: 5px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.15);
          overflow: hidden;
        }

        .uv-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.6s ease;
        }

        .stats-spacer {
          height: 16px;
        }

        @media (max-width: 640px) {
          .section-title {
            padding: 18px 16px 6px;
            font-size: 0.7rem;
          }

          .stats-grid {
            margin: 0 14px;
            gap: 10px;
          }

          .stat-card {
            padding: 14px 12px;
          }

          .stat-value {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
});

WeatherStats.displayName = 'WeatherStats';

export default WeatherStats;
