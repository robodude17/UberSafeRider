'use client';

import { useState, useEffect } from 'react';
import { Location } from '@/types/weather';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  onGeolocationClick: () => void;
  isLoading?: boolean;
}

export default function LocationSearch({ onLocationSelect, onGeolocationClick, isLoading }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: query }),
      });

      if (response.ok) {
        const locations = await response.json();
        setSearchResults(locations);
        setShowResults(true);
      } else {
        console.error('Failed to search locations');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchLocations(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleLocationSelect = (location: Location) => {
    setSearchQuery(`${location.name}, ${location.country}`);
    setShowResults(false);
    onLocationSelect(location);
  };

  const handleGeolocationClick = () => {
    setSearchQuery('');
    setShowResults(false);
    onGeolocationClick();
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.location-search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="location-search-container relative">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="font-medium text-gray-900">
                    {location.name}
                    {location.state && `, ${location.state}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {location.country}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* No Results */}
          {showResults && searchResults.length === 0 && !isSearching && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
              No locations found
            </div>
          )}
        </div>
        
        <button
          onClick={handleGeolocationClick}
          disabled={isLoading}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Use current location"
        >
          📍
        </button>
      </div>
      
      {/* Loading indicator */}
      {isSearching && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
