import { CurrentWeather, WeatherForecast } from '@/types/weather';

// Weather icon mapping
export const getWeatherIcon = (iconCode: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️', // scattered clouds
    '04d': '☁️', // broken clouds
    '04n': '☁️', // broken clouds
    '09d': '🌧️', // shower rain
    '09n': '🌧️', // shower rain
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️', // thunderstorm
    '13d': '❄️', // snow
    '13n': '❄️', // snow
    '50d': '🌫️', // mist
    '50n': '🌫️', // mist
  };

  return iconMap[iconCode] || '🌤️';
};

// Temperature formatting
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  if (unit === 'F') {
    const fahrenheit = (temp * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

// Wind speed formatting
export const formatWindSpeed = (speed: number, unit: 'm/s' | 'km/h' | 'mph' = 'km/h'): string => {
  let convertedSpeed = speed;
  
  switch (unit) {
    case 'km/h':
      convertedSpeed = speed * 3.6;
      break;
    case 'mph':
      convertedSpeed = speed * 2.237;
      break;
    default:
      convertedSpeed = speed;
  }
  
  return `${Math.round(convertedSpeed)} ${unit}`;
};

// Wind direction
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Pressure formatting
export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

// Humidity formatting
export const formatHumidity = (humidity: number): string => {
  return `${humidity}%`;
};

// Visibility formatting
export const formatVisibility = (visibility: number): string => {
  if (visibility >= 1000) {
    return `${(visibility / 1000).toFixed(1)} km`;
  }
  return `${visibility} m`;
};

// UV Index formatting
export const getUVIndexDescription = (uvIndex: number): string => {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

// Get weather description with proper capitalization
export const formatWeatherDescription = (description: string): string => {
  return description
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get time from timestamp
export const formatTime = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Get date from timestamp
export const formatDate = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get day of week from timestamp
export const getDayOfWeek = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Get short day name
export const getShortDayName = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Process forecast data to get daily summaries
export const processForecastData = (forecast: WeatherForecast) => {
  const dailyData: { [key: string]: any } = {};
  
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date: date,
        temps: [],
        weather: [],
        humidity: [],
        windSpeed: [],
        pressure: [],
        pop: [] // probability of precipitation
      };
    }
    
    dailyData[date].temps.push(item.main.temp);
    dailyData[date].weather.push(item.weather[0]);
    dailyData[date].humidity.push(item.main.humidity);
    dailyData[date].windSpeed.push(item.wind.speed);
    dailyData[date].pressure.push(item.main.pressure);
    dailyData[date].pop.push(item.pop);
  });
  
  // Calculate daily averages and extremes
  const processedData = Object.values(dailyData).map((day: any) => ({
    date: day.date,
    dayName: getDayOfWeek(new Date(day.date).getTime() / 1000, forecast.city.timezone),
    shortDayName: getShortDayName(new Date(day.date).getTime() / 1000, forecast.city.timezone),
    minTemp: Math.min(...day.temps),
    maxTemp: Math.max(...day.temps),
    avgTemp: day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length,
    weather: day.weather[Math.floor(day.weather.length / 2)], // middle of day weather
    avgHumidity: day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length,
    avgWindSpeed: day.windSpeed.reduce((a: number, b: number) => a + b, 0) / day.windSpeed.length,
    avgPressure: day.pressure.reduce((a: number, b: number) => a + b, 0) / day.pressure.length,
    maxPop: Math.max(...day.pop) // max probability of precipitation
  }));
  
  return processedData.slice(0, 5); // Return next 5 days
};

// Get weather condition color
export const getWeatherColor = (weatherMain: string): string => {
  const colorMap: { [key: string]: string } = {
    'Clear': 'from-yellow-400 to-orange-500',
    'Clouds': 'from-gray-400 to-gray-600',
    'Rain': 'from-blue-400 to-blue-600',
    'Drizzle': 'from-blue-300 to-blue-500',
    'Thunderstorm': 'from-purple-500 to-purple-700',
    'Snow': 'from-blue-100 to-blue-300',
    'Mist': 'from-gray-300 to-gray-500',
    'Fog': 'from-gray-300 to-gray-500',
    'Haze': 'from-yellow-200 to-yellow-400',
    'Dust': 'from-yellow-300 to-yellow-500',
    'Sand': 'from-yellow-300 to-yellow-500',
    'Ash': 'from-gray-400 to-gray-600',
    'Squall': 'from-blue-500 to-blue-700',
    'Tornado': 'from-red-500 to-red-700'
  };
  
  return colorMap[weatherMain] || 'from-gray-400 to-gray-600';
};

// Get temperature color based on value
export const getTemperatureColor = (temp: number): string => {
  if (temp < 0) return 'text-blue-400';
  if (temp < 10) return 'text-blue-300';
  if (temp < 20) return 'text-green-400';
  if (temp < 30) return 'text-yellow-400';
  if (temp < 35) return 'text-orange-400';
  return 'text-red-400';
};
