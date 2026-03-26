const API_KEY = '2bf88471d531bcf8a5b4ee120f3130da';
const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

const form = document.getElementById('weatherForm');
const input = document.getElementById('cityInput');
const result = document.getElementById('weatherResult');

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

// ── Fetch weather data ──
async function getWeather(city) {
  showLoading();

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

// ── Load last searched city on page load ──
document.addEventListener('DOMContentLoaded', () => {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    getWeather(lastCity);
  }
});
