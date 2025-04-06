const apiKey = "eyUF8rw9KBom6cP5";
const apiUrl = "const apiUrl = https://api.hgbrasil.com/weather";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weather-icon");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetch(`${apiUrl}${city}&appid=${apiKey}&units=metric&lang=pt_br`)
      .then(response => response.json())
      .then(data => {
        cityName.textContent = data.name;
        temperature.textContent = `Temperatura: ${data.main.temp}°C`;
        description.textContent = `Clima: ${data.weather[0].description}`;
        
        const iconCode = data.weather[0].icon;
        weatherIcon.className = `fas fa-cloud-sun`; // Ícone genérico
      })
      .catch(() => {
        alert("Cidade não encontrada.");
      });
  } else {
    alert("Por favor, insira uma cidade.");
  }
});
