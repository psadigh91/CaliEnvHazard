import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getDbConnection } from '../shared/db';

interface TractData {
  tractId: string;
  countyName: string;
  totalPopulation: number;
  calEnviroScreenScore: number;
  calEnviroScreenPercentile: number;
  pollutionBurden: number;
  populationCharacteristics: number;
  disadvantagedCommunity: boolean;
  // Environmental indicators
  ozone: number;
  pm25: number;
  dieselPm: number;
  drinkingWater: number;
  pesticides: number;
  toxicReleases: number;
  traffic: number;
  // Population indicators
  asthma: number;
  lowBirthWeight: number;
  cardiovascular: number;
  education: number;
  housingBurden: number;
  linguisticIsolation: number;
  poverty: number;
  unemployment: number;
  // Geometry
  latitude: number;
  longitude: number;
}

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const tractId = event.pathParameters?.tractId;

  if (!tractId) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Tract ID is required' }),
    };
  }

  try {
    const client = await getDbConnection();

    // Query tract data
    const query = `
      SELECT
        tract_id,
        county_name,
        total_population,
        ces_score,
        ces_percentile,
        pollution_burden,
        population_characteristics,
        disadvantaged_community,
        ozone,
        pm25,
        diesel_pm,
        drinking_water,
        pesticides,
        toxic_releases,
        traffic,
        asthma,
        low_birth_weight,
        cardiovascular,
        education,
        housing_burden,
        linguistic_isolation,
        poverty,
        unemployment,
        ST_Y(ST_Centroid(geom)) as latitude,
        ST_X(ST_Centroid(geom)) as longitude,
        ST_AsGeoJSON(geom) as geometry
      FROM census_tracts
      WHERE tract_id = $1
    `;

    const result = await client.query(query, [tractId]);

    await client.end();

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Tract not found' }),
      };
    }

    const tract = result.rows[0];

    const response: TractData = {
      tractId: tract.tract_id,
      countyName: tract.county_name,
      totalPopulation: tract.total_population,
      calEnviroScreenScore: tract.ces_score,
      calEnviroScreenPercentile: tract.ces_percentile,
      pollutionBurden: tract.pollution_burden,
      populationCharacteristics: tract.population_characteristics,
      disadvantagedCommunity: tract.disadvantaged_community,
      ozone: tract.ozone,
      pm25: tract.pm25,
      dieselPm: tract.diesel_pm,
      drinkingWater: tract.drinking_water,
      pesticides: tract.pesticides,
      toxicReleases: tract.toxic_releases,
      traffic: tract.traffic,
      asthma: tract.asthma,
      lowBirthWeight: tract.low_birth_weight,
      cardiovascular: tract.cardiovascular,
      education: tract.education,
      housingBurden: tract.housing_burden,
      linguisticIsolation: tract.linguistic_isolation,
      poverty: tract.poverty,
      unemployment: tract.unemployment,
      latitude: parseFloat(tract.latitude),
      longitude: parseFloat(tract.longitude),
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        tract: response,
        geometry: JSON.parse(tract.geometry),
      }),
    };
  } catch (error) {
    console.error('Error fetching tract:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
