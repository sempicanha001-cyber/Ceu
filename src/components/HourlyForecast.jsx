import { memo, useMemo } from 'react';
import {
  getWeatherInfo,
  formatTime,
  formatTemperature,
} from '../utils/formatters.js';

const HourlyForecast = memo(({ hours }) => {
  const processedHours = useMemo(() => {
    return hours.map((hour, i) => ({
      ...hour,
      isNow: i === 0,
      displayTime: i === 0 ? 'Agora' : formatTime(hour.time),
      [getWeatherInfo(hour.weatherCode)]: true,
      icon: getWeatherInfo(hour.weatherCode)[0],
      temp: Math.round(hour.temp),
    }));
  }, [hours]);

  return (
    <div className="hourly-section">
      <div className="section-title">Por hora</div>
      <div className="hourly-scroll">
        {processedHours.map((hour, i) => (
          <div
            key={`${hour.time}-${i}`}
            className={`hour-card ${hour.isNow ? 'now' : ''}`}
          >
            <div className="hour-time">{hour.displayTime}</div>
            <div className="hour-icon">{hour.icon}</div>
            <div className="hour-temp">{hour.temp}°</div>
            {hour.precipProb !== null && hour.precipProb > 0 && (
              <div className="hour-precip">
                💧{hour.precipProb}%
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .hourly-section {
          animation: fadeUp 0.7s 0.25s ease both;
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

        .hourly-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 0 18px 8px;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .hourly-scroll::-webkit-scrollbar {
          display: none;
        }

        .hour-card {
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(14px);
          border-radius: 18px;
          padding: 12px 14px;
          text-align: center;
          min-width: 64px;
          transition: all 0.2s ease;
          cursor: pointer;
          will-change: background, transform;
        }

        .hour-card:hover {
          background: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
        }

        .hour-card.now {
          background: rgba(255, 255, 255, 0.22);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 20px rgba(58, 154, 217, 0.3);
        }

        .hour-time {
          font-size: 0.75rem;
          opacity: 0.72;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .hour-icon {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .hour-temp {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .hour-precip {
          font-size: 0.68rem;
          opacity: 0.7;
          color: #a8d8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          min-height: 14px;
        }

        @media (max-width: 640px) {
          .section-title {
            padding: 18px 16px 6px;
            font-size: 0.7rem;
          }

          .hourly-scroll {
            padding: 0 14px 6px;
            gap: 8px;
          }

          .hour-card {
            min-width: 58px;
            padding: 10px 12px;
          }

          .hour-icon {
            font-size: 1.3rem;
          }

          .hour-temp {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
});

HourlyForecast.displayName = 'HourlyForecast';

export default HourlyForecast;
