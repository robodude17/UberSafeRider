'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherData, Location, WeatherAlert } from '@/types/weather';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  alerts: WeatherAlert[];
  isLoading: boolean;
  error: string | null;
  currentLocation: Location | null;
  fetchWeatherByLocation: (location: Location) => Promise<void>;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  fetchWeatherByCity: (city: string) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  clearError: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchWeatherData = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
      
      // Mock alerts for demonstration (in a real app, you'd fetch these from a weather alerts API)
      if (data.current) {
        const mockAlerts: WeatherAlert[] = [];
        
        // Add some mock alerts based on weather conditions
        if (data.current.weather[0]?.main === 'Thunderstorm') {
          mockAlerts.push({
            id: 'thunderstorm-1',
            title: 'Thunderstorm Warning',
            description: 'Severe thunderstorms are expected in your area. Stay indoors and avoid outdoor activities.',
            severity: 'high',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            areas: [data.current.name]
          });
        }
        
        if (data.current.wind.speed > 15) {
          mockAlerts.push({
            id: 'wind-1',
            title: 'High Wind Warning',
            description: 'Strong winds are expected. Secure loose objects and drive carefully.',
            severity: 'medium',
            expires: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
            areas: [data.current.name]
          });
        }
        
        setAlerts(mockAlerts);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWeatherByLocation = useCallback(async (location: Location) => {
    setCurrentLocation(location);
    const url = `/api/weather?lat=${location.lat}&lon=${location.lon}&type=both`;
    await fetchWeatherData(url);
  }, [fetchWeatherData]);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    const url = `/api/weather?lat=${lat}&lon=${lon}&type=both`;
    await fetchWeatherData(url);
  }, [fetchWeatherData]);

  const fetchWeatherByCity = useCallback(async (city: string) => {
    const url = `/api/weather?city=${encodeURIComponent(city)}&type=both`;
    await fetchWeatherData(url);
  }, [fetchWeatherData]);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Create a location object for current position
      const location: Location = {
        name: 'Current Location',
        lat: latitude,
        lon: longitude,
        country: 'Unknown'
      };
      
      setCurrentLocation(location);
      await fetchWeatherByCoords(latitude, longitude);
      
    } catch (err) {
      let errorMessage = 'Failed to get current location';
      
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
      }
      
      setError(errorMessage);
      console.error('Geolocation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWeatherByCoords]);

  // Auto-fetch weather on mount if we have a stored location
  useEffect(() => {
    const storedLocation = localStorage.getItem('weather-location');
    if (storedLocation) {
      try {
        const location = JSON.parse(storedLocation);
        setCurrentLocation(location);
        fetchWeatherByLocation(location);
      } catch (err) {
        console.error('Failed to parse stored location:', err);
        localStorage.removeItem('weather-location');
      }
    }
  }, [fetchWeatherByLocation]);

  // Store location when it changes
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem('weather-location', JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  return {
    weatherData,
    alerts,
    isLoading,
    error,
    currentLocation,
    fetchWeatherByLocation,
    fetchWeatherByCoords,
    fetchWeatherByCity,
    getCurrentLocation,
    clearError
  };
}
