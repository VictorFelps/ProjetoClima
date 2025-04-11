const API_KEY = '946a03bd0953b9571e37d65d6491cd37 ';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// Elementos do DOM
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const tempValue = document.getElementById('temp-value');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const weatherIcon = document.getElementById('weather-icon');
const forecastCards = document.getElementById('forecast-cards');
const loading = document.querySelector('.loading');
const errorMessage = document.querySelector('.error-message');
const errorText = document.querySelector('.error-text');
const searchInput = document.getElementById('city-input');
const searchSuggestions = document.querySelector('.search-suggestions');
const searchHistory = [];

// Elementos do DOM para informações detalhadas
const pressure = document.getElementById('pressure');
const uvIndex = document.getElementById('uv-index');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const clouds = document.getElementById('clouds');

// Função para obter coordenadas da cidade
async function getCityCoordinates(city) {
    try {
        console.log('Buscando coordenadas para:', city);
        const response = await fetch(
            `${GEOCODING_URL}?q=${city}&limit=1&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta da API:', data);
        
        if (!data || data.length === 0) {
            throw new Error('Cidade não encontrada');
        }
        
        if (!data[0].lat || !data[0].lon) {
            throw new Error('Coordenadas não encontradas');
        }
        
        return {
            lat: data[0].lat,
            lon: data[0].lon,
            name: data[0].name
        };
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        throw error;
    }
}

// Função para buscar dados do clima
async function fetchWeatherData(city) {
    try {
        // Limpar a tela antes de fazer uma nova busca
        clearWeatherEffects();
        
        // Primeiro, obtemos as coordenadas da cidade
        const coordinates = await getCityCoordinates(city);
        console.log('Coordenadas obtidas:', coordinates);
        
        // Depois, buscamos o clima atual usando as coordenadas
        const currentWeatherResponse = await fetch(
            `${BASE_URL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&lang=pt_br&appid=${API_KEY}`
        );
        
        if (!currentWeatherResponse.ok) {
            throw new Error(`Erro na requisição do clima: ${currentWeatherResponse.status}`);
        }
        
        const currentWeatherData = await currentWeatherResponse.json();
        console.log('Dados do clima:', currentWeatherData);

        // Buscar previsão para 5 dias usando as coordenadas
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&lang=pt_br&appid=${API_KEY}`
        );
        
        if (!forecastResponse.ok) {
            throw new Error(`Erro na requisição da previsão: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        console.log('Dados da previsão:', forecastData);

        return { 
            current: { ...currentWeatherData, name: coordinates.name }, 
            forecast: forecastData 
        };
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        clearWeatherEffects(); // Limpar efeitos em caso de erro
        throw error;
    }
}

// Função para limpar todos os efeitos climáticos
function clearWeatherEffects() {
    const existingEffects = document.querySelectorAll('.weather-effect');
    existingEffects.forEach(effect => effect.remove());
    document.body.className = '';
}

// Função para verificar se é noite
function isNight(iconCode) {
    return iconCode.endsWith('n'); // Se o código do ícone terminar com 'n', é noite
}

// Função para criar efeitos climáticos
function createWeatherEffects(weatherType, iconCode) {
    // Limpar efeitos anteriores
    clearWeatherEffects();

    // Criar novo container de efeitos
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'weather-effect';

    // Adicionar classe ao body baseada no clima e hora
    const isNightTime = isNight(iconCode);
    document.body.className = `${weatherType}${isNightTime ? ' night' : ''}`;

    // Criar efeitos específicos
    switch (weatherType) {
        case 'clouds':
            createClouds(effectsContainer);
            break;
        case 'rain':
            createRain(effectsContainer);
            break;
        case 'snow':
            createSnow(effectsContainer);
            break;
    }

    // Adicionar estrelas se for noite
    if (isNightTime) {
        createStars(effectsContainer);
    }

    document.body.appendChild(effectsContainer);
}

// Função para criar nuvens
function createClouds(container) {
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = `${Math.random() * 100 + 50}px`;
        cloud.style.height = `${Math.random() * 50 + 30}px`;
        cloud.style.top = `${Math.random() * 30}%`;
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(cloud);
    }
}

// Função para criar chuva
function createRain(container) {
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 1}s`;
        container.appendChild(drop);
    }
}

// Função para criar neve
function createSnow(container) {
    for (let i = 0; i < 30; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(flake);
    }
}

// Função para criar estrelas
function createStars(container) {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 2}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
    }
}

// Função para formatar hora
function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
    });
}

