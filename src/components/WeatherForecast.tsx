'use client';

import { WeatherForecast as WeatherForecastType } from '@/types/weather';
import { 
  getWeatherIcon, 
  formatTemperature, 
  processForecastData,
  getTemperatureColor
} from '@/lib/weatherUtils';

interface WeatherForecastProps {
  forecast: WeatherForecastType;
  isLoading?: boolean;
}

export default function WeatherForecast({ forecast, isLoading }: WeatherForecastProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gray-300 rounded w-8"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  const dailyData = processForecastData(forecast);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">5-Day Forecast</h3>
      <div className="space-y-3">
        {dailyData.map((day, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getWeatherIcon(day.weather.icon)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {index === 0 ? 'Today' : day.shortDayName}
                </div>
                <div className="text-sm text-gray-600">
                  {day.weather.description}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Precipitation</div>
                <div className="text-sm font-medium">
                  {Math.round(day.maxPop * 100)}%
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${getTemperatureColor(day.maxTemp)}`}>
                  {formatTemperature(day.maxTemp)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatTemperature(day.minTemp)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
