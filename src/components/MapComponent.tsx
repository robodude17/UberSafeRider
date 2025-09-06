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
      // Smoothly return from off-track position to original route
      // Calculate the off-track destination
      const offTrackLat = destination.lat + 0.003;
      const offTrackLng = destination.lng - 0.002;
      
      // Calculate where we were when we went off-track (at 60% of original route)
      const offTrackStartLat = currentLocation.lat + (destination.lat - currentLocation.lat) * 0.6;
      const offTrackStartLng = currentLocation.lng + (destination.lng - currentLocation.lng) * 0.6;
      
      // Calculate how far off-track we went
      const offTrackDistance = Math.min(1, (rideProgress - 0.6) / 0.4);
      const maxOffTrackLat = offTrackStartLat + (offTrackLat - offTrackStartLat) * offTrackDistance;
      const maxOffTrackLng = offTrackStartLng + (offTrackLng - offTrackStartLng) * offTrackDistance;
      
      // Now calculate return progress (0 = fully off-track, 1 = back on original route)
      const returnProgress = Math.min(1, (rideProgress - 0.6) / 0.4);
      
      // Interpolate back to the original route
      const lat = maxOffTrackLat + (offTrackStartLat - maxOffTrackLat) * returnProgress;
      const lng = maxOffTrackLng + (offTrackStartLng - maxOffTrackLng) * returnProgress;
      
      return { lat, lng };
    } else {
      // Off-track route - car goes to a different location
      const offTrackLat = destination.lat + 0.003;
      const offTrackLng = destination.lng - 0.002;
      
      // Calculate progress from when off-track started (60%)
      const offTrackProgress = Math.max(0, (rideProgress - 0.6) / 0.4);
      
      const lat = currentLocation.lat + (offTrackLat - currentLocation.lat) * offTrackProgress;
      const lng = currentLocation.lng + (offTrackLng - currentLocation.lng) * offTrackProgress;
      
      return { lat, lng };
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

  // Calculate off-route path when ride progress > 60%
  const getOffRouteCoordinates = () => {
    if (rideProgress <= 0.6 || !currentPosition || !destination) return [];
    
    // Create a detour path that goes off the main route
    const detourLat = currentPosition.lat + 0.002;
    const detourLng = currentPosition.lng + 0.001;
    
    return [
      [currentPosition.lat, currentPosition.lng],
      [detourLat, detourLng]
    ];
  };

  // Calculate the actual route the car is taking
  const getActualRouteCoordinates = () => {
    if (!currentLocation || !destination) return [];
    
    if (!isOffTrack || isReturningToRoute) {
      // Normal route to destination
      return [
        [currentLocation.lat, currentLocation.lng],
        [destination.lat, destination.lng]
      ];
    } else {
      // Off-track route - car goes to a different location
      const offTrackLat = destination.lat + 0.003;
      const offTrackLng = destination.lng - 0.002;
      
      return [
        [currentLocation.lat, currentLocation.lng],
        [offTrackLat, offTrackLng]
      ];
    }
  };

  const offRouteCoordinates = getOffRouteCoordinates();
  const actualRouteCoordinates = getActualRouteCoordinates();

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

        {/* Off-track Destination Marker - only show when car is going off-track */}
        {destination && isOffTrack && !isReturningToRoute && (
          <Marker 
            position={[destination.lat + 0.003, destination.lng - 0.002]} 
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="
                background-color: #f59e0b;
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
              ">⚠️</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>Where Driver is Going</strong>
                <br />
                This is not your intended destination!
              </div>
            </Popup>
          </Marker>
        )}

        {/* ======================================== */}
        {/* ROUTE LINES */}
        {/* ======================================== */}
        {/* Original Route Line (dashed, only visible when off-track) */}
        {routeCoordinates.length > 0 && isOffTrack && !isReturningToRoute && (
          <Polyline
            positions={routeCoordinates}
            color="#6b7280"
            weight={2}
            opacity={0.5}
            dashArray="10, 10"
          />
        )}

        {/* Actual Route Line (the route being taken) */}
        {actualRouteCoordinates.length > 0 && (
          <Polyline
            positions={actualRouteCoordinates}
            color={status === 'danger' ? '#ef4444' : status === 'check' ? '#f59e0b' : isOffTrack && !isReturningToRoute ? '#f59e0b' : isReturningToRoute ? '#10b981' : '#10b981'}
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Off-route Line (current detour) */}
        {offRouteCoordinates.length > 0 && (
          <Polyline
            positions={offRouteCoordinates}
            color="#f59e0b"
            weight={3}
            opacity={0.9}
            dashArray="5, 5"
          />
        )}
      </MapContainer>
    </div>
  );
}
