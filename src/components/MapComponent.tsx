'use client';

// ========================================
// IMPORTS SECTION
// ========================================
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ========================================
// LEAFLET ICON FIX
// ========================================
// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ========================================
// COMPONENT PROPS INTERFACE
// ========================================
interface MapComponentProps {
  currentLocation: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  status: string;
  rideProgress?: number;
  isOffTrack?: boolean;
  isReturningToRoute?: boolean;
}

// ========================================
// MAIN MAP COMPONENT
// ========================================
export default function MapComponent({ currentLocation, destination, status, rideProgress = 0, isOffTrack = false, isReturningToRoute = false }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  // ========================================
  // CLIENT-SIDE RENDERING CHECK
  // ========================================
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

  // ========================================
  // CAR POSITION CALCULATION LOGIC
  // ========================================
// Calculate current position based on ride progress
const getCurrentPosition = () => {
  if (!currentLocation || !destination || rideProgress === 0) {
    return currentLocation;
  }
  
  if (!isOffTrack) {
    // Normal route to destination
    const lat = currentLocation.lat + (destination.lat - currentLocation.lat) * rideProgress;
    const lng = currentLocation.lng + (destination.lng - currentLocation.lng) * rideProgress;
    return { lat, lng };
  } else if (isReturningToRoute) {
    // Smoothly slide back to original route
    // Calculate the original route position at 60% (where we went off-track)
    const originalRouteLat = currentLocation.lat + (destination.lat - currentLocation.lat) * 0.6;
    const originalRouteLng = currentLocation.lng + (destination.lng - currentLocation.lng) * 0.6;
    
    // Calculate how far off-track we were (maximum deviation)
    const maxOffTrackLat = originalRouteLat + 0.002; // Small deviation
    const maxOffTrackLng = originalRouteLng - 0.001;
    
    // Calculate return progress (0 = fully off-track, 1 = back on original route)
    const returnProgress = Math.min(1, (rideProgress - 0.6) / 0.4);
    
    // Smooth interpolation back to original route
    const lat = maxOffTrackLat + (originalRouteLat - maxOffTrackLat) * returnProgress;
    const lng = maxOffTrackLng + (originalRouteLng - maxOffTrackLng) * returnProgress;
    
    return { lat, lng };
  } else {
    // Smoothly slide off-track
    // Calculate the original route position at 60% (where we start going off-track)
    const originalRouteLat = currentLocation.lat + (destination.lat - currentLocation.lat) * 0.6;
    const originalRouteLng = currentLocation.lng + (destination.lng - currentLocation.lng) * 0.6;
    
    // Calculate off-track progress (0 = on route, 1 = fully off-track)
    const offTrackProgress = Math.min(1, (rideProgress - 0.6) / 0.4);
    
    // Smooth deviation from original route
    const offTrackLat = originalRouteLat + 0.002 * offTrackProgress;
    const offTrackLng = originalRouteLng - 0.001 * offTrackProgress;
    
    return { lat: offTrackLat, lng: offTrackLng };
  }
};

  const currentPosition = getCurrentPosition();

  // ========================================
  // MAP ICON CREATION FUNCTIONS
  // ========================================
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

  // ========================================
  // ROUTE CALCULATION FUNCTIONS
  // ========================================
  // Calculate route polyline (simplified straight line for demo)
  const routeCoordinates = currentLocation && destination ? [
    [currentLocation.lat, currentLocation.lng],
    [destination.lat, destination.lng]
  ] : [];


  // ========================================
  // MAP RENDER - MAIN MAP CONTAINER
  // ========================================
  return (
    <div className="w-full h-48 rounded-lg overflow-hidden">
      <MapContainer
        center={currentPosition ? [currentPosition.lat, currentPosition.lng] : [currentLocation.lat, currentLocation.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* ======================================== */}
        {/* MAP TILE LAYER */}
        {/* ======================================== */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* ======================================== */}
        {/* CAR LOCATION MARKER */}
        {/* ======================================== */}
        {currentPosition && (
          <Marker 
            position={[currentPosition.lat, currentPosition.lng]} 
            icon={getCurrentLocationIcon()}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
                <br />
                Status: {status === 'on_trip' ? 'Safe' : status === 'check' ? 'Checking' : status === 'danger' ? 'Emergency' : 'Safe'}
                <br />
                Progress: {Math.round(rideProgress * 100)}%
              </div>
            </Popup>
          </Marker>
        )}

        {/* ======================================== */}
        {/* DESTINATION MARKERS */}
        {/* ======================================== */}
        {/* Original Destination Marker - always show the original destination */}
        {destination && (
          <Marker 
            position={[destination.lat, destination.lng]} 
            icon={getDestinationIcon()}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Destination</strong>
                <br />
                {isOffTrack && !isReturningToRoute ? "Driver is going off-track!" : "Estimated arrival: 15 min"}
              </div>
            </Popup>
          </Marker>
        )}


        {/* ======================================== */}
        {/* ROUTE LINES */}
        {/* ======================================== */}
        {/* Main Route Line - only show the original intended route */}
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
