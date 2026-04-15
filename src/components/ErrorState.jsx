import { memo } from 'react';

const ErrorState = memo(({ error, onRetry, isDarkMode = false }) => {
  const getErrorMessage = (errorMsg) => {
    if (!errorMsg) return 'Algo deu errado ao carregar a previsão';
    if (errorMsg.includes('timeout')) {
      return 'Conexão lenta demais. Verifique sua internet e tente novamente.';
    }
    if (errorMsg.includes('Failed to fetch')) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }
    if (errorMsg.includes('offline')) {
      return 'Você está offline. Nenhum dado disponível no cache.';
    }
    return errorMsg;
  };

  const getErrorIcon = (errorMsg) => {
    if (!errorMsg) return '⚠️';
    if (errorMsg.includes('offline')) return '📡';
    if (errorMsg.includes('timeout')) return '⏱️';
    return '❌';
  };

  return (
    <div className="error-container">
      <div className="error-icon">{getErrorIcon(error)}</div>
      <div className="error-message">{getErrorMessage(error)}</div>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Tentar Novamente
        </button>
      )}

      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 60px 20px;
          text-align: center;
          min-height: 400px;
          animation: fadeUp 0.5s ease;
        }

        .error-icon {
          font-size: 3rem;
          animation: pulse 2s infinite;
        }

        .error-message {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.72);
          max-width: 300px;
          line-height: 1.5;
        }

        .error-retry-btn {
          background: rgba(26, 111, 196, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 10px 24px;
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          margin-top: 12px;
          -webkit-tap-highlight-color: transparent;
        }

        .error-retry-btn:hover {
          background: rgba(26, 111, 196, 1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26, 111, 196, 0.3);
        }

        .error-retry-btn:active {
          transform: translateY(0);
          opacity: 0.8;
        }

        @media (max-width: 640px) {
          .error-container {
            padding: 40px 16px;
            gap: 16px;
          }

          .error-icon {
            font-size: 2.5rem;
          }

          .error-message {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;
