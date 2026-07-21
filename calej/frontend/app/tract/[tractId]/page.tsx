'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TractDetail {
  tractId: string;
  countyName: string;
  totalPopulation: number;
  calEnviroScreenScore: number;
  calEnviroScreenPercentile: number;
  pollutionBurden: number;
  populationCharacteristics: number;
  disadvantagedCommunity: boolean;
  // Environmental
  ozone: number;
  pm25: number;
  dieselPm: number;
  drinkingWater: number;
  pesticides: number;
  toxicReleases: number;
  traffic: number;
  // Population
  asthma: number;
  lowBirthWeight: number;
  cardiovascular: number;
  education: number;
  housingBurden: number;
  linguisticIsolation: number;
  poverty: number;
  unemployment: number;
}

export default function TractDetailPage() {
  const params = useParams();
  const tractId = params.tractId as string;

  const [tract, setTract] = useState<TractDetail | null>(null);
  const [facilities, setFacilities] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tractRes, facilitiesRes] = await Promise.all([
          fetch(`${API_URL}/tracts/${tractId}`),
          fetch(`${API_URL}/facilities?lat=36.7783&lon=-119.4179&radius=10`),
        ]);

        if (tractRes.ok) {
          const tractData = await tractRes.json();
          setTract(tractData.tract);
        }

        if (facilitiesRes.ok) {
          const facilitiesData = await facilitiesRes.json();
          setFacilities(facilitiesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tractId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calej-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tract data...</p>
        </div>
      </div>
    );
  }

  if (!tract) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Tract Not Found</h2>
          <p className="text-red-600">Census tract {tractId} could not be found.</p>
          <a href="/" className="mt-4 inline-block text-calej-blue hover:underline">
            ← Back to Map
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <a href="/" className="text-calej-blue hover:underline mb-2 inline-block">
            ← Back to Map
          </a>
          <h1 className="text-3xl font-bold text-gray-900">
            {tract.countyName} - Census Tract {tract.tractId}
          </h1>
          <p className="text-gray-600 mt-1">
            Population: {tract.totalPopulation.toLocaleString()}
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">CalEnviroScreen 4.0 Score</p>
              <p className="text-5xl font-bold text-calej-blue">
                {tract.calEnviroScreenScore.toFixed(1)}
              </p>
              <p className="text-gray-600 mt-2">
                {tract.calEnviroScreenPercentile}th Percentile
              </p>
            </div>

            <div className="text-center border-l border-r">
              <p className="text-sm text-gray-500 mb-1">Pollution Burden</p>
              <p className="text-5xl font-bold text-orange-600">
                {tract.pollutionBurden.toFixed(1)}
              </p>
              <p className="text-gray-600 mt-2">Environmental Exposure</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Population Characteristics</p>
              <p className="text-5xl font-bold text-purple-600">
                {tract.populationCharacteristics.toFixed(1)}
              </p>
              <p className="text-gray-600 mt-2">Socioeconomic Factors</p>
            </div>
          </div>

          {tract.disadvantagedCommunity && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-bold text-red-800 text-center">
                ⚠️ Designated Disadvantaged Community (DAC)
              </p>
              <p className="text-sm text-red-600 text-center mt-1">
                This census tract scores in the top 25% of pollution burden across California
              </p>
            </div>
          )}
        </div>

        {/* Environmental Indicators */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Environmental Exposure Indicators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <IndicatorCard label="Ozone" value={tract.ozone} />
            <IndicatorCard label="PM2.5" value={tract.pm25} />
            <IndicatorCard label="Diesel PM" value={tract.dieselPm} />
            <IndicatorCard label="Drinking Water" value={tract.drinkingWater} />
            <IndicatorCard label="Pesticides" value={tract.pesticides} />
            <IndicatorCard label="Toxic Releases" value={tract.toxicReleases} />
            <IndicatorCard label="Traffic" value={tract.traffic} />
          </div>
        </div>

        {/* Population Health & Demographics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Population Characteristics
          </h2>

          <h3 className="text-lg font-semibold mt-4 mb-3 text-gray-700">Health Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <IndicatorCard label="Asthma" value={tract.asthma} />
            <IndicatorCard label="Low Birth Weight" value={tract.lowBirthWeight} />
            <IndicatorCard label="Cardiovascular Disease" value={tract.cardiovascular} />
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-700">Socioeconomic Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <IndicatorCard label="Education" value={tract.education} />
            <IndicatorCard label="Housing Burden" value={tract.housingBurden} />
            <IndicatorCard label="Linguistic Isolation" value={tract.linguisticIsolation} />
            <IndicatorCard label="Poverty" value={tract.poverty} />
            <IndicatorCard label="Unemployment" value={tract.unemployment} />
          </div>
        </div>

        {/* Nearby Facilities */}
        {facilities && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Nearby Environmental Facilities
            </h2>

            {facilities.superfundSites?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  EPA Superfund Sites ({facilities.superfundSites.length})
                </h3>
                <div className="space-y-2">
                  {facilities.superfundSites.slice(0, 5).map((site: any) => (
                    <div key={site.siteId} className="border rounded p-3">
                      <p className="font-semibold">{site.siteName}</p>
                      <p className="text-sm text-gray-600">
                        {site.city}, {site.county} County
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {site.distanceMiles?.toFixed(2)} miles away · {site.nplStatus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {facilities.triFacilities?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  TRI Facilities ({facilities.triFacilities.length})
                </h3>
                <div className="space-y-2">
                  {facilities.triFacilities.slice(0, 5).map((facility: any) => (
                    <div key={facility.facilityId} className="border rounded p-3">
                      <p className="font-semibold">{facility.facilityName}</p>
                      <p className="text-sm text-gray-600">
                        {facility.city}, {facility.county} County
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {facility.distanceMiles?.toFixed(2)} miles away · {facility.industrySector}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IndicatorCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value.toFixed(2)}</p>
    </div>
  );
}
