const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const weatherDescriptions = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  61: 'Rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm'
};

async function getLocation(query) {
  const coordinates = query.split(',').map(Number);
  if (coordinates.length === 2 && coordinates.every(Number.isFinite)) {
    return {
      name: 'Current location',
      country: '',
      latitude: coordinates[0],
      longitude: coordinates[1]
    };
  }

  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
  );
  const data = await response.json();
  const result = data.results?.[0];

  if (!response.ok || !result) {
    throw new Error('City not found');
  }

  return {
    name: result.name,
    country: result.country || '',
    latitude: result.latitude,
    longitude: result.longitude
  };
}

export default async function handler(req, res) {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!query) {
    return res.status(400).json({ error: 'A location is required' });
  }

  try {
    const location = await getLocation(query);
    const params = new URLSearchParams({
      latitude: location.latitude,
      longitude: location.longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,visibility,uv_index,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      forecast_days: '5',
      timezone: 'auto'
    });
    const response = await fetch(`${WEATHER_URL}?${params}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Weather service request failed' });
    }

    const description = weatherDescriptions[data.current.weather_code] || 'Unknown';
    const current = {
      location: { name: location.name, country: location.country },
      current: {
        temp_c: data.current.temperature_2m,
        feelslike_c: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        pressure_mb: data.current.pressure_msl,
        wind_kph: data.current.wind_speed_10m,
        vis_km: data.current.visibility / 1000,
        uv: data.current.uv_index,
        condition: { text: description }
      }
    };

    const forecast = data.daily.time.map((date, index) => ({
      date,
      day: {
        maxtemp_c: data.daily.temperature_2m_max[index],
        mintemp_c: data.daily.temperature_2m_min[index],
        condition: { text: weatherDescriptions[data.daily.weather_code[index]] || 'Unknown' }
      }
    }));

    return res.status(200).json({ current, forecast });
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to reach weather service' });
  }
}
