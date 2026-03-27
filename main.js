const API_KEY      = '2bf88471d531bcf8a5b4ee120f3130da';
const API_BASE     = 'https://api.openweathermap.org/data/2.5/weather';
const API_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast';

const form           = document.getElementById('weatherForm');
const input          = document.getElementById('cityInput');
const result         = document.getElementById('weatherResult');
const forecastResult = document.getElementById('forecastResult');
const geoBtn         = document.getElementById('geoBtn');

// ── Weather condition → emoji mapping ──
const WEATHER_EMOJI = {
  Clear:        '☀️',
  Clouds:       '☁️',
  Rain:         '🌧️',
  Drizzle:      '🌦️',
  Thunderstorm: '⛈️',
  Snow:         '❄️',
  Mist:         '🌫️',
  Fog:          '🌫️',
  Haze:         '🌁',
  Dust:         '🏜️',
  Sand:         '🏜️',
  Smoke:        '💨',
  Tornado:      '🌪️',
  Squall:       '💨',
  Ash:          '🌋',
};

const IT_DAYS   = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const IT_MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

// ── Wind direction helper ──
function getWindDir(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── Sanitize input ──
function sanitize(str) {
  return str.replace(/[<>&"']/g, '').trim();
}

// ── Show loading state ──
function showLoading() {
  result.innerHTML = `
    <div class="loader-wrap">
      <div class="loader" role="status" aria-label="Caricamento in corso"></div>
      <p class="loader-text">Recupero dati meteo…</p>
    </div>
  `;
}

// ── Show error ──
function showError(message, hint = '') {
  result.innerHTML = `
    <div class="error-card" role="alert">
      <span class="error-icon">😔</span>
      <p class="error-msg">${message}</p>
      ${hint ? `<p class="error-hint">${hint}</p>` : ''}
    </div>
  `;
}

// ── Clear forecast section ──
function clearForecast() {
  forecastResult.innerHTML = '';
}

// ── Display weather data ──
function displayWeather(data) {
  const emoji = WEATHER_EMOJI[data.weather[0].main] || '🌡️';
  const windDir = data.wind.deg !== undefined ? ` ${getWindDir(data.wind.deg)}` : '';
  const feelsLike = Math.round(data.main.feels_like);
  const temp = Math.round(data.main.temp);

  // Save last searched city
  localStorage.setItem('lastCity', data.name);

  result.innerHTML = `
    <div class="weather-card">
      <div class="city-name">
        ${data.name}<span class="country-tag">${data.sys.country}</span>
      </div>
      <span class="weather-emoji" aria-label="${data.weather[0].description}">${emoji}</span>
      <p class="weather-desc">${data.weather[0].description}</p>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-icon" aria-hidden="true">🌡️</span>
          <span class="stat-value">${temp}°C</span>
          <span class="stat-label">Temperatura</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon" aria-hidden="true">🤔</span>
          <span class="stat-value">${feelsLike}°C</span>
          <span class="stat-label">Percepita</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon" aria-hidden="true">💧</span>
          <span class="stat-value">${data.main.humidity}%</span>
          <span class="stat-label">Umidità</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon" aria-hidden="true">💨</span>
          <span class="stat-value">${data.wind.speed} m/s${windDir}</span>
          <span class="stat-label">Vento</span>
        </div>
      </div>
    </div>
  `;
}

// ── Display 5-day forecast ──
function displayForecast(data) {
  // Group 3-hour entries by date
  const days = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  const dayEntries = Object.entries(days).slice(0, 5);

  const cardsHtml = dayEntries.map(([date, items], idx) => {
    const temps   = items.map(i => i.main.temp);
    const minTemp = Math.round(Math.min(...temps));
    const maxTemp = Math.round(Math.max(...temps));

    // Prefer midday entry for weather condition
    const rep   = items.find(i => i.dt_txt.includes('12:00:00')) || items[0];
    const emoji = WEATHER_EMOJI[rep.weather[0].main] || '🌡️';
    const desc  = rep.weather[0].description;

    const d         = new Date(date + 'T12:00:00');
    const dayName   = IT_DAYS[d.getDay()];
    const dayNum    = d.getDate();
    const monthName = IT_MONTHS[d.getMonth()];

    return `
      <div class="forecast-day" style="animation-delay:${0.25 + idx * 0.07}s">
        <span class="forecast-date">${dayName}<small>${dayNum} ${monthName}</small></span>
        <span class="forecast-emoji" title="${desc}">${emoji}</span>
        <div class="forecast-temps">
          <span class="forecast-max">${maxTemp}°</span>
          <span class="forecast-min">${minTemp}°</span>
        </div>
      </div>
    `;
  }).join('');

  forecastResult.innerHTML = `
    <div class="forecast-card">
      <h2 class="forecast-title">Prossimi 5 giorni</h2>
      <div class="forecast-grid">${cardsHtml}</div>
    </div>
  `;
}

// ── Fetch 5-day forecast (non-blocking) ──
async function fetchForecast(cityName) {
  const url = `${API_FORECAST}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=it`;
  try {
    const response = await fetch(url);
    if (!response.ok) return;
    const data = await response.json();
    displayForecast(data);
  } catch {
    // Silently ignore — forecast is supplementary
  }
}

// ── Fetch weather by coordinates ──
async function getWeatherByCoords(lat, lon) {
  showLoading();
  clearForecast();

  const url = `${API_BASE}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    input.value = data.name;
    displayWeather(data);
    fetchForecast(data.name);
  } catch (err) {
    console.error('Coords weather error:', err);
    showError(
      'Impossibile recuperare i dati meteo.',
      'Verifica la connessione e riprova.'
    );
  }
}

// ── Fetch weather data ──
async function getWeather(city) {
  showLoading();
  clearForecast();

  const safeName = sanitize(city);
  if (!safeName) {
    showError('Inserisci un nome di città valido.');
    return;
  }

  const url = `${API_BASE}?q=${encodeURIComponent(safeName)}&appid=${API_KEY}&units=metric&lang=it`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      showError(
        `Città "${safeName}" non trovata.`,
        'Controlla il nome e riprova.'
      );
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    displayWeather(data);
    fetchForecast(data.name);
  } catch (err) {
    console.error('Weather fetch error:', err);
    showError(
      'Impossibile recuperare i dati meteo.',
      'Verifica la connessione e riprova.'
    );
  }
}

// ── Event listeners ──
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = input.value;
  if (city.trim()) {
    getWeather(city);
  }
});

// ── Geolocation button ──
geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError(
      'Geolocalizzazione non supportata.',
      'Il tuo browser non supporta questa funzione.'
    );
    return;
  }

  clearForecast();
  result.innerHTML = `
    <div class="loader-wrap">
      <div class="loader" role="status" aria-label="Rilevamento posizione"></div>
      <p class="loader-text">Rilevamento posizione…</p>
    </div>
  `;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    },
    (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        showError(
          'Accesso alla posizione negato.',
          'Consenti la geolocalizzazione nelle impostazioni del browser.'
        );
      } else {
        showError(
          'Impossibile rilevare la posizione.',
          'Inserisci manualmente il nome della città.'
        );
      }
    },
    { timeout: 10000 }
  );
});

// ── Load last searched city on page load ──
document.addEventListener('DOMContentLoaded', () => {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    getWeather(lastCity);
  }
});
