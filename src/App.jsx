import { useState, useCallback, useMemo } from 'react';
import WeatherHeader from './components/WeatherHeader.jsx';
import CurrentWeather from './components/CurrentWeather.jsx';
import AlertBanner from './components/AlertBanner.jsx';
import HourlyForecast from './components/HourlyForecast.jsx';
import DailyForecast from './components/DailyForecast.jsx';
import WeatherStats from './components/WeatherStats.jsx';
import SearchModal from './components/SearchModal.jsx';
import BottomNavigation from './components/BottomNavigation.jsx';
import InstallBanner from './components/InstallBanner.jsx';
import ErrorState from './components/ErrorState.jsx';
import SkeletonLoader from './components/SkeletonLoader.jsx';
import {
  useWeather,
  useGeolocation,
  useLocalStorage,
  usePWAInstall,
  useSkyTheme,
} from './hooks/useWeather.js';
import { STARS } from './utils/constants.js';
import './styles/global.css';

function App() {
  const [activeNav, setActiveNav] = useState('hoje');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recentCities, setRecentCities] = useLocalStorage('cc_recent_cities', []);

  // Geolocation hook
  const { coords: userCoords, loading: geoLoading, error: geoError } = useGeolocation();

  // Determine location to use
  const location = useMemo(() => {
    if (selectedLocation) return selectedLocation;
    if (userCoords) return userCoords;
    return null;
  }, [selectedLocation, userCoords]);

  // Weather data hook
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useWeather(location?.lat, location?.lon, location?.city);

  // Sky theme based on time of day
  const skyTheme = useSkyTheme(weatherData);

  // PWA install prompt
  const {
    showInstallBanner,
    handleInstall,
    dismissBanner,
    canInstall,
  } = usePWAInstall();

  // Handle city selection from search
  const handleSelectCity = useCallback(
    (city) => {
      setSelectedLocation(city);
      
      // Add to recent cities
      setRecentCities((prev) => {
        const filtered = prev.filter((c) => c.city !== city.city);
        return [city, ...filtered].slice(0, 5);
      });
    },
    [setRecentCities]
  );

  // Loading state
  const isLoading = weatherLoading || geoLoading;

  // Error state
  const hasError = !isLoading && (weatherError || (!weatherData && !geoLoading));

  // Render error or loading
  if (hasError) {
    return (
      <div
        className="app-container"
        style={{
          background: `linear-gradient(135deg, ${skyTheme.top}, ${skyTheme.mid}, ${skyTheme.bot})`,
        }}
      >
        <WeatherHeader onSearch={() => setShowSearch(true)} />
        <ErrorState error={weatherError} onRetry={refetchWeather} />
        <BottomNavigation activeNav={activeNav} onNavClick={setActiveNav} />
      </div>
    );
  }

  return (
    <div
      className="app-container"
      style={{
        background: `linear-gradient(135deg, ${skyTheme.top}, ${skyTheme.mid}, ${skyTheme.bot})`,
      }}
    >
      {/* Sky background with stars for night */}
      {skyTheme.isNight && (
        <div className="stars-container">
          {STARS.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                animation: `twinkle ${star.dur}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="content-wrapper">
        <WeatherHeader onSearch={() => setShowSearch(true)} />

        {isLoading ? (
          <SkeletonLoader type="full" />
        ) : weatherData ? (
          <>
            <CurrentWeather
              weatherData={weatherData}
              onLocationClick={() => setShowSearch(true)}
            />
            <AlertBanner weatherData={weatherData} />
            <HourlyForecast hours={weatherData.hours} />
            <DailyForecast days={weatherData.days} />
            <WeatherStats weatherData={weatherData} />
          </>
        ) : null}
      </div>

      {/* Search modal */}
      {showSearch && (
        <SearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSelectCity={handleSelectCity}
          recentCities={recentCities}
        />
      )}

      {/* Install banner */}
      {showInstallBanner && canInstall && (
        <InstallBanner
          onInstall={handleInstall}
          onDismiss={dismissBanner}
        />
      )}

      {/* Navigation */}
      <BottomNavigation activeNav={activeNav} onNavClick={setActiveNav} />

      <style jsx>{`
        .app-container {
          position: fixed;
          inset: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: background 0.5s ease;
        }

        .stars-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .star {
          position: absolute;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8),
            transparent
          );
          border-radius: 50%;
        }

        .content-wrapper {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          z-index: 10;
          scrollbar-width: none;
        }

        .content-wrapper::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 640px) {
          .app-container {
            max-width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
