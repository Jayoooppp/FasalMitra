// Weather Controller — fetches real-time weather & air quality from OpenWeatherMap

const OPENWEATHER_BASE = 'https://api.openweathermap.org';

async function geocode(location, apiKey) {
    const city = location.split(',')[0].trim();
    const res = await fetch(
        `${OPENWEATHER_BASE}/geo/1.0/direct?q=${encodeURIComponent(city)},IN&limit=1&appid=${apiKey}`
    );
    const data = await res.json();
    if (!data.length) return null;
    return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
}

exports.getWeather = async (req, res) => {
    try {
        const { location } = req.query;
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Weather service not configured. Set OPENWEATHER_API_KEY in .env' });
        }
        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required' });
        }

        // 1. Geocode location name to coordinates
        const geo = await geocode(location, apiKey);
        if (!geo) {
            return res.status(404).json({ error: `Location "${location}" not found` });
        }

        // 2. Fetch weather and air quality in parallel
        const [weatherRes, aqiRes] = await Promise.all([
            fetch(`${OPENWEATHER_BASE}/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&units=metric&appid=${apiKey}`),
            fetch(`${OPENWEATHER_BASE}/data/2.5/air_pollution?lat=${geo.lat}&lon=${geo.lon}&appid=${apiKey}`)
        ]);

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        // 3. Parse AQI (1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor)
        const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
        const aqiIndex = aqiData?.list?.[0]?.main?.aqi || 0;
        const aqiComponents = aqiData?.list?.[0]?.components || {};

        res.json({
            location: geo.name,
            coordinates: { lat: geo.lat, lon: geo.lon },
            weather: {
                temp: Math.round(weatherData.main?.temp),
                feelsLike: Math.round(weatherData.main?.feels_like),
                humidity: weatherData.main?.humidity,
                description: weatherData.weather?.[0]?.description || '',
                icon: weatherData.weather?.[0]?.icon || '',
                windSpeed: weatherData.wind?.speed,
                pressure: weatherData.main?.pressure,
                visibility: weatherData.visibility,
                clouds: weatherData.clouds?.all,
            },
            airQuality: {
                aqi: aqiIndex,
                label: aqiLabels[aqiIndex - 1] || 'Unknown',
                pm25: aqiComponents.pm2_5,
                pm10: aqiComponents.pm10,
                no2: aqiComponents.no2,
                so2: aqiComponents.so2,
                co: aqiComponents.co,
                o3: aqiComponents.o3,
            }
        });
    } catch (error) {
        console.error('Weather API error:', error.message);
        res.status(500).json({ error: 'Weather service error' });
    }
};
