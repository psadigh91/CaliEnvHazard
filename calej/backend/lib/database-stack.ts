import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class DatabaseStack extends cdk.Stack {
  public readonly database: rds.DatabaseInstance;
  public readonly dbSecurityGroup: ec2.SecurityGroup;
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC - use default or create new
    this.vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true,
    });

    // Security Group for Database
    this.dbSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for CalEJ PostgreSQL database',
      allowAllOutbound: true,
    });

    // Allow PostgreSQL access from Lambda functions (will be added by API stack)
    this.dbSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
      'Allow PostgreSQL access from within VPC'
    );

    // Database credentials (stored in Secrets Manager)
    const dbCredentials = new secretsmanager.Secret(this, 'DatabaseCredentials', {
      secretName: 'calej-db-credentials',
      description: 'CalEJ database credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: 'calejadmin',
        }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
        passwordLength: 32,
      },
    });

    // PostgreSQL Database Instance with PostGIS
    this.database = new rds.DatabaseInstance(this, 'CalEJDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_3,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO // Start small, can scale up
      ),
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [this.dbSecurityGroup],
      credentials: rds.Credentials.fromSecret(dbCredentials),
      databaseName: 'calej',
      allocatedStorage: 20,
      maxAllocatedStorage: 100, // Auto-scaling storage
      storageEncrypted: true,
      multiAz: false, // Single AZ for cost savings in MVP
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false, // Set to true in production
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT, // Take snapshot on deletion
      publiclyAccessible: false,
      enablePerformanceInsights: true,
      performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT,
    });

    // Enable PostGIS extension (done via initialization script or manually)
    // Add initialization SQL to enable PostGIS
    const initSql = `
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE EXTENSION IF NOT EXISTS postgis_topology;
      CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
      CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
    `;

    // Output database connection details
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.database.dbInstanceEndpointAddress,
      description: 'PostgreSQL database endpoint',
      exportName: 'CalEJ-DatabaseEndpoint',
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: this.database.dbInstanceEndpointPort,
      description: 'PostgreSQL database port',
      exportName: 'CalEJ-DatabasePort',
    });

    new cdk.CfnOutput(this, 'DatabaseName', {
      value: 'calej',
      description: 'PostgreSQL database name',
      exportName: 'CalEJ-DatabaseName',
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: dbCredentials.secretArn,
      description: 'Database credentials secret ARN',
      exportName: 'CalEJ-DatabaseSecretArn',
    });

    // Add note about PostGIS setup
    new cdk.CfnOutput(this, 'PostGISSetupNote', {
      value: 'Run: psql -h <endpoint> -U calejadmin -d calej -c "CREATE EXTENSION postgis;"',
      description: 'Command to enable PostGIS extension',
    });
  }
}
