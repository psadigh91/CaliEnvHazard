import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getDbConnection } from '../shared/db';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const { lat, lon, radius = '5' } = event.queryStringParameters || {};

  if (!lat || !lon) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Latitude and longitude are required' }),
    };
  }

  try {
    const client = await getDbConnection();
    const radiusMiles = parseFloat(radius);

    // Query for Superfund sites within radius
    const superfundQuery = `
      SELECT
        site_id,
        site_name,
        address,
        city,
        county,
        npl_status,
        latitude,
        longitude,
        'superfund' as facility_type,
        ST_Distance(
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        ) / 1609.34 as distance_miles
      FROM superfund_sites
      WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
        $3 * 1609.34
      )
      ORDER BY distance_miles
      LIMIT 20
    `;

    // Query for TRI facilities within radius
    const triQuery = `
      SELECT
        facility_id,
        facility_name,
        address,
        city,
        county,
        industry_sector,
        latitude,
        longitude,
        total_releases,
        'tri' as facility_type,
        ST_Distance(
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        ) / 1609.34 as distance_miles
      FROM tri_facilities
      WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
        $3 * 1609.34
      )
      ORDER BY distance_miles
      LIMIT 20
    `;

    const [superfundResult, triResult] = await Promise.all([
      client.query(superfundQuery, [parseFloat(lat), parseFloat(lon), radiusMiles]),
      client.query(triQuery, [parseFloat(lat), parseFloat(lon), radiusMiles]),
    ]);

    await client.end();

    // Transform snake_case to camelCase for frontend
    const superfundSites = superfundResult.rows.map(row => ({
      siteId: row.site_id,
      siteName: row.site_name,
      address: row.address,
      city: row.city,
      county: row.county,
      nplStatus: row.npl_status,
      latitude: row.latitude,
      longitude: row.longitude,
      facilityType: row.facility_type,
      distanceMiles: parseFloat(row.distance_miles),
    }));

    const triFacilities = triResult.rows.map(row => ({
      facilityId: row.facility_id,
      facilityName: row.facility_name,
      address: row.address,
      city: row.city,
      county: row.county,
      industrySector: row.industry_sector,
      latitude: row.latitude,
      longitude: row.longitude,
      totalReleases: row.total_releases,
      facilityType: row.facility_type,
      distanceMiles: parseFloat(row.distance_miles),
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        superfundSites,
        triFacilities,
        searchRadius: radiusMiles,
        center: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
      }),
    };
  } catch (error) {
    console.error('Error fetching facilities:', error);
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
