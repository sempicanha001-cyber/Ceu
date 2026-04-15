/**
 * WMO Weather Code Mappings
 * ISO 3166-1 compliant weather codes
 */
export const WMO_CODES = {
  0: ['☀️', 'Céu limpo'],
  1: ['🌤️', 'Principalmente limpo'],
  2: ['⛅', 'Parcialmente nublado'],
  3: ['☁️', 'Nublado'],
  45: ['🌫️', 'Névoa'],
  48: ['🌫️', 'Névoa com geada'],
  51: ['🌦️', 'Garoa leve'],
  53: ['🌦️', 'Garoa moderada'],
  55: ['🌧️', 'Garoa intensa'],
  61: ['🌧️', 'Chuva leve'],
  63: ['🌧️', 'Chuva moderada'],
  65: ['🌧️', 'Chuva forte'],
  71: ['🌨️', 'Neve leve'],
  73: ['🌨️', 'Neve moderada'],
  75: ['❄️', 'Neve forte'],
  80: ['🌦️', 'Pancadas leves'],
  81: ['🌧️', 'Pancadas moderadas'],
  82: ['⛈️', 'Pancadas fortes'],
  95: ['⛈️', 'Tempestade'],
  96: ['⛈️', 'Tempestade c/ granizo'],
  99: ['⛈️', 'Tempestade forte'],
};

export const UV_CATEGORIES = {
  LOW: { max: 2, label: 'Baixo', color: '#4ade80' },
  MODERATE: { max: 5, label: 'Moderado', color: '#facc15' },
  HIGH: { max: 7, label: 'Alto', color: '#fb923c' },
  VERY_HIGH: { max: 10, label: 'Muito alto', color: '#f87171' },
  EXTREME: { max: Infinity, label: 'Extremo', color: '#c084fc' },
};

export const WIND_DIRECTIONS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];

export const API_CONFIG = {
  WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
  GEOCODING_API: 'https://geocoding-api.open-meteo.com/v1/search',
  TIMEOUT: 8000,
  RETRY_COUNT: 2,
  RETRY_DELAY: 1000,
};

export const CACHE_CONFIG = {
  WEATHER_CACHE_KEY: 'cc_weather_cache',
  LOCATION_CACHE_KEY: 'cc_location_cache',
  LAST_CITY_KEY: 'cc_last_city',
  CACHE_DURATION: 30 * 60 * 1000, // 30 min
  SEARCH_CACHE_DURATION: 24 * 60 * 60 * 1000, // 24h
};

export const DEFAULT_LOCATION = {
  city: 'São Paulo',
  lat: -23.55,
  lon: -46.63,
};

export const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.5 + 1,
  top: Math.random() * 65,
  left: Math.random() * 100,
  dur: 2 + Math.random() * 3,
  delay: Math.random() * 3,
}));

// Feature flags for monetization
export const FEATURE_FLAGS = {
  PREMIUM_FEATURES_ENABLED: false,
  ADS_ENABLED: false,
  SOLUNAR_CALCULATIONS: false,
  EXTENDED_FORECAST: false, // 7-day vs 14-day toggle
};

// Navigation items configuration
export const NAV_ITEMS = [
  {
    id: 'hoje',
    label: 'Hoje',
    target: 'sec-hoje',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    id: 'prev',
    label: 'Previsão',
    target: 'sec-prev',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  {
    id: 'det',
    label: 'Detalhes',
    target: 'sec-det',
    icon: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
        <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
        <path d="M20.07 3.93a12 12 0 0 1 0 16.97" />
        <path d="M3.93 20.07a12 12 0 0 1 0-16.97" />
      </>
    ),
  },
];
