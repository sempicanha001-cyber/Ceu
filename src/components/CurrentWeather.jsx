import { memo, useMemo } from 'react';
import {
  getWeatherInfo,
  formatTemperature,
  getCurrentTimeString,
} from '../utils/formatters.js';

const CurrentWeather = memo(({ weatherData, onLocationClick }) => {
  const {
    city,
    current: { temp, feelsLike, weatherCode },
    sunrise,
    sunset,
  } = weatherData;

  const [icon, description] = useMemo(
    () => getWeatherInfo(weatherCode),
    [weatherCode]
  );

  const currentTime = useMemo(() => getCurrentTimeString(), []);

  return (
    <div className="current-weather">
      <div className="location-bar">
        <button
          className="location-btn"
          onClick={onLocationClick}
          aria-label={`Localização: ${city}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <div className="location-info">
            <span className="location-name">{city}</span>
            <span className="location-time">{currentTime}</span>
          </div>
        </button>
        <button
          className="search-btn"
          onClick={onLocationClick}
          aria-label="Buscar cidade"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Buscar
        </button>
      </div>

      <div className="temp-display">
        <div className="weather-icon">{icon}</div>
        <div className="main-temp">
          {Math.round(temp)}<sup>°</sup>
        </div>
        <div className="weather-description">{description}</div>
        <div className="feels-like">
          Sensação térmica <strong>{formatTemperature(feelsLike)}</strong>
        </div>
      </div>

      <style>{`
        .current-weather {
          animation: fadeUp 0.7s ease both;
        }

        .location-bar {
          margin: 8px 18px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .location-btn {
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(14px);
          border-radius: 30px;
          padding: 7px 16px 7px 12px;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          color: rgba(255, 255, 255, 1);
          transition: all 0.2s ease;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }

        .location-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .location-btn:active {
          transform: scale(0.98);
        }

        .location-info {
          display: flex;
          align-items: baseline;
          gap: 6px;
          min-width: 0;
        }

        .location-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .location-time {
          font-weight: 300;
          opacity: 0.75;
          font-size: 0.78rem;
        }

        .search-btn {
          background: rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 30px;
          padding: 7px 14px;
          font-size: 0.8rem;
          color: #fff;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: inherit;
          font-weight: 600;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .search-btn:hover {
          background: rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .search-btn:active {
          transform: scale(0.98);
        }

        .temp-display {
          text-align: center;
          padding: 28px 20px 10px;
        }

        .weather-icon {
          font-size: 4rem;
          margin-bottom: -10px;
          display: inline-block;
          animation: floatIcon 3.5s ease-in-out infinite;
        }

        .main-temp {
          font-size: 7rem;
          font-weight: 200;
          line-height: 1;
          letter-spacing: -4px;
          text-shadow: 0 4px 24px rgba(0, 0, 100, 0.18);
        }

        .main-temp sup {
          font-size: 2.5rem;
          font-weight: 300;
          vertical-align: super;
          margin-left: 4px;
        }

        .weather-description {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 6px 0 3px;
          text-shadow: 0 2px 8px rgba(0, 0, 80, 0.15);
        }

        .feels-like {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.72);
        }

        .feels-like strong {
          color: #fff;
        }

        @media (max-width: 640px) {
          .main-temp {
            font-size: 5.5rem;
          }

          .weather-icon {
            font-size: 3.5rem;
          }

          .temp-display {
            padding: 20px 16px 8px;
          }

          .location-bar {
            margin: 6px 14px 0;
          }
        }
      `}</style>
    </div>
  );
});

CurrentWeather.displayName = 'CurrentWeather';

export default CurrentWeather;
