import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

interface ApiStackProps extends cdk.StackProps {
  database: rds.DatabaseInstance;
  dbSecurityGroup: ec2.SecurityGroup;
  vpc: ec2.IVpc;
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { database, dbSecurityGroup, vpc } = props;

    // Lambda Security Group
    const lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc,
      description: 'Security group for CalEJ Lambda functions',
      allowAllOutbound: true,
    });

    // Allow Lambda to access database
    dbSecurityGroup.addIngressRule(
      lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow Lambda functions to access database'
    );

    // Common Lambda environment variables
    const lambdaEnvironment = {
      DB_HOST: database.dbInstanceEndpointAddress,
      DB_PORT: database.dbInstanceEndpointPort,
      DB_NAME: 'calej',
      DB_SECRET_ARN: database.secret!.secretArn,
    };

    // Common Lambda configuration
    const lambdaProps: Partial<lambda.FunctionProps> = {
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: lambdaEnvironment,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [lambdaSecurityGroup],
    };

    // Lambda Functions (using NodejsFunction for automatic bundling)

    // 1. Get tract by ID
    const getTractFunction = new NodejsFunction(this, 'GetTractFunction', {
      ...lambdaProps,
      functionName: 'calej-get-tract',
      entry: path.join(__dirname, '../lambda/tracts/get.ts'),
      handler: 'handler',
      description: 'Get census tract details by ID',
      bundling: {
        externalModules: ['aws-sdk'],
        minify: true,
        sourceMap: true,
      },
    });

    // 2. Search tracts by location/address
    const searchTractsFunction = new NodejsFunction(this, 'SearchTractsFunction', {
      ...lambdaProps,
      functionName: 'calej-search-tracts',
      entry: path.join(__dirname, '../lambda/search/search.ts'),
      handler: 'handler',
      description: 'Search census tracts by address or coordinates',
      bundling: {
        externalModules: ['aws-sdk'],
        minify: true,
        sourceMap: true,
      },
    });

    // 3. Get facilities near tract
    const getFacilitiesFunction = new NodejsFunction(this, 'GetFacilitiesFunction', {
      ...lambdaProps,
      functionName: 'calej-get-facilities',
      entry: path.join(__dirname, '../lambda/facilities/get.ts'),
      handler: 'handler',
      description: 'Get Superfund/TRI facilities near a location',
      bundling: {
        externalModules: ['aws-sdk'],
        minify: true,
        sourceMap: true,
      },
    });

    // Grant database secret read permissions
    [getTractFunction, searchTractsFunction, getFacilitiesFunction].forEach((fn) => {
      database.secret!.grantRead(fn);
    });

    // API Gateway REST API
    this.api = new apigateway.RestApi(this, 'CalEJApi', {
      restApiName: 'CalEJ API',
      description: 'California Environmental Justice Mapper API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // Configure for production domain
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
        ],
      },
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 1000,
        throttlingBurstLimit: 2000,
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
    });

    // API Resources and Methods

    // /tracts
    const tractsResource = this.api.root.addResource('tracts');

    // GET /tracts/{tractId}
    const tractIdResource = tractsResource.addResource('{tractId}');
    tractIdResource.addMethod('GET', new apigateway.LambdaIntegration(getTractFunction));

    // /search
    const searchResource = this.api.root.addResource('search');

    // POST /search
    searchResource.addMethod('POST', new apigateway.LambdaIntegration(searchTractsFunction));

    // /facilities
    const facilitiesResource = this.api.root.addResource('facilities');

    // GET /facilities?lat=...&lon=...&radius=...
    facilitiesResource.addMethod('GET', new apigateway.LambdaIntegration(getFacilitiesFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'CalEJ API Gateway URL',
      exportName: 'CalEJ-ApiUrl',
    });

    new cdk.CfnOutput(this, 'ApiId', {
      value: this.api.restApiId,
      description: 'CalEJ API Gateway ID',
      exportName: 'CalEJ-ApiId',
    });
  }
}
