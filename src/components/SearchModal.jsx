import { memo, useRef, useEffect, useState } from 'react';
import { useSearchCities } from '../hooks/useWeather.js';

const SearchModal = memo(({
  isOpen,
  onClose,
  onSelectCity,
  recentCities = [],
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { results, searching } = useSearchCities(query);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectCity = (city) => {
    onSelectCity(city);
    setQuery('');
    onClose();
  };

  return (
    <div className="search-modal">
      <div className="search-header">
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar cidade..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button
          onClick={onClose}
          className="close-btn"
          aria-label="Fechar busca"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="search-content">
        {query ? (
          searching ? (
            <div className="search-loading">
              <div className="spinner" />
              <div>Buscando...</div>
            </div>
          ) : results.length > 0 ? (
            <div className="search-results">
              {results.map((city, i) => (
                <button
                  key={i}
                  className="search-result-item"
                  onClick={() =>
                    handleSelectCity({
                      city: city.displayName,
                      lat: city.lat,
                      lon: city.lon,
                    })
                  }
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <div className="result-name">{city.name}</div>
                    {city.state && (
                      <div className="result-state">{city.state}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="search-empty">
              <div className="empty-icon">🔍</div>
              <div>Nenhuma cidade encontrada</div>
            </div>
          )
        ) : recentCities.length > 0 ? (
          <div className="recent-cities">
            <div className="recent-title">Cidades recentes</div>
            {recentCities.map((city, i) => (
              <button
                key={i}
                className="recent-item"
                onClick={() => handleSelectCity(city)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                <div>{city.city}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="search-empty">
            <div className="empty-icon">📍</div>
            <div>Digite o nome de uma cidade</div>
          </div>
        )}
      </div>

      <style jsx>{`
        .search-modal {
          position: absolute;
          inset: 0;
          background: rgba(5, 15, 40, 0.97);
          backdrop-filter: blur(30px);
          z-index: 200;
          display: flex;
          flex-direction: column;
          padding: calc(env(safe-area-inset-top) + 16px) 18px 20px;
          animation: fadeUp 0.2s ease;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(14px);
          border-radius: 12px;
          padding: 12px 16px;
          color: rgba(255, 255, 255, 1);
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 0 3px rgba(26, 111, 196, 0.2);
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.72);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }

        .close-btn:hover {
          color: rgba(255, 255, 255, 1);
          background: rgba(255, 255, 255, 0.08);
        }

        .search-content {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .search-loading,
        .search-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-icon {
          font-size: 3rem;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #1a6fc4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .search-results,
        .recent-cities {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .recent-title {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.5;
          padding: 16px 0 8px;
        }

        .search-result-item,
        .recent-item {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 1);
          font-family: inherit;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .search-result-item:hover,
        .recent-item:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(4px);
        }

        .search-result-item:active,
        .recent-item:active {
          opacity: 0.7;
        }

        .result-name {
          font-weight: 600;
        }

        .result-state {
          font-size: 0.8rem;
          opacity: 0.6;
          margin-top: 2px;
        }

        @media (max-width: 640px) {
          .search-modal {
            padding: calc(env(safe-area-inset-top) + 12px) 14px 16px;
          }

          .search-header {
            margin-bottom: 12px;
            gap: 10px;
          }

          .search-input {
            padding: 10px 14px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
});

SearchModal.displayName = 'SearchModal';

export default SearchModal;
