import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getDbConnection } from '../shared/db';

interface SearchRequest {
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  zipCode?: string;
}

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const body: SearchRequest = JSON.parse(event.body || '{}');

    if (!body.latitude && !body.address && !body.city && !body.zipCode) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Either latitude/longitude, address, city, or zipCode is required'
        }),
      };
    }

    const client = await getDbConnection();

    let query: string;
    let params: any[];

    // Search by coordinates
    if (body.latitude && body.longitude) {
      query = `
        SELECT
          tract_id,
          county_name,
          total_population,
          ces_score,
          ces_percentile,
          disadvantaged_community,
          ST_Y(ST_Centroid(geom)) as latitude,
          ST_X(ST_Centroid(geom)) as longitude
        FROM census_tracts
        WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326))
        LIMIT 1
      `;
      params = [body.longitude, body.latitude];
    }
    // Search by city
    else if (body.city) {
      query = `
        SELECT
          tract_id,
          county_name,
          total_population,
          ces_score,
          ces_percentile,
          disadvantaged_community,
          ST_Y(ST_Centroid(geom)) as latitude,
          ST_X(ST_Centroid(geom)) as longitude
        FROM census_tracts
        WHERE LOWER(county_name) LIKE LOWER($1) OR LOWER(tract_id) LIKE LOWER($1)
        ORDER BY ces_percentile DESC
        LIMIT 50
      `;
      params = [`%${body.city}%`];
    }
    // Search by ZIP code
    else if (body.zipCode) {
      query = `
        SELECT
          tract_id,
          county_name,
          total_population,
          ces_score,
          ces_percentile,
          disadvantaged_community,
          ST_Y(ST_Centroid(geom)) as latitude,
          ST_X(ST_Centroid(geom)) as longitude
        FROM census_tracts
        WHERE tract_id LIKE $1
        ORDER BY ces_percentile DESC
        LIMIT 10
      `;
      params = [`%${body.zipCode}%`];
    }
    // Search by address (requires geocoding - simplified version)
    else {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Address search requires geocoding service - use lat/lon instead'
        }),
      };
    }

    const result = await client.query(query, params);
    await client.end();

    // Transform snake_case to camelCase for frontend
    const tracts = result.rows.map(row => ({
      tractId: row.tract_id,
      countyName: row.county_name,
      totalPopulation: row.total_population,
      calEnviroScreenScore: row.ces_score,
      calEnviroScreenPercentile: row.ces_percentile,
      disadvantagedCommunity: row.disadvantaged_community,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        tracts,
        count: tracts.length,
      }),
    };
  } catch (error) {
    console.error('Error searching tracts:', error);
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
