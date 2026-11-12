const WEATHER_API_URL = 'https://api.weatherapi.com/v1';

export default async function handler(req, res) {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!q) {
    return res.status(400).json({ error: 'A location is required' });
  }

  const apiKey = process.env.WEATHERAPI_KEY?.trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'Weather API is not configured' });
  }

  const params = new URLSearchParams({
    key: apiKey,
    q,
    days: '5',
    aqi: 'no'
  });

  try {
    const response = await fetch(`${WEATHER_API_URL}/forecast.json?${params}`);
    const data = await response.json();

    if (!response.ok) {
      const status = data.error?.code === 1006 ? 404 : data.error?.code === 2008 ? 502 : response.status;
      return res.status(status).json({
        error: data.error?.message || 'Weather service request failed'
      });
    }

    return res.status(200).json({
      current: data,
      forecast: data.forecast.forecastday
    });
  } catch {
    return res.status(502).json({ error: 'Unable to reach the weather service' });
  }
}
