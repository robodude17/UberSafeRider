# 🌤️ Weather Tracker App

A comprehensive weather tracking application built with Next.js 14, TypeScript, and Tailwind CSS. This app provides real-time weather data, forecasts, alerts, and weather history tracking.

## ✨ Features

### 🌡️ Current Weather
- Real-time weather conditions for any location
- Temperature, humidity, wind speed, pressure, and visibility
- Weather icons and descriptions
- Sunrise/sunset times
- Feels-like temperature

### 📅 5-Day Forecast
- Detailed 5-day weather forecast
- Daily high/low temperatures
- Precipitation probability
- Weather conditions for each day

### 🚨 Weather Alerts
- Important weather warnings and alerts
- Severity levels (low, medium, high, extreme)
- Alert expiration times
- Affected areas information

### 📊 Weather History
- Automatic tracking of weather data
- Local storage of weather history
- View past weather conditions
- Expandable history view

### 🔍 Location Features
- Search for any city worldwide
- Automatic geolocation detection
- Location-based weather data
- Persistent location storage

### 🎨 Beautiful UI
- Modern, responsive design
- Gradient backgrounds based on weather conditions
- Smooth animations and transitions
- Mobile-friendly interface
- Tabbed navigation system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   ```

4. **Get your OpenWeatherMap API key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key
   - Add it to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts          # Weather API endpoints
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main weather app page
│   └── globals.css               # Global styles
├── components/
│   ├── CurrentWeather.tsx        # Current weather display
│   ├── WeatherForecast.tsx       # 5-day forecast
│   ├── WeatherAlerts.tsx         # Weather alerts
│   ├── WeatherHistory.tsx        # Weather history
│   └── LocationSearch.tsx        # Location search component
├── lib/
│   ├── hooks/
│   │   └── useWeather.ts         # Weather data management hook
│   └── weatherUtils.ts           # Weather utility functions
└── types/
    └── weather.ts                # TypeScript type definitions
```

## 🔧 API Endpoints

### GET `/api/weather`
Fetches weather data for a location.

**Query Parameters:**
- `lat` (number): Latitude
- `lon` (number): Longitude  
- `city` (string): City name
- `type` (string): 'current', 'forecast', or 'both' (default: 'current')

**Example:**
```bash
GET /api/weather?lat=40.7128&lon=-74.0060&type=both
```

### POST `/api/weather`
Searches for locations by name.

**Body:**
```json
{
  "searchQuery": "New York"
}
```

## 🎯 Usage

### Basic Usage
1. **Search for a location**: Type a city name in the search box
2. **Use current location**: Click the location button (📍) to get weather for your current position
3. **Navigate tabs**: Use the tab navigation to switch between Current, Forecast, Alerts, and History
4. **View details**: Click on any weather card to see more detailed information

### Features Overview

#### Current Weather Tab
- Displays real-time weather conditions
- Shows temperature, humidity, wind speed, pressure, and visibility
- Includes sunrise/sunset times
- Weather icon and description

#### Forecast Tab
- 5-day weather forecast
- Daily high/low temperatures
- Precipitation probability
- Weather conditions for each day

#### Alerts Tab
- Weather warnings and alerts
- Severity levels and expiration times
- Affected areas information

#### History Tab
- Past weather conditions
- Automatically saved weather data
- Expandable view for more entries
- Clear history option

## 🛠️ Customization

### Adding New Weather Data
To add new weather information, modify the `weatherUtils.ts` file:

```typescript
// Add new utility functions
export const formatNewWeatherData = (data: any) => {
  // Your custom formatting logic
};
```

### Styling
The app uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.ts`
- Component styles in individual component files
- Global styles in `globals.css`

### API Integration
To integrate with other weather APIs:
1. Modify the API route in `src/app/api/weather/route.ts`
2. Update the TypeScript types in `src/types/weather.ts`
3. Adjust the utility functions in `src/lib/weatherUtils.ts`

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | No |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | No |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | No |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | No |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | No |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | No |

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org/) for type safety

## 📞 Support

If you have any questions or need help:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Happy Weather Tracking! 🌤️**
