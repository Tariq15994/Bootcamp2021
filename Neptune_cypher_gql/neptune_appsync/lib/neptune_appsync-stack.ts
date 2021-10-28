import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as neptune from '@aws-cdk/aws-neptune';


export class NeptuneAppsyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "graphApi",{
      name: "crudapplication-api",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig:{
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    
    });

    const vpc = new ec2.Vpc(this,"crudapplication-vpc");

    const lambdalayer = new lambda.LayerVersion(this,"lambdalayer", {
      code: lambda.Code.fromAsset("lambda-layers"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X]
    });

    const userLambda = new lambda.Function(this,"crudapplicationLambda",{
      runtime: lambda.Runtime.NODEJS_14_X,
      code: new lambda.AssetCode("lambda/User"),
      handler: "index.handler",
      currentVersionOptions: {
        retryAttempts: 0
      },
      timeout: cdk.Duration.minutes(1),
      layers: [lambdalayer],
      vpc:vpc
    });

    const userLambda_datasource = api.addLambdaDataSource('userLambdaDataSource', userLambda);

    userLambda_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "createUser"
    });
    userLambda_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteUser"
    });
    userLambda_datasource.createResolver({
      typeName: "Query",
      fieldName: "allUsers"
    });
    userLambda_datasource.createResolver({
      typeName: "Query",
      fieldName: "getUser"
    });

    
    
    const cluster = new neptune.DatabaseCluster(this, 'crudapplication-database', {
      vpc: vpc,
      instanceType: neptune.InstanceType.R5_LARGE
    });
     //to control who can access the cluster
    //( any conection in this VPC can access NEPTUNE database cluster, so lambdafunction in VPC can use it )

    cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    //adding env to lambdafunction
    userLambda.addEnvironment('NEPTUNE_ENDPOINT', NEPTUNE_ENDPOINT);
    
  }
}
