import { NextRequest, NextResponse } from 'next/server';

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');
    const type = searchParams.get('type') || 'current'; // current, forecast, or both

    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenWeatherMap API key not configured' },
        { status: 500 }
      );
    }

    let weatherData: any = {};

    // Get current weather
    if (type === 'current' || type === 'both') {
      let currentUrl = '';
      
      if (lat && lon) {
        currentUrl = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      } else if (city) {
        currentUrl = `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      } else {
        return NextResponse.json(
          { error: 'Either lat/lon or city parameter is required' },
          { status: 400 }
        );
      }

      const currentResponse = await fetch(currentUrl);
      if (!currentResponse.ok) {
        throw new Error(`Current weather API error: ${currentResponse.status}`);
      }
      weatherData.current = await currentResponse.json();
    }

    // Get 5-day forecast
    if (type === 'forecast' || type === 'both') {
      let forecastUrl = '';
      
      if (lat && lon) {
        forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      } else if (city) {
        forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      } else {
        return NextResponse.json(
          { error: 'Either lat/lon or city parameter is required' },
          { status: 400 }
        );
      }

      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.status}`);
      }
      weatherData.forecast = await forecastResponse.json();
    }

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

// Geocoding API for location search
export async function POST(request: NextRequest) {
  try {
    const { searchQuery } = await request.json();

    if (!searchQuery) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenWeatherMap API key not configured' },
        { status: 500 }
      );
    }

    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=5&appid=${OPENWEATHER_API_KEY}`;
    
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const locations = await response.json();
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    );
  }
}
