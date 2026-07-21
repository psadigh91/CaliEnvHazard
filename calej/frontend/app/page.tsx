'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calej-green mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [selectedTract, setSelectedTract] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-calej-green to-calej-blue text-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">
            Explore Environmental Justice in California
          </h2>
          <p className="text-lg opacity-90">
            Interactive map showing pollution burden, health risks, and disadvantaged communities across 8,000+ census tracts
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm font-semibold">Low Burden (0-25%)</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Minimal environmental impact</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm font-semibold">Moderate (25-50%)</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Below average pollution burden</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm font-semibold">High (50-75%)</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Above average pollution burden</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm font-semibold">Critical (75-100%)</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Disadvantaged communities</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">California At A Glance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-3xl font-bold text-calej-blue">8,000+</p>
              <p className="text-sm text-gray-600">Census Tracts</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-calej-orange">39M</p>
              <p className="text-sm text-gray-600">Residents</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">2,000+</p>
              <p className="text-sm text-gray-600">Disadvantaged Communities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">500+</p>
              <p className="text-sm text-gray-600">Superfund & TRI Sites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="h-[600px]">
            <Map onTractSelect={setSelectedTract} />
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-calej-blue">How to Use This Map</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-calej-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                <h4 className="font-semibold">Search Your Area</h4>
              </div>
              <p className="text-sm text-gray-700">Enter your address, city, or ZIP code to find your census tract.</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-calej-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                <h4 className="font-semibold">Explore the Data</h4>
              </div>
              <p className="text-sm text-gray-700">Click any census tract to see detailed pollution burden and health indicators.</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-calej-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                <h4 className="font-semibold">Find Facilities</h4>
              </div>
              <p className="text-sm text-gray-700">View nearby Superfund sites and toxic release facilities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
