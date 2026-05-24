import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY || 'YOUR_API_KEY_HERE';

export default function App() {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cities from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedCities')) || [];
    setCities(saved);
    
    // Get geolocation on start
    if (navigator.geolocation && saved.length === 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.log('Geolocation denied, using default');
          fetchWeatherByCity('London');
        }
      );
    } else if (saved.length > 0) {
      fetchWeatherByCity(saved[0]);
    }
  }, []);

  // Save cities to localStorage
  useEffect(() => {
    localStorage.setItem('savedCities', JSON.stringify(cities));
  }, [cities]);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      
      const weatherRes = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
      );
      
      const forecastRes = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no`
      );

      setCurrentCity(weatherRes.data);
      setForecast(forecastRes.data.forecast.forecastday);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );

      setCurrentCity(res.data);

      const forecastRes = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no`
      );

      setForecast(forecastRes.data.forecast.forecastday);
    } catch (err) {
      setError(`City "${city}" not found`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherByCity(searchQuery);
      
      // Add to saved cities if not already there
      if (!cities.includes(searchQuery)) {
        setCities([...cities, searchQuery]);
      }
      
      setSearchQuery('');
    }
  };

  const handleCityClick = (city) => {
    fetchWeatherByCity(city);
  };

  const handleRemoveCity = (e, city) => {
    e.stopPropagation();
    setCities(cities.filter(c => c !== city));
  };

  const convertTemp = (temp) => {
    return isCelsius ? Math.round(temp) : Math.round((temp * 9/5) + 32);
  };

  const getTempUnit = () => isCelsius ? '°C' : '°F';

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <div className="header-title">
          <h1>WEATHER</h1>
          <span className="subtitle">BRUTALIST EDITION</span>
        </div>
        
        <div className="controls">
          <button
            className={`temp-toggle ${isCelsius ? 'active' : ''}`}
            onClick={() => setIsCelsius(!isCelsius)}
          >
            {isCelsius ? '°C' : '°F'}
          </button>
        </div>
      </header>

      {/* SEARCH FORM */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="SEARCH CITY"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">FIND</button>
      </form>

      {/* ERROR MESSAGE */}
      {error && <div className="error">{error}</div>}

      {/* MAIN CONTENT */}
      <div className="content">
        {/* CURRENT WEATHER */}
        {loading ? (
          <div className="loading">LOADING...</div>
        ) : currentCity ? (
          <div className="weather-section">
            <div className="weather-box">
              <div className="weather-header">
                <h2>{currentCity.location.name.toUpperCase()}</h2>
                <span className="country">{currentCity.location.country}</span>
              </div>

              <div className="weather-main">
                <div className="temp-display">
                  <span className="big-temp">{convertTemp(currentCity.current.temp_c)}</span>
                  <span className="unit">{getTempUnit()}</span>
                </div>

                <div className="weather-desc">
                  <span className="condition">{currentCity.current.condition.text.toUpperCase()}</span>
                  <span className="description">{currentCity.current.condition.text.toUpperCase()}</span>
                </div>
              </div>

              <div className="weather-details">
                <div className="detail">
                  <label>FEELS LIKE</label>
                  <span>{convertTemp(currentCity.current.feelslike_c)}{getTempUnit()}</span>
                </div>
                <div className="detail">
                  <label>HUMIDITY</label>
                  <span>{currentCity.current.humidity}%</span>
                </div>
                <div className="detail">
                  <label>PRESSURE</label>
                  <span>{currentCity.current.pressure_mb} hPa</span>
                </div>
                <div className="detail">
                  <label>WIND</label>
                  <span>{currentCity.current.wind_kph.toFixed(1)} km/h</span>
                </div>
                <div className="detail">
                  <label>VISIBILITY</label>
                  <span>{currentCity.current.vis_km.toFixed(1)} km</span>
                </div>
                <div className="detail">
                  <label>UV INDEX</label>
                  <span>{currentCity.current.uv.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* 5-DAY FORECAST */}
            {forecast && (
              <div className="forecast-section">
                <h3>5-DAY FORECAST</h3>
                <div className="forecast-grid">
                  {forecast.map((day, idx) => (
                    <div key={idx} className="forecast-card">
                      <div className="forecast-date">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        }).toUpperCase()}
                      </div>
                      <div className="forecast-icon">
                        {getWeatherIcon(day.day.condition.text)}
                      </div>
                      <div className="forecast-temp">
                        <span className="high">{convertTemp(day.day.maxtemp_c)}{getTempUnit()}</span>
                        <span className="low">{convertTemp(day.day.mintemp_c)}{getTempUnit()}</span>
                      </div>
                      <div className="forecast-condition">
                        {day.day.condition.text.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* SAVED CITIES */}
        {cities.length > 0 && (
          <div className="saved-cities">
            <h3>SAVED CITIES</h3>
            <div className="cities-list">
              {cities.map((city) => (
                <div
                  key={city}
                  className="city-item"
                  onClick={() => handleCityClick(city)}
                >
                  <span>{city.toUpperCase()}</span>
                  <button
                    className="remove-btn"
                    onClick={(e) => handleRemoveCity(e, city)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>POWERED BY WEATHERAPI • DATA AUTO-UPDATES HOURLY</p>
      </footer>
    </div>
  );
}

function getWeatherIcon(condition) {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀';
  if (conditionLower.includes('cloud')) return '☁';
  if (conditionLower.includes('rain')) return '☔';
  if (conditionLower.includes('snow')) return '❄';
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⚡';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '💨';
  if (conditionLower.includes('drizzle')) return '🌧';
  if (conditionLower.includes('overcast')) return '☁';
  if (conditionLower.includes('partly')) return '⛅';
  
  return '◼';
}
