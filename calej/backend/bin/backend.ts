#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();

// Environment configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-west-2', // California region
};

// Database Stack - PostgreSQL + PostGIS
const databaseStack = new DatabaseStack(app, 'CalEJ-Database', {
  env,
  description: 'CalEJ Database Stack - PostgreSQL with PostGIS for spatial queries',
});

// API Stack - Lambda functions + API Gateway
const apiStack = new ApiStack(app, 'CalEJ-API', {
  env,
  description: 'CalEJ API Stack - Lambda functions and API Gateway',
  database: databaseStack.database,
  dbSecurityGroup: databaseStack.dbSecurityGroup,
  vpc: databaseStack.vpc,
});

// Add dependencies
apiStack.addDependency(databaseStack);

// Tags
cdk.Tags.of(app).add('Project', 'CalEJ');
cdk.Tags.of(app).add('Environment', 'Production');
cdk.Tags.of(app).add('ManagedBy', 'CDK');
