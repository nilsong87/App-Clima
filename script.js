/* script.js */
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const locationButton = document.getElementById('location-button');
const cityElement = document.getElementById('city');
const countryElement = document.getElementById('country');
const tempElement = document.getElementById('temp');
const descriptionElement = document.getElementById('description');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const weatherIconElement = document.getElementById('weather-icon');
const errorMessageElement = document.getElementById('error-message');
const rainElement = document.getElementById('rain');
const cloudsElement = document.getElementById('clouds');
const sunriseElement = document.getElementById('sunrise');
const sunsetElement = document.getElementById('sunset');

const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const weatherIconsBaseUrl = 'https://openweathermap.org/img/wn/'; // Base URL for weather icons

async function getWeatherData(query) {
    try {
        const response = await fetch(`${apiUrl}?${query}&appid=${apiKey}&units=metric&lang=pt_br`);
        const data = await response.json();

        if (data.cod === 200) {
            updateWeatherInfo(data);
            errorMessageElement.textContent = '';
        } else {
            errorMessageElement.textContent = 'Cidade não encontrada.';
            resetWeatherInfo();
        }
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        errorMessageElement.textContent = 'Erro ao buscar dados do clima.';
        resetWeatherInfo();
    }
}

function updateWeatherInfo(data) {
    cityElement.textContent = data.name;
    countryElement.textContent = data.sys.country;
    tempElement.textContent = Math.round(data.main.temp);
    descriptionElement.textContent = data.weather[0].description;
    feelsLikeElement.textContent = Math.round(data.main.feels_like);
    humidityElement.textContent = data.main.humidity;
    windSpeedElement.textContent = data.wind.speed;

    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `${weatherIconsBaseUrl}${iconCode}@4x.png`; // Constructing icon URL
    weatherIconElement.alt = data.weather[0].description;

    rainElement.textContent = data.rain && data.rain['1h'] ? `${data.rain['1h']}` : '--';
    cloudsElement.textContent = data.clouds.all;
    sunriseElement.textContent = formatTime(data.sys.sunrise);
    sunsetElement.textContent = formatTime(data.sys.sunset);
}

function resetWeatherInfo() {
    cityElement.textContent = '--';
    countryElement.textContent = '--';
    tempElement.textContent = '--';
    descriptionElement.textContent = '--';
    feelsLikeElement.textContent = '--';
    humidityElement.textContent = '--';
    windSpeedElement.textContent = '--';
    weatherIconElement.src = '';
    weatherIconElement.alt = '';
    rainElement.textContent = '--';
    cloudsElement.textContent = '--';
    sunriseElement.textContent = '--';
    sunsetElement.textContent = '--';
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(`q=${city}`);
    } else {
        errorMessageElement.textContent = 'Por favor, digite uma cidade.';
        resetWeatherInfo();
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherData(`lat=${latitude}&lon=${longitude}`);
            },
            (error) => {
                errorMessageElement.textContent = 'Erro ao obter a localização.';
                console.error('Erro de geolocalização:', error);
            }
        );
    } else {
        errorMessageElement.textContent = 'Geolocalização não suportada pelo seu navegador.';
    }
});

// Initial load (optional - try to get user's location)
locationButton.click();