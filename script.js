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

// Substitua pela sua chave de API real
const apiKey = 'SUA_CHAVE_DE_API_AQUI'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const weatherIconsBaseUrl = 'https://openweathermap.org/img/wn/';

async function getWeatherData(query) {
    try {
        const response = await fetch(`${apiUrl}?${query}&appid=${apiKey}&units=metric&lang=pt_br`);
        const data = await response.json();

        if (data.cod === 200) {
            updateWeatherInfo(data);
            errorMessageElement.textContent = '';
        } else {
            throw new Error(data.message || 'Cidade não encontrada');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        errorMessageElement.textContent = error.message || 'Erro ao buscar dados do clima.';
        resetWeatherInfo();
    }
}

function updateWeatherInfo(data) {
    // Atualiza localização
    cityElement.textContent = data.name;
    countryElement.textContent = data.sys.country;
    
    // Atualiza temperatura e descrição
    tempElement.textContent = Math.round(data.main.temp);
    descriptionElement.textContent = data.weather[0].description.charAt(0).toUpperCase() + 
                                    data.weather[0].description.slice(1);
    
    // Atualiza ícone do tempo
    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `${weatherIconsBaseUrl}${iconCode}@4x.png`;
    weatherIconElement.alt = data.weather[0].description;
    weatherIconElement.style.display = 'block';
    
    // Atualiza detalhes
    feelsLikeElement.textContent = Math.round(data.main.feels_like);
    humidityElement.textContent = data.main.humidity;
    windSpeedElement.textContent = (data.wind.speed).toFixed(1);
    
    // Atualiza informações adicionais
    rainElement.textContent = data.rain ? (data.rain['1h'] || '0') : '0';
    cloudsElement.textContent = data.clouds.all;
    sunriseElement.textContent = formatTime(data.sys.sunrise);
    sunsetElement.textContent = formatTime(data.sys.sunset);
}

function resetWeatherInfo() {
    cityElement.textContent = '--';
    countryElement.textContent = '--';
    tempElement.textContent = '--';
    descriptionElement.textContent = '--';
    weatherIconElement.src = '';
    weatherIconElement.style.display = 'none';
    
    feelsLikeElement.textContent = '--';
    humidityElement.textContent = '--';
    windSpeedElement.textContent = '--';
    
    rainElement.textContent = '--';
    cloudsElement.textContent = '--';
    sunriseElement.textContent = '--';
    sunsetElement.textContent = '--';
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Event Listeners
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(`q=${encodeURIComponent(city)}`);
    } else {
        errorMessageElement.textContent = 'Por favor, digite uma cidade.';
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherData(`lat=${latitude}&lon=${longitude}`);
            },
            (error) => {
                errorMessageElement.textContent = 'Erro ao obter localização: ' + error.message;
                console.error('Erro de geolocalização:', error);
            },
            { timeout: 10000 }
        );
    } else {
        errorMessageElement.textContent = 'Geolocalização não suportada pelo navegador.';
    }
});

// Inicialização
resetWeatherInfo();