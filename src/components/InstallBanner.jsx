import { memo } from 'react';

const InstallBanner = memo(({ onInstall, onDismiss }) => {
  return (
    <div className="install-banner">
      <div className="install-icon">⬇️</div>
      <div className="install-content">
        <div className="install-title">Instale CéuClaro</div>
        <div className="install-message">
          Acesso rápido e offline na tela inicial
        </div>
      </div>
      <div className="install-actions">
        <button
          className="install-btn-action"
          onClick={onInstall}
          aria-label="Instalar app"
        >
          Instalar
        </button>
        <button
          className="install-btn-dismiss"
          onClick={onDismiss}
          aria-label="Descartar"
        >
          ✕
        </button>
      </div>

      <style jsx>{`
        .install-banner {
          position: fixed;
          bottom: 90px;
          left: 18px;
          right: 18px;
          background: rgba(26, 111, 196, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 18px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 150;
          animation: fadeUp 0.4s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .install-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          animation: floatIcon 3.5s ease-in-out infinite;
        }

        .install-content {
          flex: 1;
          min-width: 0;
        }

        .install-title {
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .install-message {
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .install-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .install-btn-action {
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 8px;
          padding: 6px 12px;
          color: #fff;
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }

        .install-btn-action:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .install-btn-action:active {
          transform: scale(0.95);
        }

        .install-btn-dismiss {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 4px 6px;
          font-size: 1rem;
          transition: color 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .install-btn-dismiss:hover {
          color: rgba(255, 255, 255, 1);
        }

        @media (max-width: 640px) {
          .install-banner {
            bottom: 80px;
            left: 14px;
            right: 14px;
            padding: 12px 14px;
            gap: 10px;
          }

          .install-title {
            font-size: 0.8rem;
          }

          .install-message {
            font-size: 0.7rem;
          }

          .install-btn-action {
            padding: 5px 10px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
});

InstallBanner.displayName = 'InstallBanner';

export default InstallBanner;
