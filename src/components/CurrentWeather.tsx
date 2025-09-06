'use client';

import { CurrentWeather as CurrentWeatherType } from '@/types/weather';
import { 
  getWeatherIcon, 
  formatTemperature, 
  formatWindSpeed, 
  formatPressure, 
  formatHumidity, 
  formatVisibility,
  formatWeatherDescription,
  formatTime,
  formatDate,
  getWeatherColor,
  getTemperatureColor
} from '@/lib/weatherUtils';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  isLoading?: boolean;
}

export default function CurrentWeather({ weather, isLoading }: CurrentWeatherProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl p-6 text-white animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-4"></div>
        <div className="h-16 bg-white/20 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-white/20 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const weatherMain = weather.weather[0]?.main || 'Clear';
  const weatherIcon = getWeatherIcon(weather.weather[0]?.icon || '01d');
  const gradientClass = getWeatherColor(weatherMain);

  return (
    <div className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-6 text-white shadow-xl`}>
      {/* Location and Date */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
        <p className="text-white/80">{formatDate(weather.dt, weather.timezone)}</p>
      </div>

      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-6xl">{weatherIcon}</div>
          <div>
            <div className={`text-5xl font-bold ${getTemperatureColor(weather.main.temp)}`}>
              {formatTemperature(weather.main.temp)}
            </div>
            <div className="text-xl text-white/90">
              {formatWeatherDescription(weather.weather[0]?.description || '')}
            </div>
            <div className="text-lg text-white/80">
              Feels like {formatTemperature(weather.main.feels_like)}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="text-sm text-white/80 mb-1">Humidity</div>
          <div className="text-lg font-semibold">{formatHumidity(weather.main.humidity)}</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="text-sm text-white/80 mb-1">Wind Speed</div>
          <div className="text-lg font-semibold">{formatWindSpeed(weather.wind.speed)}</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="text-sm text-white/80 mb-1">Pressure</div>
          <div className="text-lg font-semibold">{formatPressure(weather.main.pressure)}</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="text-sm text-white/80 mb-1">Visibility</div>
          <div className="text-lg font-semibold">{formatVisibility(weather.visibility)}</div>
        </div>
      </div>

      {/* Sunrise/Sunset */}
      <div className="mt-4 flex justify-between text-sm text-white/80">
        <div className="flex items-center space-x-2">
          <span>🌅</span>
          <span>Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>🌇</span>
          <span>Sunset: {formatTime(weather.sys.sunset, weather.timezone)}</span>
        </div>
      </div>
    </div>
  );
}
