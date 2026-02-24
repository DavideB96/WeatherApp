const apiKey = 'e3eafb17afa8c23a981f084ba3adaa6e';

document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    getWeather(city);
});

function getWeather(city) {

    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `<div class="loader" aria-label="Loading"></div>`;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta");
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            showError("Errore nel recupero dei dati meteo.");
        });
}

function displayWeather(data) {
    const weatherResult = document.getElementById("weatherResult");

    localStorage.setItem("lastCity", data.name);

    const condition = data.weather[0].main;

    let emoji;

    if (condition === "Clear") emoji = "☀️";
    else if (condition === "Clouds") emoji = "☁️";
    else if (condition === "Rain") emoji = "🌧️";
    else if (condition === "Snow") emoji = "❄️";
    else if (condition === "Thunderstorm") emoji = "⛈️";
    else emoji = "🌡️";

    weatherResult.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <div class="weather-emoji">${emoji}</div>
    <p>Temperatura: ${data.main.temp}°C</p>
    <p>Meteo: ${data.weather[0].description}</p>
    <p>Umidità: ${data.main.humidity}%</p>
    <p>Vento: ${data.wind.speed} m/s</p>
  `;
}

function showError(message) {
    const weatherResult = document.getElementById("weatherResult");
    weatherResult.innerHTML = `<p class="error">${message}</p>`;
}

document.addEventListener("DOMContentLoaded", function () {
    const lastCity = localStorage.getItem("lastCity");

    if (lastCity) {
        getWeather(lastCity);
    }
});