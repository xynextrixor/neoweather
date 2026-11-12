import { useCallback, useEffect, useState } from 'react';
import './App.css';

const DEFAULT_CITY = 'London';
const SAVED_CITIES_KEY = 'savedCities';

async function requestWeather(location) {
  const response = await fetch(`/api/weather?q=${encodeURIComponent(location)}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Unable to load weather data');
  }

  return data;
}

function readSavedCities() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_CITIES_KEY) || '[]');
    return Array.isArray(saved)
      ? saved.filter((city) => typeof city === 'string' && city.trim())
      : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [cities, setCities] = useState(readSavedCities);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadWeather = useCallback(async (location) => {
    setLoading(true);
    setError('');

    try {
      const data = await requestWeather(location);
      setCurrentCity(data.current);
      setForecast(data.forecast || []);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    const savedCities = readSavedCities();

    if (savedCities.length > 0) {
      loadWeather(savedCities[0]);
      return;
    }

    if (!navigator.geolocation) {
      loadWeather(DEFAULT_CITY);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => loadWeather(`${coords.latitude},${coords.longitude}`),
      () => loadWeather(DEFAULT_CITY)
    );
  }, [loadWeather]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const city = searchQuery.trim();

    if (!city || loading) {
      return;
    }

    const loaded = await loadWeather(city);
    if (loaded) {
      setCities((savedCities) =>
        savedCities.some((savedCity) => savedCity.toLowerCase() === city.toLowerCase())
          ? savedCities
          : [...savedCities, city]
      );
      setSearchQuery('');
    }
  };

  const removeCity = (event, cityToRemove) => {
    event.stopPropagation();
    setCities((savedCities) => savedCities.filter((city) => city !== cityToRemove));
  };

  const convertTemp = (temperature) =>
    Math.round(isCelsius ? temperature : (temperature * 9) / 5 + 32);
  const temperatureUnit = isCelsius ? '°C' : '°F';

  return (
    <div className="container">
      <header className="header">
        <div className="header-title">
          <h1>WEATHER</h1>
          <span className="subtitle">BRUTALIST EDITION</span>
        </div>
        <button
          className={`temp-toggle ${isCelsius ? 'active' : ''}`}
          onClick={() => setIsCelsius((value) => !value)}
        >
          {temperatureUnit}
        </button>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-input"
          type="search"
          placeholder="SEARCH CITY"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search for a city"
        />
        <button className="search-btn" type="submit" disabled={loading}>
          {loading ? 'LOADING' : 'FIND'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <main className="content">
        {loading && !currentCity ? (
          <div className="loading">LOADING...</div>
        ) : currentCity ? (
          <div className="weather-section">
            <section className="weather-box">
              <div className="weather-header">
                <h2>{currentCity.location.name.toUpperCase()}</h2>
                <span className="country">{currentCity.location.country}</span>
              </div>
              <div className="weather-main">
                <div className="temp-display">
                  <span className="big-temp">
                    {convertTemp(currentCity.current.temp_c)}
                  </span>
                  <span className="unit">{temperatureUnit}</span>
                </div>
                <div className="weather-desc">
                  <span className="condition">
                    {currentCity.current.condition.text.toUpperCase()}
                  </span>
                  <span className="description">
                    FEELS LIKE {convertTemp(currentCity.current.feelslike_c)}
                    {temperatureUnit}
                  </span>
                </div>
              </div>
              <div className="weather-details">
                <WeatherDetail label="HUMIDITY" value={`${currentCity.current.humidity}%`} />
                <WeatherDetail label="PRESSURE" value={`${currentCity.current.pressure_mb} hPa`} />
                <WeatherDetail label="WIND" value={`${currentCity.current.wind_kph} km/h`} />
                <WeatherDetail label="VISIBILITY" value={`${currentCity.current.vis_km} km`} />
                <WeatherDetail label="UV INDEX" value={currentCity.current.uv} />
              </div>
            </section>

            <section className="forecast-section">
              <h3>5-DAY FORECAST</h3>
              <div className="forecast-grid">
                {forecast.map((day) => (
                  <div className="forecast-card" key={day.date}>
                    <div className="forecast-date">
                      {new Date(`${day.date}T12:00:00`).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      }).toUpperCase()}
                    </div>
                    <div className="forecast-icon">{getWeatherIcon(day.day.condition.text)}</div>
                    <div className="forecast-temp">
                      <span className="high">{convertTemp(day.day.maxtemp_c)}{temperatureUnit}</span>
                      <span className="low">{convertTemp(day.day.mintemp_c)}{temperatureUnit}</span>
                    </div>
                    <div className="forecast-condition">{day.day.condition.text.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {cities.length > 0 && (
          <section className="saved-cities">
            <h3>SAVED CITIES</h3>
            <div className="cities-list">
              {cities.map((city) => (
                <div className="city-item" key={city} onClick={() => loadWeather(city)}>
                  <span>{city.toUpperCase()}</span>
                  <button className="remove-btn" onClick={(event) => removeCity(event, city)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>POWERED BY WEATHERAPI • DATA AUTO-UPDATES HOURLY</p>
      </footer>
    </div>
  );
}

function WeatherDetail({ label, value }) {
  return (
    <div className="detail">
      <label>{label}</label>
      <span>{value}</span>
    </div>
  );
}

function getWeatherIcon(condition) {
  const value = condition.toLowerCase();
  if (value.includes('sunny') || value.includes('clear')) return '☀';
  if (value.includes('thunder') || value.includes('storm')) return '⚡';
  if (value.includes('snow')) return '❄';
  if (value.includes('rain') || value.includes('drizzle')) return '☔';
  if (value.includes('cloud') || value.includes('overcast')) return '☁';
  if (value.includes('mist') || value.includes('fog')) return '💨';
  return '◼';
}
