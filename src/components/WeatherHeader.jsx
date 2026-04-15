import { memo } from 'react';

const WeatherHeader = memo(({ onSearch, isDarkMode = false }) => {
  return (
    <header className="weather-header">
      <div className="logo">
        Céu<span className="logo-light">Claro</span>
      </div>
      <div className="header-actions">
        <button
          className="header-btn"
          onClick={onSearch}
          aria-label="Buscar cidades"
          title="Buscar cidades"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <button
          className="header-btn"
          aria-label="Menu"
          title="Menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <style>{`
        .weather-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: calc(env(safe-area-inset-top) + 16px) 22px 10px;
          position: relative;
          z-index: 10;
        }

        .logo {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 1.35rem;
          letter-spacing: -0.5px;
          user-select: none;
        }

        .logo-light {
          opacity: 0.7;
          font-weight: 300;
        }

        .header-actions {
          display: flex;
          gap: 18px;
          align-items: center;
        }

        .header-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.88);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .header-btn:hover {
          color: rgba(255, 255, 255, 1);
          background: rgba(255, 255, 255, 0.08);
        }

        .header-btn:active {
          opacity: 0.7;
          transform: scale(0.95);
        }

        @media (max-width: 640px) {
          .weather-header {
            padding: calc(env(safe-area-inset-top) + 12px) 16px 8px;
          }

          .logo {
            font-size: 1.2rem;
          }

          .header-actions {
            gap: 12px;
          }
        }
      `}</style>
    </header>
  );
});

WeatherHeader.displayName = 'WeatherHeader';

export default WeatherHeader;
