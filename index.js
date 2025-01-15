const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const input = document.querySelector('.search-box input');
const forecastContainer = document.querySelector('.forecast-container');
const hourlyForecastContainer = document.querySelector('.hourly-forecast-container');

// Başlangıçta hava durumu ve tahmin bölümlerini gizle
weatherBox.style.display = 'none';
weatherDetails.style.display = 'none';
forecastContainer.parentElement.style.display = 'none';
hourlyForecastContainer.parentElement.style.display = 'none';

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        search.click();
    }
});

input.addEventListener('input', () => {
    search.click();
});

search.addEventListener('click', () => {
    const APIKey = '6e6ce8143c75403ad62c2abfd8aa6aee';
    const city = input.value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                forecastContainer.parentElement.style.display = 'none';
                hourlyForecastContainer.parentElement.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const weatherCondition = json.weather[0].main;
            const image = document.querySelector('.weather-box img');
            const weatherDescriptions = {
                'Clear': 'Açık',
                'Rain': 'Yağmurlu',
                'Snow': 'Karlı',
                'Clouds': 'Bulutlu',
                'Haze': 'Puslu',
                'Mist': 'Sisli',
                'Thunderstorm': 'Fırtına',
                'Drizzle': 'Çiseleyen'
            };

            switch (weatherCondition) {
                case 'Clear':
                    image.src = "./clear.png";
                    break;
                case 'Rain':
                    image.src = "./rain.png";
                    break;
                case 'Snow':
                    image.src = "./snow.png";
                    break;
                case 'Clouds':
                    image.src = "./cloud.png";
                    break;
                case 'Haze':
                case 'Mist':
                    image.src = "./mist.png";
                    break;
                default:
                    image.src = "./default.png";
            }

            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = weatherDescriptions[weatherCondition] || json.weather[0].description;
            humidity.innerHTML = `Nem: ${json.main.humidity}%`;
            wind.innerHTML = `Rüzgar: ${parseInt(json.wind.speed)} Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');

            // Saatlik hava durumu bilgilerini al ve göster
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
                .then(response => response.json())
                .then(forecastJson => {
                    hourlyForecastContainer.innerHTML = '';
                    for (let i = 0; i < 5; i++) {
                        const forecast = forecastJson.list[i];
                        const forecastDate = new Date(forecast.dt * 1000);
                        const forecastHour = forecastDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                        const forecastTemp = `${parseInt(forecast.main.temp)}°C`;
                        const forecastIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                        const forecastDescription = weatherDescriptions[forecast.weather[0].main] || forecast.weather[0].description;

                        const forecastElement = document.createElement('div');
                        forecastElement.classList.add('hourly-forecast-item');
                        forecastElement.innerHTML = `
                            <div class="forecast-hour">${forecastHour}</div>
                            <img src="${forecastIcon}" alt="${forecast.weather[0].description}">
                            <div class="forecast-temp">${forecastTemp}</div>
                            <div class="forecast-description">${forecastDescription}</div>
                        `;
                        hourlyForecastContainer.appendChild(forecastElement);
                    }
                    hourlyForecastContainer.parentElement.style.display = 'block';

                    // 3 günlük hava tahminini al ve göster
                    forecastContainer.innerHTML = '';
                    for (let i = forecastJson.list.length - 24; i < forecastJson.list.length; i += 8) {
                        const forecast = forecastJson.list[i];
                        const forecastDate = new Date(forecast.dt * 1000);
                        const forecastDay = forecastDate.toLocaleDateString('tr-TR', { weekday: 'long' });
                        const forecastTemp = `${parseInt(forecast.main.temp)}°C`;
                        const forecastIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                        const forecastDescription = weatherDescriptions[forecast.weather[0].main] || forecast.weather[0].description;

                        const forecastElement = document.createElement('div');
                        forecastElement.classList.add('forecast-item');
                        forecastElement.innerHTML = `
                            <div class="forecast-date">${forecastDay}</div>
                            <img src="${forecastIcon}" alt="${forecast.weather[0].description}">
                            <div class="forecast-temp">${forecastTemp}</div>
                            <div class="forecast-description">${forecastDescription}</div>
                        `;
                        forecastContainer.appendChild(forecastElement);
                    }
                    forecastContainer.parentElement.style.display = 'block';
                });

            // Container yüksekliğini dinamik olarak ayarla
            container.style.height = 'auto';
        });
});