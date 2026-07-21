'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import MapGL, { Source, Layer, Popup } from 'react-map-gl';
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TractData {
  tractId: string;
  countyName: string;
  totalPopulation: number;
  calEnviroScreenScore: number;
  calEnviroScreenPercentile: number;
  disadvantagedCommunity: boolean;
  longitude: number;
  latitude: number;
}

interface MapProps {
  onTractSelect?: (tractId: string | null) => void;
}

export default function Map({ onTractSelect }: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: -119.4179,
    latitude: 36.7783,
    zoom: 6,
  });

  const [selectedTract, setSelectedTract] = useState<TractData | null>(null);
  const [popupInfo, setPopupInfo] = useState<{ lat: number; lon: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TractData[]>([]);

  // Handle tract click
  const onClick = useCallback(async (event: any) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const tractId = feature.properties?.tractId;
    if (!tractId) return;

    try {
      const response = await fetch(`${API_URL}/tracts/${tractId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedTract(data.tract);
        setPopupInfo({
          lat: event.lngLat.lat,
          lon: event.lngLat.lng,
        });
        onTractSelect?.(tractId);
      }
    } catch (error) {
      console.error('Error fetching tract data:', error);
    }
  }, [onTractSelect]);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.tracts || []);

        if (data.tracts?.[0]) {
          const firstTract = data.tracts[0];
          setViewState({
            longitude: firstTract.longitude,
            latitude: firstTract.latitude,
            zoom: 12,
          });
        }
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Get color based on percentile
  const getColor = (percentile: number) => {
    if (percentile >= 75) return '#DC2626'; // red-600
    if (percentile >= 50) return '#F97316'; // orange-500
    if (percentile >= 25) return '#EAB308'; // yellow-500
    return '#22C55E'; // green-500
  };

  return (
    <div className="relative w-full h-full">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, address, or ZIP..."
            className="flex-1 px-4 py-2 rounded-lg shadow-lg border-2 border-gray-300 focus:border-calej-blue focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-calej-blue text-white rounded-lg shadow-lg hover:bg-blue-900 transition"
          >
            Search
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((tract) => (
              <div
                key={tract.tractId}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => {
                  setViewState({
                    longitude: tract.longitude,
                    latitude: tract.latitude,
                    zoom: 12,
                  });
                  setSearchResults([]);
                }}
              >
                <p className="font-semibold text-sm">{tract.countyName}</p>
                <p className="text-xs text-gray-600">Tract {tract.tractId}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getColor(tract.calEnviroScreenPercentile) }}
                  ></div>
                  <span className="text-xs">
                    {tract.calEnviroScreenPercentile}th percentile
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h4 className="font-bold text-sm mb-2">CalEnviroScreen Percentile</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-3 bg-green-500 rounded"></div>
            <span className="text-xs">0-25% (Low)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs">25-50%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-3 bg-orange-500 rounded"></div>
            <span className="text-xs">50-75%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-3 bg-red-600 rounded"></div>
            <span className="text-xs">75-100% (Disadvantaged)</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['census-tracts']}
        onClick={onClick}
      >
        {/* Placeholder for census tract polygons */}
        {/* In production, load actual GeoJSON from API or static file */}

        {selectedTract && popupInfo && (
          <Popup
            longitude={popupInfo.lon}
            latitude={popupInfo.lat}
            onClose={() => {
              setSelectedTract(null);
              setPopupInfo(null);
              onTractSelect?.(null);
            }}
            closeButton={true}
            closeOnClick={false}
            maxWidth="400px"
          >
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">
                {selectedTract.countyName}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Census Tract {selectedTract.tractId}
              </p>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">CalEnviroScreen Score</p>
                  <p className="text-2xl font-bold text-calej-blue">
                    {selectedTract.calEnviroScreenScore.toFixed(1)}
                  </p>
                  <p className="text-sm">
                    {selectedTract.calEnviroScreenPercentile}th percentile
                  </p>
                </div>

                <div className="border-t pt-2">
                  <p className="text-xs text-gray-500">Population</p>
                  <p className="font-semibold">
                    {selectedTract.totalPopulation.toLocaleString()}
                  </p>
                </div>

                {selectedTract.disadvantagedCommunity && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-sm font-semibold text-red-800">
                      ⚠️ Disadvantaged Community
                    </p>
                    <p className="text-xs text-red-600">
                      Top 25% pollution burden
                    </p>
                  </div>
                )}

                <a
                  href={`/tract/${selectedTract.tractId}`}
                  className="block mt-3 text-center bg-calej-blue text-white py-2 px-4 rounded hover:bg-blue-900 transition text-sm"
                >
                  View Full Details →
                </a>
              </div>
            </div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}
