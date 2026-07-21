import { Client } from 'pg';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

let cachedSecret: any = null;

async function getDbCredentials() {
  if (cachedSecret) {
    return cachedSecret;
  }

  const secretArn = process.env.DB_SECRET_ARN;
  if (!secretArn) {
    throw new Error('DB_SECRET_ARN environment variable not set');
  }

  const client = new SecretsManagerClient({});
  const command = new GetSecretValueCommand({ SecretId: secretArn });
  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error('Secret value is empty');
  }

  cachedSecret = JSON.parse(response.SecretString);
  return cachedSecret;
}

export async function getDbConnection(): Promise<Client> {
  const credentials = await getDbCredentials();

  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'calej',
    user: credentials.username,
    password: credentials.password,
    ssl: {
      rejectUnauthorized: false, // RDS uses AWS certificates
    },
  });

  await client.connect();
  return client;
}