// Função para atualizar informações detalhadas
function updateDetailedInfo(data) {
    const { current, forecast } = data;

    // Atualizar informações básicas
    pressure.textContent = `${current.main.pressure} hPa`;
    visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    clouds.textContent = `${current.clouds.all}%`;

    // Atualizar nascer e pôr do sol com o timezone correto
    sunrise.textContent = formatTime(current.sys.sunrise, current.timezone);
    sunset.textContent = formatTime(current.sys.sunset, current.timezone);

    // Atualizar índice UV (simulado, pois a API não fornece)
    const uv = Math.floor(Math.random() * 10) + 1;
    uvIndex.textContent = uv;
    
    // Adicionar classe de cor baseada no índice UV
    uvIndex.className = 'info-value';
    if (uv <= 2) {
        uvIndex.classList.add('uv-low');
    } else if (uv <= 5) {
        uvIndex.classList.add('uv-moderate');
    } else if (uv <= 7) {
        uvIndex.classList.add('uv-high');
    } else if (uv <= 10) {
        uvIndex.classList.add('uv-very-high');
    } else {
        uvIndex.classList.add('uv-extreme');
    }
}

// Função para atualizar a interface com os dados do clima
function updateWeatherUI(data) {
    const { current, forecast } = data;

    // Atualizar dados atuais
    cityName.textContent = current.name;
    tempValue.textContent = Math.round(current.main.temp);
    wind.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
    humidity.textContent = `${current.main.humidity}%`;
    
    // Atualizar ícone do clima
    const iconCode = current.weather[0].icon;
    weatherIcon.className = `fas ${getWeatherIcon(iconCode)}`;

    // Atualizar efeitos climáticos
    const weatherType = current.weather[0].main.toLowerCase();
    createWeatherEffects(weatherType, iconCode);

    // Atualizar informações detalhadas
    updateDetailedInfo(data);

    // Atualizar previsão
    updateForecastUI(forecast);
}

// Função para atualizar a previsão do tempo
function updateForecastUI(forecast) {
    forecastCards.innerHTML = '';
    
    // Agrupar previsões por dia
    const dailyForecasts = {};
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = {
                temp: item.main.temp,
                icon: item.weather[0].icon,
                description: item.weather[0].description
            };
        }
    });

    // Criar cards de previsão
    Object.entries(dailyForecasts).forEach(([day, data]) => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h4>${day}</h4>
            <i class="fas ${getWeatherIcon(data.icon)}"></i>
            <p>${Math.round(data.temp)}°C</p>
            <p>${data.description}</p>
        `;
        forecastCards.appendChild(card);
    });
}

// Função para mapear códigos de ícones da API para ícones do Font Awesome
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fa-sun',
        '01n': 'fa-moon',
        '02d': 'fa-cloud-sun',
        '02n': 'fa-cloud-moon',
        '03d': 'fa-cloud',
        '03n': 'fa-cloud',
        '04d': 'fa-cloud',
        '04n': 'fa-cloud',
        '09d': 'fa-cloud-rain',
        '09n': 'fa-cloud-rain',
        '10d': 'fa-cloud-sun-rain',
        '10n': 'fa-cloud-moon-rain',
        '11d': 'fa-bolt',
        '11n': 'fa-bolt',
        '13d': 'fa-snowflake',
        '13n': 'fa-snowflake',
        '50d': 'fa-smog',
        '50n': 'fa-smog'
    };
    return iconMap[iconCode] || 'fa-cloud';
}

// Função para mostrar loading
function showLoading() {
    loading.classList.add('active');
}

// Função para esconder loading
function hideLoading() {
    loading.classList.remove('active');
}

// Função para mostrar mensagem de erro
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

// Função para buscar sugestões de cidades
async function fetchCitySuggestions(query) {
    if (query.length < 2) {
        searchSuggestions.classList.remove('active');
        return;
    }

    try {
        const response = await fetch(
            `${GEOCODING_URL}?q=${query}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
            showSuggestions(data);
        } else {
            searchSuggestions.classList.remove('active');
        }
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
    }
}

// Função para mostrar sugestões
function showSuggestions(cities) {
    searchSuggestions.innerHTML = '';
    cities.forEach(city => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = `${city.name}, ${city.country}`;
        item.addEventListener('click', () => {
            searchInput.value = `${city.name}, ${city.country}`;
            searchSuggestions.classList.remove('active');
            searchWeather(city.name);
        });
        searchSuggestions.appendChild(item);
    });
    searchSuggestions.classList.add('active');
}

// Função para buscar o clima
async function searchWeather(city) {
    try {
        showLoading();
        const data = await fetchWeatherData(city);
        updateWeatherUI(data);
        
        // Adicionar ao histórico
        if (!searchHistory.includes(city)) {
            searchHistory.unshift(city);
            if (searchHistory.length > 5) {
                searchHistory.pop();
            }
        }
    } catch (error) {
        showError('Cidade não encontrada. Por favor, tente novamente.');
    } finally {
        hideLoading();
    }
}

// Event Listeners
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city) {
        try {
            const data = await fetchWeatherData(city);
            updateWeatherUI(data);
        } catch (error) {
            alert('Cidade não encontrada. Por favor, tente novamente.');
        }
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

searchInput.addEventListener('input', (e) => {
    fetchCitySuggestions(e.target.value);
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.length >= 2) {
        fetchCitySuggestions(searchInput.value);
    }
});

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove('active');
    }
});

// Carregar dados iniciais
window.addEventListener('load', () => {
    fetchWeatherData('São Paulo')
        .then(updateWeatherUI)
        .catch(console.error);
}); 
