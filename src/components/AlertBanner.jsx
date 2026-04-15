import { memo, useMemo } from 'react';
import { getUVLabel } from '../utils/formatters.js';

const AlertBanner = memo(({ weatherData }) => {
  const { current, days } = weatherData;
  const { uv } = current;
  const weatherCode = current.weatherCode;

  const alert = useMemo(() => {
    if (uv >= 6) {
      return {
        icon: '☀️',
        title: 'Proteção Solar',
        message: `Índice UV ${Math.round(uv)} (${getUVLabel(uv)}) hoje. Use protetor solar e evite 10h–16h.`,
        severity: 'high',
      };
    }
    if (weatherCode >= 80) {
      return {
        icon: '⛈️',
        title: 'Chuva Prevista',
        message: 'Pancadas previstas. Leve guarda-chuva!',
        severity: 'medium',
      };
    }
    if (current.windSpeed > 40) {
      return {
        icon: '💨',
        title: 'Vento Forte',
        message: `Vento de ${Math.round(current.windSpeed)} km/h. Cuidado em áreas abertas.`,
        severity: 'medium',
      };
    }
    
    return {
      icon: '🌡️',
      title: 'Clima Agradável',
      message: 'Condições favoráveis para atividades ao ar livre.',
      severity: 'low',
    };
  }, [uv, weatherCode, current.windSpeed]);

  return (
    <div className={`alert-banner alert-${alert.severity}`}>
      <div className="alert-icon">{alert.icon}</div>
      <div className="alert-content">
        <div className="alert-title">{alert.title}</div>
        <div className="alert-message">{alert.message}</div>
      </div>

      <style>{`
        .alert-banner {
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(14px);
          margin: 18px 18px 0;
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          animation: fadeUp 0.7s 0.15s ease both;
        }

        .alert-high {
          background: rgba(255, 87, 34, 0.15);
          border-color: rgba(255, 87, 34, 0.4);
        }

        .alert-medium {
          background: rgba(255, 152, 0, 0.15);
          border-color: rgba(255, 152, 0, 0.4);
        }

        .alert-low {
          background: rgba(76, 175, 80, 0.15);
          border-color: rgba(76, 175, 80, 0.4);
        }

        .alert-icon {
          font-size: 2rem;
          flex-shrink: 0;
          line-height: 1;
        }

        .alert-content {
          flex: 1;
          min-width: 0;
        }

        .alert-title {
          font-size: 0.76rem;
          font-weight: 600;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }

        .alert-message {
          font-size: 0.88rem;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 640px) {
          .alert-banner {
            margin: 14px 14px 0;
            padding: 12px 14px;
            gap: 12px;
          }

          .alert-icon {
            font-size: 1.8rem;
          }

          .alert-message {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
});

AlertBanner.displayName = 'AlertBanner';

export default AlertBanner;
