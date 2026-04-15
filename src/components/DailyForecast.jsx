import { memo, useMemo } from 'react';
import {
  getWeatherInfo,
  formatDayName,
  formatTemperature,
} from '../utils/formatters.js';

const DailyForecast = memo(({ days }) => {
  const processedDays = useMemo(() => {
    return days.map((day, i) => ({
      ...day,
      displayName: formatDayName(day.date, i),
      icon: getWeatherInfo(day.weatherCode)[0],
      tempHi: Math.round(day.tempMax),
      tempLo: Math.round(day.tempMin),
    }));
  }, [days]);

  return (
    <div className="daily-section">
      <div className="section-title">Próximos 7 dias</div>
      <div className="daily-container">
        {processedDays.map((day, i) => (
          <div key={`${day.date}-${i}`} className="day-row">
            <div className="day-name">{day.displayName}</div>
            <div className="day-icon">{day.icon}</div>
            {day.precipProb !== null && day.precipProb > 0 && (
              <div className="day-precip">💧{day.precipProb}%</div>
            )}
            <div className="day-temps">
              <span className="temp-hi">{day.tempHi}°</span>
              <span className="temp-lo">{day.tempLo}°</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .daily-section {
          animation: fadeUp 0.7s 0.35s ease both;
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

        .daily-container {
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(14px);
          margin: 0 18px;
          border-radius: 20px;
          overflow: hidden;
        }

        .day-row {
          display: grid;
          grid-template-columns: 1fr 44px 44px 80px;
          align-items: center;
          padding: 13px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          gap: 8px;
          transition: background 0.15s ease;
        }

        .day-row:last-child {
          border-bottom: none;
        }

        .day-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .day-name {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .day-icon {
          font-size: 1.4rem;
          text-align: center;
        }

        .day-precip {
          font-size: 0.72rem;
          color: #a8d8ff;
          opacity: 0.85;
          white-space: nowrap;
          text-align: center;
        }

        .day-temps {
          text-align: right;
          font-size: 0.9rem;
          display: flex;
          justify-content: flex-end;
          gap: 6px;
        }

        .temp-hi {
          font-weight: 700;
        }

        .temp-lo {
          opacity: 0.55;
        }

        @media (max-width: 640px) {
          .section-title {
            padding: 18px 16px 6px;
            font-size: 0.7rem;
          }

          .daily-container {
            margin: 0 14px;
          }

          .day-row {
            grid-template-columns: 1fr 40px 40px 70px;
            padding: 10px 14px;
            gap: 6px;
          }

          .day-name {
            font-size: 0.8rem;
          }

          .day-icon {
            font-size: 1.2rem;
          }

          .day-temps {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
});

DailyForecast.displayName = 'DailyForecast';

export default DailyForecast;
