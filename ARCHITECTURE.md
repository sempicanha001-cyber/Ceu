# CéuClaro - Documentação de Arquitetura

## 📐 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      APLICAÇÃO (APP.JSX)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              COMPONENTES DE UI (React)               │  │
│  │  ┌─────────────┬──────────────┬────────────────────┐ │  │
│  │  │  Header     │  Weather     │  Search Modal      │ │  │
│  │  │  Navigation │  Forecast    │  Error/Loading     │ │  │
│  │  │  Alert      │  Stats       │  Install Banner    │ │  │
│  │  └─────────────┴──────────────┴────────────────────┘ │  │
│  └────────────────────────────────────────┬───────────────┘  │
└─────────────────────────────────────────────┼────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
        ┌───────────▼──────────┐  ┌──────────▼──────────┐  ┌──────────▼──────┐
        │   CUSTOM HOOKS       │  │   SERVICES          │  │   UTILITIES      │
        ├─────────────────────┤  ├─────────────────────┤  ├──────────────────┤
        │ useWeather()        │  │ weatherApi.js       │  │ formatters.js    │
        │ useGeolocation()    │  │ ├─ fetchWeather()   │  │ getWeatherInfo() │
        │ useSearchCities()   │  │ ├─ searchCities()   │  │ formatTime()     │
        │ useLocalStorage()   │  │ ├─ caching logic    │  │ formatTemp()     │
        │ usePWAInstall()     │  │ └─ retry/timeout    │  │ getUVColor()     │
        │ useSkyTheme()       │  │                     │  │ getWindDir()     │
        └─────────────────────┘  └─────────────────────┘  └──────────────────┘
                    │                         │                         │
                    └─────────────────────────┼─────────────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
        ┌───────────▼──────────┐  ┌──────────▼──────────┐  ┌──────────▼──────┐
        │   CACHE LAYER        │  │   EXTERNAL APIs     │  │   LOCAL STORAGE  │
        ├─────────────────────┤  ├─────────────────────┤  ├──────────────────┤
        │ Memory Cache (Map)   │  │ open-meteo.com      │  │ localStorage     │
        │ Request Dedup        │  │ nominatim (OSM)     │  │ IndexedDB ready  │
        │ Stale-while-revalidate│  │ geocoding-api       │  │ Recent cities    │
        └─────────────────────┘  └─────────────────────┘  └──────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
        ┌───────────▼──────────┐  ┌──────────▼──────────┐  ┌──────────▼──────┐
        │   SERVICE WORKER     │  │   CSS & STYLING     │  │   CONFIGURATION  │
        ├─────────────────────┤  ├─────────────────────┤  ├──────────────────┤
        │ Workbox (PWA)        │  │ CSS Variables       │  │ Feature flags    │
        │ Asset caching        │  │ Animations (native) │  │ API endpoints    │
        │ API caching          │  │ Responsive design   │  │ WMO codes        │
        │ Offline fallback     │  │ Glass morphism      │  │ Constants        │
        └─────────────────────┘  └─────────────────────┘  └──────────────────┘
```

---

## 🔄 Data Flow

### **Happy Path (Previsão Carregada com Sucesso)**

```
1. User Opens App
   │
2. useGeolocation() Hook Triggered
   │
3. navigator.geolocation.getCurrentPosition()
   ├─ SUCCESS → lat, lon
   └─ DENY → Fallback (São Paulo)
   │
4. useWeather(lat, lon, city) Hook Called
   │
5. weatherService.fetchWeather()
   ├─ Check Memory Cache
   │  ├─ HIT → Return cached data + background update
   │  └─ MISS → Continue
   │
6. Fetch with Retry Logic
   ├─ Network request to open-meteo.com
   ├─ Timeout: 8s (configurable)
   ├─ Retry: 2x with 1s delay (configurable)
   └─ SUCCESS → Parse + Normalize + Cache + Return
   │
7. Component Renders with Data
   ├─ Sky theme calculated
   ├─ All sub-components rendered
   └─ Animations triggered (fadeUp, float, etc)
   │
8. User Interaction
   ├─ Search City → SearchModal opens
   ├─ useSearchCities(query) with debounce
   ├─ Results displayed → Select city
   └─ New weather fetched with selected location
```

### **Error Path (Tratamento de Erros)**

```
Fetch Fails (Network/Timeout)
   │
1. First Retry (1s delay)
   ├─ SUCCESS → Return data
   └─ FAIL → Continue
   │
