import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'calej',
  user: process.env.DB_USER || 'calejadmin',
  password: process.env.DB_PASSWORD || 'changeme',
};

async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(destination, Buffer.from(buffer));
  console.log(`Downloaded: ${destination}`);
}

async function setupDatabase(client: Client): Promise<void> {
  console.log('Setting up database schema...');

  // Enable PostGIS
  await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  await client.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');

  // Create census_tracts table
  await client.query(`
    CREATE TABLE IF NOT EXISTS census_tracts (
      id SERIAL PRIMARY KEY,
      tract_id VARCHAR(20) UNIQUE NOT NULL,
      county_name VARCHAR(100),
      total_population INTEGER,
      ces_score NUMERIC(10, 2),
      ces_percentile NUMERIC(5, 2),
      pollution_burden NUMERIC(10, 2),
      population_characteristics NUMERIC(10, 2),
      disadvantaged_community BOOLEAN,
      -- Environmental indicators
      ozone NUMERIC(10, 4),
      pm25 NUMERIC(10, 4),
      diesel_pm NUMERIC(10, 4),
      drinking_water NUMERIC(10, 4),
      pesticides NUMERIC(10, 4),
      toxic_releases NUMERIC(10, 4),
      traffic NUMERIC(10, 4),
      -- Population indicators
      asthma NUMERIC(10, 4),
      low_birth_weight NUMERIC(10, 4),
      cardiovascular NUMERIC(10, 4),
      education NUMERIC(10, 4),
      housing_burden NUMERIC(10, 4),
      linguistic_isolation NUMERIC(10, 4),
      poverty NUMERIC(10, 4),
      unemployment NUMERIC(10, 4),
      -- Geometry
      geom GEOMETRY(MULTIPOLYGON, 4326),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create superfund_sites table
  await client.query(`
    CREATE TABLE IF NOT EXISTS superfund_sites (
      id SERIAL PRIMARY KEY,
      site_id VARCHAR(50) UNIQUE NOT NULL,
      site_name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      city VARCHAR(100),
      county VARCHAR(100),
      zip_code VARCHAR(10),
      npl_status VARCHAR(50),
      latitude NUMERIC(10, 6),
      longitude NUMERIC(11, 6),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create tri_facilities table
  await client.query(`
    CREATE TABLE IF NOT EXISTS tri_facilities (
      id SERIAL PRIMARY KEY,
      facility_id VARCHAR(50) UNIQUE NOT NULL,
      facility_name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      city VARCHAR(100),
      county VARCHAR(100),
      zip_code VARCHAR(10),
      industry_sector VARCHAR(100),
      latitude NUMERIC(10, 6),
      longitude NUMERIC(11, 6),
      total_releases NUMERIC(15, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create spatial indexes
  await client.query('CREATE INDEX IF NOT EXISTS idx_census_tracts_geom ON census_tracts USING GIST(geom);');
  await client.query('CREATE INDEX IF NOT EXISTS idx_census_tracts_ces_percentile ON census_tracts(ces_percentile);');
  await client.query('CREATE INDEX IF NOT EXISTS idx_superfund_latlon ON superfund_sites(latitude, longitude);');
  await client.query('CREATE INDEX IF NOT EXISTS idx_tri_latlon ON tri_facilities(latitude, longitude);');

  console.log('Database schema created successfully.');
}

async function seedCalEnviroScreen(client: Client, csvPath: string): Promise<void> {
  console.log('Seeding CalEnviroScreen data...');

  if (!fs.existsSync(csvPath)) {
    console.error(`CalEnviroScreen CSV not found at: ${csvPath}`);
    console.log('Please download CalEnviroScreen 4.0 data from:');
    console.log('https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40');
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Processing ${records.length} census tracts...`);

  let inserted = 0;
  for (const record of records) {
    try {
      await client.query(`
        INSERT INTO census_tracts (
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
          unemployment
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        ON CONFLICT (tract_id) DO NOTHING
      `, [
        record['Census Tract'] || record['Tract'],
        record['California County'],
        parseInt(record['Total Population'] || '0'),
        parseFloat(record['CES 4.0 Score'] || '0'),
        parseFloat(record['CES 4.0 Percentile'] || '0'),
        parseFloat(record['Pollution Burden'] || '0'),
        parseFloat(record['Population Characteristics'] || '0'),
        (parseFloat(record['CES 4.0 Percentile'] || '0') >= 75),
        parseFloat(record['Ozone'] || '0'),
        parseFloat(record['PM2.5'] || '0'),
        parseFloat(record['Diesel PM'] || '0'),
        parseFloat(record['Drinking Water'] || '0'),
        parseFloat(record['Pesticides'] || '0'),
        parseFloat(record['Toxic Releases'] || '0'),
        parseFloat(record['Traffic'] || '0'),
        parseFloat(record['Asthma'] || '0'),
        parseFloat(record['Low Birth Weight'] || '0'),
        parseFloat(record['Cardiovascular Disease'] || '0'),
        parseFloat(record['Education'] || '0'),
        parseFloat(record['Housing Burden'] || '0'),
        parseFloat(record['Linguistic Isolation'] || '0'),
        parseFloat(record['Poverty'] || '0'),
        parseFloat(record['Unemployment'] || '0'),
      ]);
      inserted++;
    } catch (err) {
      console.error(`Error inserting tract ${record['Census Tract']}:`, err);
    }
  }

  console.log(`Inserted ${inserted} census tracts.`);
}

async function seedSuperfundSites(client: Client): Promise<void> {
  console.log('Seeding EPA Superfund sites...');

  // Sample Superfund sites in California (from EPA CERCLIS)
  const sampleSites = [
    {
      site_id: 'CAD009018612',
      site_name: 'Operating Industries Inc.',
      address: '5900 S Bixby Road',
      city: 'Monterey Park',
      county: 'Los Angeles',
      zip_code: '91754',
      npl_status: 'Final NPL',
      latitude: 34.0400,
      longitude: -118.1100,
    },
    {
      site_id: 'CA2890012584',
      site_name: 'San Gabriel Valley Area 2',
      address: 'Baldwin Park',
      city: 'Baldwin Park',
      county: 'Los Angeles',
      zip_code: '91706',
      npl_status: 'Final NPL',
      latitude: 34.0853,
      longitude: -117.9609,
    },
    // Add more sites as needed
  ];

  for (const site of sampleSites) {
    try {
      await client.query(`
        INSERT INTO superfund_sites (
          site_id, site_name, address, city, county, zip_code, npl_status, latitude, longitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (site_id) DO NOTHING
      `, [
        site.site_id, site.site_name, site.address, site.city, site.county,
        site.zip_code, site.npl_status, site.latitude, site.longitude,
      ]);
    } catch (err) {
      console.error(`Error inserting Superfund site ${site.site_id}:`, err);
    }
  }

  console.log(`Seeded ${sampleSites.length} Superfund sites.`);
}

async function seedTRIFacilities(client: Client): Promise<void> {
  console.log('Seeding EPA TRI facilities...');

  // Sample TRI facilities in California
  const sampleFacilities = [
    {
      facility_id: 'TRI00001',
      facility_name: 'Sample Chemical Plant',
      address: '123 Industrial Way',
      city: 'Los Angeles',
      county: 'Los Angeles',
      zip_code: '90001',
      industry_sector: 'Chemical Manufacturing',
      latitude: 34.0522,
      longitude: -118.2437,
      total_releases: 125000.50,
    },
    // Add more facilities as needed
  ];

  for (const facility of sampleFacilities) {
    try {
      await client.query(`
        INSERT INTO tri_facilities (
          facility_id, facility_name, address, city, county, zip_code,
          industry_sector, latitude, longitude, total_releases
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (facility_id) DO NOTHING
      `, [
        facility.facility_id, facility.facility_name, facility.address, facility.city,
        facility.county, facility.zip_code, facility.industry_sector,
        facility.latitude, facility.longitude, facility.total_releases,
      ]);
    } catch (err) {
      console.error(`Error inserting TRI facility ${facility.facility_id}:`, err);
    }
  }

  console.log(`Seeded ${sampleFacilities.length} TRI facilities.`);
}

async function main() {
  console.log('CalEJ Data Seeding Script');
  console.log('=========================\n');

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log('Connected to database.\n');

    // Setup database schema
    await setupDatabase(client);

    // Seed CalEnviroScreen data
    const csvPath = path.join(__dirname, '../data/calenviroscreen-4.0.csv');
    await seedCalEnviroScreen(client, csvPath);

    // Seed Superfund sites
    await seedSuperfundSites(client);

    // Seed TRI facilities
    await seedTRIFacilities(client);

    console.log('\n✅ Data seeding completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Download census tract boundaries (GeoJSON) from Census Bureau');
    console.log('2. Use PostGIS commands to import geometry data');
    console.log('3. Fetch full Superfund and TRI data from EPA APIs');
    console.log('4. Deploy the API stack with: npm run deploy');

  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
