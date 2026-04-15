import { memo } from 'react';

const SkeletonLoader = memo(({ type = 'full' }) => {
  if (type === 'full') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-header">
          <div className="skeleton skeleton-text-lg" />
          <div className="skeleton skeleton-text-sm" />
        </div>

        <div className="skeleton-temp">
          <div className="skeleton skeleton-icon" />
          <div className="skeleton skeleton-text-xl" />
        </div>

        <div className="skeleton-alert">
          <div className="skeleton skeleton-text-sm" />
        </div>

        <div className="skeleton-hourly">
          <div className="skeleton skeleton-text-xs" />
          <div className="skeleton-hour-cards">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-hour-card" />
            ))}
          </div>
        </div>

        <div className="skeleton-daily">
          <div className="skeleton skeleton-text-xs" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-day-row" />
          ))}
        </div>

        <style>{`
          .skeleton-container {
            animation: fadeUp 0.3s ease;
          }

          .skeleton {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0.1) 100%
            );
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
            border-radius: 8px;
          }

          .skeleton-header {
            padding: 54px 22px 10px;
            display: flex;
            justify-content: space-between;
            gap: 12px;
          }

          .skeleton-text-lg {
            width: 120px;
            height: 28px;
          }

          .skeleton-text-sm {
            width: 80px;
            height: 20px;
          }

          .skeleton-temp {
            text-align: center;
            padding: 28px 20px;
          }

          .skeleton-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 12px;
            border-radius: 12px;
          }

          .skeleton-text-xl {
            width: 120px;
            height: 48px;
            margin: 0 auto 16px;
          }

          .skeleton-alert {
            margin: 18px 18px 0;
            padding: 14px 16px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.08);
          }

          .skeleton-hourly {
            padding: 22px 20px 8px;
          }

          .skeleton-text-xs {
            width: 80px;
            height: 14px;
            margin-bottom: 12px;
          }

          .skeleton-hour-cards {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding-top: 8px;
          }

          .skeleton-hour-card {
            flex-shrink: 0;
            width: 64px;
            height: 90px;
            border-radius: 18px;
          }

          .skeleton-daily {
            margin: 22px 18px 0;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.08);
            overflow: hidden;
          }

          .skeleton-day-row {
            height: 50px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            margin: 12px 18px;
          }

          .skeleton-day-row:last-child {
            border-bottom: none;
          }

          @media (max-width: 640px) {
            .skeleton-header {
              padding: 48px 16px 8px;
            }

            .skeleton-temp {
              padding: 20px 16px;
            }

            .skeleton-alert {
              margin: 14px 14px 0;
            }

            .skeleton-hourly,
            .skeleton-daily {
              margin-left: 14px;
              margin-right: 14px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="skeleton skeleton-small" />
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;
