'use client';

import { WeatherAlert } from '@/types/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  isLoading?: boolean;
}

export default function WeatherAlerts({ alerts, isLoading }: WeatherAlertsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Weather Alerts</h3>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Weather Alerts</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <p>No weather alerts for your area</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'medium':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'extreme':
        return 'border-red-300 bg-red-100 text-red-900';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return '⚠️';
      case 'medium':
        return '⚠️';
      case 'high':
        return '🚨';
      case 'extreme':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Weather Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 border-l-4 rounded-lg ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{alert.title}</h4>
                <p className="text-sm mb-2">{alert.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize font-medium">
                    {alert.severity} severity
                  </span>
                  <span>
                    Expires: {new Date(alert.expires).toLocaleDateString()}
                  </span>
                </div>
                {alert.areas.length > 0 && (
                  <div className="mt-2 text-xs">
                    <span className="font-medium">Areas: </span>
                    {alert.areas.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
