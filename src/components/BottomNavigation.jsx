import { memo } from 'react';
import { NAV_ITEMS } from '../utils/navItems.jsx';

const BottomNavigation = memo(({ activeNav, onNavClick }) => {
  const scrollToSection = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleNavClick = (item) => {
    onNavClick(item.id);
    scrollToSection(item.target);
  };

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${activeNav === item.id ? 'active' : ''}`}
          onClick={() => handleNavClick(item)}
          aria-label={item.label}
          title={item.label}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </button>
      ))}

      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 430px;
          background: rgba(10, 50, 100, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          justify-content: space-around;
          padding: 10px 0 calc(20px + env(safe-area-inset-bottom));
          z-index: 100;
        }

        .nav-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.55);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 4px 16px;
          border-radius: 12px;
          transition: all 0.15s ease;
          font-family: inherit;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          -webkit-tap-highlight-color: transparent;
        }

        .nav-btn:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .nav-btn.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-btn:active {
          opacity: 0.7;
          transform: scale(0.95);
        }

        @media (max-width: 640px) {
          .bottom-nav {
            max-width: 100%;
            padding: 8px 0 calc(16px + env(safe-area-inset-bottom));
          }

          .nav-btn {
            padding: 2px 12px;
            gap: 3px;
            font-size: 0.65rem;
          }

          .nav-btn svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </nav>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;