2. Second Retry (1s delay)
   ├─ SUCCESS → Return data
   └─ FAIL → Continue
   │
3. Check Cache
   ├─ HIT → Return stale data (with visual indicator)
   └─ MISS → Show ErrorState component
   │
4. ErrorState UI
   ├─ Show error message in Portuguese
   ├─ Retry button available
   ├─ Icons indicate error type (offline, timeout, etc)
   └─ User can retry manually
```

### **Cache Strategy (Stale-While-Revalidate)**

```
Request comes in
   │
1. Check Memory Cache
   ├─ Expired? → Delete + Continue to API
   └─ Valid? → Return IMMEDIATELY (fast!)
   │
2. Start Background Update (don't block UI)
   ├─ Fetch fresh data from API
   ├─ Update cache
   └─ Component re-renders with new data
   │
Result: User sees cached data instantly, then updates automatically
        when fresh data arrives (seamless UX)
```

---

## 🏗️ Componentes Detalhados

### **1. WeatherHeader**
```jsx
Props:
  - onSearch: () => void          // Open search modal

Purpose: Logo + header actions (search, menu)
Performance: React.memo (no props change = no re-render)
Styling: Styled JSX (scoped CSS in component)
```

### **2. CurrentWeather**
```jsx
Props:
  - weatherData: WeatherData      // Full weather object
  - onLocationClick: () => void   // Open search

Calculations (useMemo):
  - getWeatherInfo(code)          // Icon + description
  - formatTemperature()           // Rounded temp
  - getCurrentTimeString()        // Date string

Purpose: Display current temp, location, feels-like
```

### **3. AlertBanner**
```jsx
Props:
  - weatherData: WeatherData

Smart Logic (useMemo):
  if (UV >= 6) → High sun alert
  if (weatherCode >= 80) → Rain alert
  if (windSpeed > 40) → Wind alert
  else → Pleasant weather

Purpose: Contextual alerts based on data
```

### **4. HourlyForecast**
```jsx
Props:
  - hours: Array<HourData>

Processing (useMemo):
  - Format time strings
  - Extract weather icons
  - Calculate 24h from now

Purpose: Horizontal scrollable hourly view
Performance: Memoized to prevent re-processing
```

### **5. DailyForecast**
```jsx
Props:
  - days: Array<DayData>

Processing (useMemo):
  - Format day names (Hoje, Amanhã, Seg, Ter, etc)
  - Extract weather icons
  - Round temperatures

Purpose: 7-day forecast grid
```

### **6. WeatherStats**
```jsx
Props:
  - weatherData: WeatherData

Calculations (useMemo):
  - UV percentage for bar visualization
  - Wind direction abbreviation
  - Humidity interpretation
  - Sunrise/sunset formatted

Purpose: Detailed statistics with gauge visualization
```

### **7. SearchModal**
```jsx
Props:
  - isOpen: boolean
  - onClose: () => void
  - onSelectCity: (city) => void
  - recentCities: Array<City>

Hooks:
  - useSearchCities(query)        // Debounced search
  - useState for query
  - useRef for input focus

Purpose: City search with recent history
```

### **8. BottomNavigation**
```jsx
Props:
  - activeNav: string             // Current tab id
  - onNavClick: (id) => void     // Tab changed

Navigation:
  - Hoje (today)
  - Previsão (forecast)
  - Detalhes (details)

Purpose: Tab navigation with smooth scroll
```

---

## 🪝 Hooks Customizados

### **useWeather(lat, lon, city)**
```javascript
const { data, loading, error, refetch } = useWeather(lat, lon, city);

Logic:
  - Triggers on lat/lon change
  - Calls weatherService.fetchWeather()
  - Manages loading/error states
  - Provides manual refetch function

Returns: { data, loading, error, refetch }
```

### **useGeolocation()**
```javascript
const { coords, loading, error } = useGeolocation();

Logic:
  - Requests location on mount
  - Falls back to São Paulo if denied
  - Sets location source: 'geolocation' | 'fallback' | 'default'
  - 1 hour cache via getCurrentPosition options

Returns: { coords, loading, error }
```

### **useSearchCities(query, delay = 300)**
```javascript
const { results, searching, error } = useSearchCities(query);

Logic:
  - Debounces input by 300ms (configurable)
  - Calls weatherService.searchCities()
  - Filters for Brazil only
  - Cleans up timers on unmount

Returns: { results, searching, error }
```

### **useLocalStorage(key, initial)**
```javascript
const [value, setValue] = useLocalStorage('cc_recent_cities', []);

Logic:
  - Reads from localStorage on mount
  - Syncs writes to localStorage
  - Handles JSON serialization
  - Error handling for quota exceeded

Returns: [value, setValue] (like useState)
```

### **usePWAInstall()**
```javascript
const {
  installPrompt,
  showInstallBanner,
  handleInstall,
  dismissBanner,
  canInstall,
} = usePWAInstall();

Logic:
  - Listens for beforeinstallprompt event
  - Shows banner on 2nd visit or after 5s
  - Respects dismissal in localStorage
  - Tracks visits count

Returns: Install control object
```

### **useSkyTheme(weatherData)**
```javascript
const theme = useSkyTheme(weatherData);
// Returns: { top: '#0a0e2e', mid: '#0d1b4b', bot: '#1a2d6e', isNight: true }

Logic:
  - Calculates sunrise/sunset times
  - Defines dawn/morn/dusk/night periods
  - Returns color gradient based on time
  - Updates when weatherData changes

Used for: Gradient background dynamically
```

---

## 🔧 Service: weatherApi.js

### **Architecture**
```javascript
Class: WeatherService (Singleton)
├─ Cache: Map (in-memory)
├─ RequestQueue: Map (deduplication)
└─ Methods:
    ├─ fetchWeather(lat, lon, city)
    ├─ fetchWeatherFresh(...)
    ├─ searchCities(query)
    ├─ getLocationName(lat, lon)
    ├─ fetchWithRetry(url, options)
    ├─ getFromCache(key)
    ├─ setCache(key, data)
    └─ clearCache()
```

### **Key Features**

**Request Deduplication**
```javascript
if (this.requestQueue.has(cacheKey)) {
  return this.requestQueue.get(cacheKey); // Return existing promise
}
// Prevents 2+ simultaneous requests for same location
```

**Stale-While-Revalidate**
```javascript
const cached = this.getFromCache(key);
if (cached) {
  this.updateWeatherInBackground(key, lat, lon, city);
  return cached; // Instant return
}
```

**Retry with Exponential Backoff**
```javascript
for (let i = 0; i <= retries; i++) {
  try {
    return await fetch(...);
  } catch {
    if (i < retries) {
      await delay(retryDelay); // Wait before retry
    }
  }
}
```

**Timeout Handling**
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeout);
const response = await fetch(url, { signal: controller.signal });
clearTimeout(timeoutId);
```

---

## 📊 Data Normalization

### **Raw API Response → Normalized Data**

```javascript
// Raw from API
{
  current: { temperature_2m: 24.5, apparent_temperature: 23.0, ... },
  daily: { time: ['2024-04-15', ...], temperature_2m_max: [28, ...], ... },
  hourly: { time: ['2024-04-15T00:00', ...], temperature_2m: [22, ...], ... }
}

// Normalized by processWeatherData()
{
  city: 'São Paulo',
  lat: -23.55,
  lon: -46.63,
  current: {
    temp: 24.5,
    feelsLike: 23.0,
    weatherCode: 2,
    humidity: 65,
    windSpeed: 12.5,
    windDirection: 180,
    uv: 4
  },
  hours: [
    { time: '2024-04-15T00:00', temp: 22, weatherCode: 3, precipProb: 10 },
    ...
  ],
  days: [
    { date: '2024-04-15', tempMax: 28, tempMin: 18, ... },
    ...
  ],
  sunrise: '2024-04-15T05:45:00',
  sunset: '2024-04-15T17:30:00',
  sunriseMs: 1713166500000,
  sunsetMs: 1713212400000,
  nowMs: 1713190000000,
  fetchedAt: 1713190000000
}
```

---

## 🎨 Styling Strategy

### **CSS Variables (Global Theme)**
```css
:root {
  --color-text: #fff;
  --color-bg-glass: rgba(255, 255, 255, 0.13);
  --color-accent: #1a6fc4;
  --radius-md: 18px;
  --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.2);
  --transition-fast: 0.15s ease;
}
```

### **Styled JSX (Component-Scoped)**
```jsx
<style jsx>{`
  .my-component {
    color: var(--color-text);
    border-radius: var(--radius-md);
    transition: background var(--transition-fast);
  }
`}</style>
```

### **Benefits**
- No CSS conflicts (scoped to component)
- Variables accessible everywhere
- Easy theme switching (update CSS variables)
- Zero runtime CSS-in-JS overhead
- Auto-prefixed for browser compatibility

---

## 🔐 Segurança & Boas Práticas

### **XSS Prevention**
```javascript
// ❌ Avoided
dangerouslySetInnerHTML={{ __html: data }}

// ✅ Used
<div>{data}</div>  // React auto-escapes
```

### **Input Validation**
```javascript
// Search input validated
if (!query || query.length < 2) return [];

// API responses normalized
const results = (data.results || [])
  .filter(r => r.country === 'Brasil')
```

### **Error Handling**
```javascript
try {
  const data = await fetch(...);
} catch (error) {
  // Generic error message to user
  throw new Error('Falha ao carregar dados');
}
```

### **Future Backend Integration**
```javascript
// Currently: Direct API calls
// Future: Use backend proxy for rate limiting + security
const response = await fetch('/api/weather?lat=X&lon=Y');
```

---

## 📈 Performance Optimizations

### **1. Memoization**
```javascript
// Prevent re-renders
const Component = memo(({ data }) => {
  // Component only re-renders if `data` changes
});

// Prevent recalculations
const icon = useMemo(() => getWeatherInfo(code), [code]);

// Prevent function recreation
const handleClick = useCallback(() => { ... }, []);
```

### **2. Code Splitting**
```javascript
// Automatic via Vite
// Each component is separate chunk
// Lazy loading ready:
const SearchModal = lazy(() => import('./SearchModal'));
```

### **3. CSS Optimization**
```javascript
// CSS variables (no JS calculation needed)
// Will-change hints for animations
// GPU acceleration with transform/opacity
// No inline styles (batched CSS)
```

### **4. Request Deduplication**
```javascript
// If 2 requests for same location come in,
// Return same promise (avoid duplicate network calls)
if (this.requestQueue.has(key)) {
  return this.requestQueue.get(key);
}
```

---

## 🧪 Testing Strategy (Future)

### **Unit Tests**
```javascript
// Formatters
test('formatTemperature rounds correctly', () => {
  expect(formatTemperature(24.567)).toBe('25°');
});

// Constants
test('WMO_CODES has all weather types', () => {
  expect(Object.keys(WMO_CODES).length).toBeGreaterThan(0);
});
```

### **Integration Tests**
```javascript
// Hooks
test('useWeather fetches and caches data', async () => {
  const { result } = renderHook(() => useWeather(-23.55, -46.63, 'SP'));
  await waitFor(() => expect(result.current.data).toBeTruthy());
});

// Service
test('weatherService retries on failure', async () => {
  // Mock fetch to fail 2x, succeed 3x
  const data = await weatherService.fetchWeather(...);
  expect(data).toBeTruthy();
});
```

### **E2E Tests**
```javascript
// Playwright/Cypress
test('User can search for city and see forecast', async () => {
  await page.goto('/');
  await page.click('[aria-label="Buscar cidades"]');
  await page.fill('input', 'Rio de Janeiro');
  await page.click('text=Rio de Janeiro');
  await expect(page).toHaveText('Rio de Janeiro');
});
```

---

## 🚀 Deployment & DevOps

### **Build Optimization**
```bash
npm run build
# Output: dist/
#   ├── index.html (2.5 KB gzip)
#   ├── assets/
#   │   ├── main.{hash}.js (38 KB gzip)
#   │   ├── react-vendor.{hash}.js (12 KB gzip)
#   │   └── styles.{hash}.css (4 KB gzip)
#   └── manifest.webmanifest
```

### **Deploy Checklist**
- [ ] Environment variables set
- [ ] Service Worker cache version bumped
- [ ] Analytics integrated (optional)
- [ ] Sentry/Error tracking configured
- [ ] PWA icons generated (192x192, 512x512, maskable)
- [ ] SSL certificate valid
- [ ] CORS headers configured
- [ ] CDN configured for assets
- [ ] Lighthouse audit passed (90+)
- [ ] Mobile friendly tested

---

## 📚 Referências & Recursos

- [Open-Meteo API Docs](https://open-meteo.com/en)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)
- [PWA Guidelines](https://web.dev/progressive-web-apps/)
- [Web Vitals](https://web.dev/vitals/)
- [Vite Docs](https://vitejs.dev/)

---

**Documentação atualizada: v2.0 - April 2024**
