'use client';

import { useState, useEffect } from 'react';
import { WeatherHistory as WeatherHistoryType } from '@/types/weather';
import { formatDate, formatTemperature } from '@/lib/weatherUtils';

interface WeatherHistoryProps {
  currentWeather: any;
  isLoading?: boolean;
}

export default function WeatherHistory({ currentWeather, isLoading }: WeatherHistoryProps) {
  const [history, setHistory] = useState<WeatherHistoryType[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Save current weather to history when it changes
  useEffect(() => {
    if (currentWeather && currentWeather.current) {
      const weatherEntry: WeatherHistoryType = {
        id: Date.now().toString(),
        location: `${currentWeather.current.name}, ${currentWeather.current.sys.country}`,
        date: new Date().toISOString(),
        temperature: currentWeather.current.main.temp,
        description: currentWeather.current.weather[0]?.description || '',
        icon: currentWeather.current.weather[0]?.icon || '01d',
        humidity: currentWeather.current.main.humidity,
        windSpeed: currentWeather.current.wind.speed,
        pressure: currentWeather.current.main.pressure
      };

      // Get existing history
      const existingHistory = JSON.parse(localStorage.getItem('weather-history') || '[]');
      
      // Add new entry at the beginning
      const updatedHistory = [weatherEntry, ...existingHistory];
      
      // Keep only last 30 entries
      const trimmedHistory = updatedHistory.slice(0, 30);
      
      // Save to localStorage
      localStorage.setItem('weather-history', JSON.stringify(trimmedHistory));
      setHistory(trimmedHistory);
    }
  }, [currentWeather]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('weather-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Failed to parse weather history:', err);
        localStorage.removeItem('weather-history');
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('weather-history');
    setHistory([]);
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return iconMap[iconCode] || '🌤️';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Weather History</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Weather History</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No weather history yet</p>
          <p className="text-sm">Check the weather to start building your history</p>
        </div>
      </div>
    );
  }

  const displayedHistory = isExpanded ? history : history.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Weather History</h3>
        <div className="flex space-x-2">
          {history.length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-500 hover:text-blue-700 font-medium"
            >
              {isExpanded ? 'Show Less' : `Show All (${history.length})`}
            </button>
          )}
          <button
            onClick={clearHistory}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {displayedHistory.map((entry) => (
          <div 
            key={entry.id} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getWeatherIcon(entry.icon)}
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {entry.location}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(new Date(entry.date).getTime() / 1000)}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {entry.description}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                {formatTemperature(entry.temperature)}
              </div>
              <div className="text-xs text-gray-500">
                {entry.humidity}% • {Math.round(entry.windSpeed * 3.6)} km/h
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!isExpanded && history.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium"
          >
            View {history.length - 5} more entries
          </button>
        </div>
      )}
    </div>
  );
}
