import {
  API_CONFIG,
  CACHE_CONFIG,
  DEFAULT_LOCATION,
} from '../utils/constants.js';

class WeatherService {
  constructor() {
    this.cache = new Map();
    this.requestQueue = new Map();
  }

  /**
   * Get cached value if exists and not expired
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired =
      Date.now() - cached.timestamp > CACHE_CONFIG.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cache value
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Fetch with timeout and retry logic
   */
  async fetchWithRetry(url, options = {}) {
    const {
      timeout = API_CONFIG.TIMEOUT,
      retries = API_CONFIG.RETRY_COUNT,
      retryDelay = API_CONFIG.RETRY_DELAY,
    } = options;

    let lastError;
    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          timeout
        );

        const response = await fetch(url, {
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;

        // Don't retry on abort or last attempt
        if (i < retries && !(error.name === 'AbortError')) {
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay)
          );
        }
      }
    }

    throw new Error(
      `Failed to fetch after ${retries} retries: ${lastError.message}`
    );
  }

  /**
   * Fetch weather data with stale-while-revalidate pattern
   */
  async fetchWeather(lat, lon, city) {
    const cacheKey = `${CACHE_CONFIG.WEATHER_CACHE_KEY}:${lat}:${lon}`;
    
    // Check if request is already in flight (deduplication)
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    // Try to return cached data while updating in background
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      // Start background update
      this.updateWeatherInBackground(cacheKey, lat, lon, city);
      return cached;
    }

    // No cache, fetch fresh
    const promise = this.fetchWeatherFresh(cacheKey, lat, lon, city);
    this.requestQueue.set(cacheKey, promise);

    try {
      const data = await promise;
      return data;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  /**
   * Fetch fresh weather data from API
   */
  async fetchWeatherFresh(cacheKey, lat, lon, city) {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current:
        'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,uv_index',
      hourly: 'temperature_2m,weather_code,precipitation_probability',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '7',
    });

    const url = `${API_CONFIG.WEATHER_API}?${params}`;
    const rawData = await this.fetchWithRetry(url);

    const processed = this.processWeatherData(rawData, city);
    this.setCache(cacheKey, processed);
    return processed;
  }

  /**
   * Update weather in background without blocking
   */
  async updateWeatherInBackground(cacheKey, lat, lon, city) {
    try {
      await this.fetchWeatherFresh(cacheKey, lat, lon, city);
    } catch (error) {
      console.warn('Background weather update failed:', error);
    }
  }

  /**
   * Normalize and process raw API data
   */
  processWeatherData(data, city) {
    const { current, daily, hourly } = data;
    const now = new Date();
    const sunriseMs = new Date(daily.sunrise[0]).getTime();
    const sunsetMs = new Date(daily.sunset[0]).getTime();

    // Process hourly data
    const isoNow = now.toISOString().slice(0, 13);
    const startIdx = hourly.time.findIndex(
      (t) => t.slice(0, 13) === isoNow
    );
    const hourStart = startIdx >= 0 ? startIdx : 0;

    const hours = [];
    for (let i = 0; i < 24; i++) {
      const idx = hourStart + i;
      if (idx >= hourly.time.length) break;

      hours.push({
        time: hourly.time[idx],
        temp: hourly.temperature_2m[idx],
        weatherCode: hourly.weather_code[idx],
        precipProb: hourly.precipitation_probability?.[idx] ?? null,
      });
    }

    // Process daily data
    const days = daily.time.map((date, i) => ({
      date,
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      weatherCode: daily.weather_code[i],
      precipProb: daily.precipitation_probability_max?.[i] ?? null,
      uvMax: daily.uv_index_max[i],
    }));

    // Extract key values
    const uv = Math.round(current.uv_index ?? daily.uv_index_max[0] ?? 0);

    return {
      city,
      lat: data.latitude,
      lon: data.longitude,
      timezone: data.timezone,
      current: {
        temp: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        weatherCode: current.weather_code,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        uv: current.uv_index ?? daily.uv_index_max[0] ?? 0,
      },
      hours,
      days,
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
      sunriseMs,
      sunsetMs,
      nowMs: now.getTime(),
      fetchedAt: Date.now(),
    };
  }

  /**
   * Search for cities
   */
  async searchCities(query) {
    if (!query || query.length < 2) {
      return [];
    }

    const cacheKey = `${CACHE_CONFIG.LOCATION_CACHE_KEY}:${query}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams({
      name: query,
      count: '8',
      language: 'pt',
      format: 'json',
    });

    try {
      const url = `${API_CONFIG.GEOCODING_API}?${params}`;
      const data = await this.fetchWithRetry(url);

      const results = (data.results || [])
        .filter((r) => r.country === 'Brasil')
        .map((r) => ({
          name: r.name,
          state: r.admin1,
          country: r.country,
          lat: r.latitude,
          lon: r.longitude,
          displayName: `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}`,
        }));

      this.setCache(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Falha ao buscar cidades');
    }
  }

  /**
   * Reverse geocoding - get city name from coords
   */
  async getLocationName(lat, lon) {
    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        language: 'pt',
      });

      const url = `https://nominatim.openstreetmap.org/reverse?${params}&format=json`;
      const data = await this.fetchWithRetry(url);

      return data.address?.city || data.address?.town || 'Local atual';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Local atual';
    }
  }

  /**
   * Clear all caches (for testing or manual reset)
   */
  clearCache() {
    this.cache.clear();
  }
}

// Singleton instance
export const weatherService = new WeatherService();

export default weatherService;
