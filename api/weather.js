const WEATHER_API_URL = 'https://api.weatherapi.com/v1';

export default async function handler(req, res) {
  const { q } = req.query;

  if (typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ error: 'A location is required' });
  }

  const apiKey = process.env.WEATHERAPI_KEY?.trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'Weather API is not configured' });
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: q.trim(),
    days: '5',
    aqi: 'no'
  });

  try {
    const response = await fetch(`${WEATHER_API_URL}/forecast.json?${params}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
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
