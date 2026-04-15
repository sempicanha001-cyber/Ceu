import {
  WMO_CODES,
  UV_CATEGORIES,
  WIND_DIRECTIONS,
} from './constants.js';

/**
 * Get WMO weather code description and icon
 */
export const getWeatherInfo = (code) => {
  return WMO_CODES[code] || ['🌡️', 'Desconhecido'];
};

/**
 * Get UV index label based on value
 */
export const getUVLabel = (uvIndex) => {
  const categories = Object.values(UV_CATEGORIES);
  for (const cat of categories) {
    if (uvIndex <= cat.max) return cat.label;
  }
  return 'Extremo';
};

/**
 * Get UV index color based on value
 */
export const getUVColor = (uvIndex) => {
  const categories = Object.values(UV_CATEGORIES);
  for (const cat of categories) {
    if (uvIndex <= cat.max) return cat.color;
  }
  return UV_CATEGORIES.EXTREME.color;
};

/**
 * Get wind direction abbreviation
 */
export const getWindDirection = (degrees) => {
  const index = Math.round(degrees / 45) % 8;
  return WIND_DIRECTIONS[index];
};

/**
 * Pad number with leading zero
 */
export const pad = (n) => String(n).padStart(2, '0');

/**
 * Format time string (HH:MM)
 */
export const formatTime = (isoString) => {
  const date = new Date(isoString);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Format date as day name
 */
export const formatDayName = (isoDate, index) => {
  if (index === 0) return 'Hoje';
  if (index === 1) return 'Amanhã';
  
  const date = new Date(isoDate + 'T12:00:00');
  return date
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '');
};

/**
 * Format temperature with degree symbol
 */
export const formatTemperature = (temp) => {
  return `${Math.round(temp)}°`;
};

/**
 * Format humidity percentage
 */
export const formatHumidity = (humidity) => {
  return `${humidity}%`;
};

/**
 * Format wind speed
 */
export const formatWindSpeed = (speed) => {
  return `${Math.round(speed)} km/h`;
};

/**
 * Calculate UV index percentage for visualization
 */
export const getUVPercentage = (uvIndex) => {
  return Math.min(100, (uvIndex / 12) * 100).toFixed(0);
};

/**
 * Get current date-time string for display
 */
export const getCurrentTimeString = () => {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    month: 'short',
    day: 'numeric',
  });
};
