import { useState, useCallback, useEffect, useRef } from 'react';
import weatherService from '../services/weatherApi.js';
import { CACHE_CONFIG, DEFAULT_LOCATION } from '../utils/constants.js';

/**
 * Hook for weather data fetching with error handling
 */
export const useWeather = (lat, lon, city) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    try {
      const weatherData = await weatherService.fetchWeather(lat, lon, city);
      setData(weatherData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar previsão');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, city]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

/**
 * Hook for geolocation with fallback
 */
export const useGeolocation = () => {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Fallback to default location
      setCoords({
        lat: DEFAULT_LOCATION.lat,
        lon: DEFAULT_LOCATION.lon,
        city: DEFAULT_LOCATION.city,
        source: 'default',
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Try to get city name
        let city = DEFAULT_LOCATION.city;
        try {
          city = await weatherService.getLocationName(latitude, longitude);
        } catch (err) {
          console.warn('Could not get location name:', err);
        }

        setCoords({
          lat: latitude,
          lon: longitude,
          city,
          source: 'geolocation',
        });
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation denied:', err);
        
        // Fallback to default
        setCoords({
          lat: DEFAULT_LOCATION.lat,
          lon: DEFAULT_LOCATION.lon,
          city: DEFAULT_LOCATION.city,
          source: 'fallback',
        });
        setError('Localização não permitida');
        setLoading(false);
      },
      {
        timeout: 8000,
        maximumAge: 60 * 60 * 1000, // 1h cache
      }
    );
  }, []);

  return { coords, loading, error };
};

/**
 * Hook for city search with debounce
 */
export const useSearchCities = (query, delay = 300) => {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query || query.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    setError(null);

    // Debounce search
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await weatherService.searchCities(query);
        setResults(data);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, delay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, delay]);

  return { results, searching, error };
};

/**
 * Hook for localStorage persistence
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('localStorage read error:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('localStorage write error:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * Hook for PWA install prompt
 */
export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);

      // Show banner on 2nd visit or after 5s
      const visits = parseInt(localStorage.getItem('cc_visits') || '0') + 1;
      localStorage.setItem('cc_visits', visits);

      if (visits >= 2 || localStorage.getItem('cc_install_dismissed') !== 'true') {
        setTimeout(() => setShowInstallBanner(true), 5000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  const dismissBanner = useCallback(() => {
    setShowInstallBanner(false);
    localStorage.setItem('cc_install_dismissed', 'true');
  }, []);

  return {
    installPrompt,
    showInstallBanner,
    handleInstall,
    dismissBanner,
    canInstall: !!installPrompt,
  };
};

/**
 * Hook for sky theme based on time of day
 */
export const useSkyTheme = (weatherData) => {
  const [theme, setTheme] = useState({
    top: '#1a3a6c',
    mid: '#1a6fc4',
    bot: '#6dbfee',
    isNight: false,
  });

  useEffect(() => {
    if (!weatherData) return;

    const { nowMs, sunriseMs, sunsetMs } = weatherData;
    const dawn = sunriseMs - 45 * 60000;
    const morn = sunriseMs + 60 * 60000;
    const dusk = sunsetMs - 60 * 60000;
    const night = sunsetMs + 45 * 60000;

    let newTheme;
    if (nowMs < dawn || nowMs > night) {
      newTheme = {
        top: '#0a0e2e',
        mid: '#0d1b4b',
        bot: '#1a2d6e',
        isNight: true,
      };
    } else if (nowMs < morn) {
      newTheme = {
        top: '#2c1654',
        mid: '#c45c2b',
        bot: '#f7c47e',
        isNight: false,
      };
    } else if (nowMs < dusk) {
      newTheme = {
        top: '#1a6fc4',
        mid: '#3a9ad9',
        bot: '#6dbfee',
        isNight: false,
      };
    } else {
      newTheme = {
        top: '#1a2d6e',
        mid: '#b5451e',
        bot: '#f9a451',
        isNight: false,
      };
    }

    setTheme(newTheme);
  }, [weatherData]);

  return theme;
};
