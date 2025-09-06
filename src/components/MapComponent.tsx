'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapComponentProps {
  currentLocation: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  status: string;
}

export default function MapComponent({ currentLocation, destination, status }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !currentLocation) {
    return (
      <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  // Create custom icons based on status
  const getCurrentLocationIcon = () => {
    const color = status === 'danger' ? 'red' : status === 'check' ? 'orange' : 'green';
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">🚗</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const getDestinationIcon = () => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: #3b82f6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">📍</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  // Calculate route polyline (simplified straight line for demo)
  const routeCoordinates = currentLocation && destination ? [
    [currentLocation.lat, currentLocation.lng],
    [destination.lat, destination.lng]
  ] : [];

  return (
    <div className="w-full h-48 rounded-lg overflow-hidden">
      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Current Location Marker */}
        <Marker 
          position={[currentLocation.lat, currentLocation.lng]} 
          icon={getCurrentLocationIcon()}
        >
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
              <br />
              Status: {status === 'on_trip' ? 'Safe' : status === 'check' ? 'Checking' : status === 'danger' ? 'Emergency' : 'Safe'}
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        {destination && (
          <Marker 
            position={[destination.lat, destination.lng]} 
            icon={getDestinationIcon()}
          >
            <Popup>
              <div className="text-center">
                <strong>Destination</strong>
                <br />
                Estimated arrival: 15 min
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            color={status === 'danger' ? '#ef4444' : status === 'check' ? '#f59e0b' : '#10b981'}
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
}
