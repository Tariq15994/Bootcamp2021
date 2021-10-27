"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeptuneCypherGqlStack = void 0;
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");
const neptune = require("@aws-cdk/aws-neptune");
class NeptuneCypherGqlStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, "Vpc", {
            subnetConfiguration: [
                {
                    cidrMask: 23,
                    name: "Ingress",
                    subnetType: ec2.SubnetType.ISOLATED
                },
            ]
        });
        const sg1 = new ec2.SecurityGroup(this, "mySecurityGroup1", {
            vpc,
            allowAllOutbound: true,
            description: "security group 1",
            securityGroupName: "mySecurityGroup"
        });
        cdk.Tags.of(sg1).add("Name", "mySecurityGroup");
        sg1.addIngressRule(sg1, ec2.Port.tcp(8182), "MyRule");
        // const neptuneSubnet = new neptune.CfnDBSubnetGroup(this,"neptuneSubnetGroup",{
        //   dbSubnetGroupDescription: "My Subnet",
        //   subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.ISOLATED})
        //     .subnetIds,
        //   dbSubnetGroupName: "mySubnetGroup"
        // });
        // const neptuneCluster = new neptune.CfnDBCluster(this, "MyCluster",{
        //   dbSubnetGroupName: neptuneSubnet.dbSubnetGroupName,
        //   dbClusterIdentifier: "myDbCluster",
        //   vpcSecurityGroupIds: [sg1.securityGroupId],
        // })
        // neptuneCluster.addDependsOn(neptuneSubnet);
        // const neptuneInstance = new neptune.CfnDBInstance(this,"myinstance",{
        //   dbInstanceClass : "db.t3.medium",
        //   dbClusterIdentifier: neptuneCluster.dbClusterIdentifier,
        //   availabilityZone: vpc.availabilityZones[0],
        // });
        // neptuneInstance.addDependsOn(neptuneCluster);
        // const handler = new lambda.Function(this,"Lambda",{
        //   runtime: lambda.Runtime.NODEJS_14_X,
        //   code: new lambda.AssetCode("lambdas/lambda1"),
        //   handler: "index.handler",
        //   vpc: vpc,
        //   securityGroups: [sg1],
        //   environment: {
        //     NEPTUNE_ENDPOINT: neptuneCluster.attrEndpoint
        //   },
        //   vpcSubnets:{
        //     subnetType: ec2.SubnetType.ISOLATED,
        //   }
        // });
        const neptuneSubnet = new neptune.CfnDBSubnetGroup(this, "neptuneSubnetGroup", {
            dbSubnetGroupDescription: "My Subnet",
            subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.ISOLATED })
                .subnetIds,
            dbSubnetGroupName: "mysubnetgroup",
        });
        // Creating neptune cluster
        const neptuneCluster = new neptune.CfnDBCluster(this, "MyCluster", {
            dbSubnetGroupName: neptuneSubnet.dbSubnetGroupName,
            dbClusterIdentifier: "myDbCluster",
            vpcSecurityGroupIds: [sg1.securityGroupId],
        });
        neptuneCluster.addDependsOn(neptuneSubnet);
        // Creating neptune instance
        const neptuneInstance = new neptune.CfnDBInstance(this, "myinstance", {
            dbInstanceClass: "db.t3.medium",
            dbClusterIdentifier: neptuneCluster.dbClusterIdentifier,
            availabilityZone: vpc.availabilityZones[0],
        });
        neptuneInstance.addDependsOn(neptuneCluster);
        // add this code after the VPC code
        const handler = new lambda.Function(this, "Lambda", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: new lambda.AssetCode("lambdas/lambda1"),
            handler: "index.handler",
            vpc: vpc,
            securityGroups: [sg1],
            environment: {
                NEPTUNE_ENDPOINT: neptuneCluster.attrEndpoint
            },
            vpcSubnets: {
                subnetType: ec2.SubnetType.ISOLATED
            }
        });
        new cdk.CfnOutput(this, "Neptune Endpoint", {
            value: neptuneCluster.attrEndpoint
        });
        const apigateway = new apigw.LambdaRestApi(this, "api", {
            handler: handler
        });
    }
}
exports.NeptuneCypherGqlStack = NeptuneCypherGqlStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVwdHVuZV9jeXBoZXJfZ3FsLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmVwdHVuZV9jeXBoZXJfZ3FsLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLGlEQUFpRDtBQUNqRCxnREFBZ0Q7QUFFaEQsTUFBYSxxQkFBc0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNsRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBR3hCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFDO1lBQ2xDLG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxRQUFRLEVBQUUsRUFBRTtvQkFDWixJQUFJLEVBQUUsU0FBUztvQkFDZixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRO2lCQUNwQzthQUVGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBQztZQUN6RCxHQUFHO1lBQ0gsZ0JBQWdCLEVBQUMsSUFBSTtZQUNyQixXQUFXLEVBQUUsa0JBQWtCO1lBQy9CLGlCQUFpQixFQUFFLGlCQUFpQjtTQUVyQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0MsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEQsaUZBQWlGO1FBQ2pGLDJDQUEyQztRQUMzQyx5RUFBeUU7UUFDekUsa0JBQWtCO1FBRWxCLHVDQUF1QztRQUN2QyxNQUFNO1FBRU4sc0VBQXNFO1FBQ3RFLHdEQUF3RDtRQUN4RCx3Q0FBd0M7UUFDeEMsZ0RBQWdEO1FBQ2hELEtBQUs7UUFFTCw4Q0FBOEM7UUFFOUMsd0VBQXdFO1FBQ3hFLHNDQUFzQztRQUN0Qyw2REFBNkQ7UUFDN0QsZ0RBQWdEO1FBRWhELE1BQU07UUFFTixnREFBZ0Q7UUFFaEQsc0RBQXNEO1FBQ3RELHlDQUF5QztRQUN6QyxtREFBbUQ7UUFDbkQsOEJBQThCO1FBQzlCLGNBQWM7UUFDZCwyQkFBMkI7UUFDM0IsbUJBQW1CO1FBQ25CLG9EQUFvRDtRQUNwRCxPQUFPO1FBQ1AsaUJBQWlCO1FBQ2pCLDJDQUEyQztRQUMzQyxNQUFNO1FBQ04sTUFBTTtRQUVOLE1BQU0sYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUNoRCxJQUFJLEVBQ0osb0JBQW9CLEVBQ3BCO1lBQ0Usd0JBQXdCLEVBQUUsV0FBVztZQUNyQyxTQUFTLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUNsRSxTQUFTO1lBQ1osaUJBQWlCLEVBQUUsZUFBZTtTQUNuQyxDQUNGLENBQUM7UUFFRiwyQkFBMkI7UUFDM0IsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDakUsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLGlCQUFpQjtZQUNsRCxtQkFBbUIsRUFBRSxhQUFhO1lBQ2xDLG1CQUFtQixFQUFFLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztTQUMzQyxDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRzNDLDRCQUE0QjtRQUM1QixNQUFNLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNwRSxlQUFlLEVBQUUsY0FBYztZQUMvQixtQkFBbUIsRUFBRSxjQUFjLENBQUMsbUJBQW1CO1lBQ3ZELGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7U0FDM0MsQ0FBQyxDQUFDO1FBQ0gsZUFBZSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU3QyxtQ0FBbUM7UUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDbEQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1lBQzdDLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLEdBQUcsRUFBRSxHQUFHO1lBQ1IsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ3JCLFdBQVcsRUFBRTtnQkFDWCxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsWUFBWTthQUM5QztZQUNELFVBQVUsRUFDUjtnQkFDRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRO2FBQ3BDO1NBQ0osQ0FBQyxDQUFDO1FBR0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUMxQyxLQUFLLEVBQUUsY0FBYyxDQUFDLFlBQVk7U0FDbkMsQ0FDQSxDQUFBO1FBR0EsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDdEQsT0FBTyxFQUFFLE9BQU87U0FDakIsQ0FBQyxDQUFDO0lBRU4sQ0FBQztDQUNGO0FBMUhELHNEQTBIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGFwaWd3IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCAqIGFzIG5lcHR1bmUgZnJvbSBcIkBhd3MtY2RrL2F3cy1uZXB0dW5lXCI7XG5cbmV4cG9ydCBjbGFzcyBOZXB0dW5lQ3lwaGVyR3FsU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgXCJWcGNcIix7XG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjaWRyTWFzazogMjMsXG4gICAgICAgICAgbmFtZTogXCJJbmdyZXNzXCIsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURURcbiAgICAgICAgfSxcblxuICAgICAgXVxuICAgIH0pO1xuICAgICAgIFxuICAgIGNvbnN0IHNnMSA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCBcIm15U2VjdXJpdHlHcm91cDFcIix7XG4gICAgICB2cGMsXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOnRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogXCJzZWN1cml0eSBncm91cCAxXCIsXG4gICAgICBzZWN1cml0eUdyb3VwTmFtZTogXCJteVNlY3VyaXR5R3JvdXBcIlxuICAgICAgXG4gICAgfSk7XG5cbiAgICBjZGsuVGFncy5vZihzZzEpLmFkZChcIk5hbWVcIixcIm15U2VjdXJpdHlHcm91cFwiKTtcbiAgICBzZzEuYWRkSW5ncmVzc1J1bGUoc2cxLGVjMi5Qb3J0LnRjcCg4MTgyKSxcIk15UnVsZVwiKTtcblxuICAgIC8vIGNvbnN0IG5lcHR1bmVTdWJuZXQgPSBuZXcgbmVwdHVuZS5DZm5EQlN1Ym5ldEdyb3VwKHRoaXMsXCJuZXB0dW5lU3VibmV0R3JvdXBcIix7XG4gICAgLy8gICBkYlN1Ym5ldEdyb3VwRGVzY3JpcHRpb246IFwiTXkgU3VibmV0XCIsXG4gICAgLy8gICBzdWJuZXRJZHM6IHZwYy5zZWxlY3RTdWJuZXRzKHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUR9KVxuICAgIC8vICAgICAuc3VibmV0SWRzLFxuICAgICAgXG4gICAgLy8gICBkYlN1Ym5ldEdyb3VwTmFtZTogXCJteVN1Ym5ldEdyb3VwXCJcbiAgICAvLyB9KTtcblxuICAgIC8vIGNvbnN0IG5lcHR1bmVDbHVzdGVyID0gbmV3IG5lcHR1bmUuQ2ZuREJDbHVzdGVyKHRoaXMsIFwiTXlDbHVzdGVyXCIse1xuICAgIC8vICAgZGJTdWJuZXRHcm91cE5hbWU6IG5lcHR1bmVTdWJuZXQuZGJTdWJuZXRHcm91cE5hbWUsXG4gICAgLy8gICBkYkNsdXN0ZXJJZGVudGlmaWVyOiBcIm15RGJDbHVzdGVyXCIsXG4gICAgLy8gICB2cGNTZWN1cml0eUdyb3VwSWRzOiBbc2cxLnNlY3VyaXR5R3JvdXBJZF0sXG4gICAgLy8gfSlcblxuICAgIC8vIG5lcHR1bmVDbHVzdGVyLmFkZERlcGVuZHNPbihuZXB0dW5lU3VibmV0KTtcblxuICAgIC8vIGNvbnN0IG5lcHR1bmVJbnN0YW5jZSA9IG5ldyBuZXB0dW5lLkNmbkRCSW5zdGFuY2UodGhpcyxcIm15aW5zdGFuY2VcIix7XG4gICAgLy8gICBkYkluc3RhbmNlQ2xhc3MgOiBcImRiLnQzLm1lZGl1bVwiLFxuICAgIC8vICAgZGJDbHVzdGVySWRlbnRpZmllcjogbmVwdHVuZUNsdXN0ZXIuZGJDbHVzdGVySWRlbnRpZmllcixcbiAgICAvLyAgIGF2YWlsYWJpbGl0eVpvbmU6IHZwYy5hdmFpbGFiaWxpdHlab25lc1swXSxcbiAgICAgIFxuICAgIC8vIH0pO1xuXG4gICAgLy8gbmVwdHVuZUluc3RhbmNlLmFkZERlcGVuZHNPbihuZXB0dW5lQ2x1c3Rlcik7XG5cbiAgICAvLyBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLFwiTGFtYmRhXCIse1xuICAgIC8vICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgLy8gICBjb2RlOiBuZXcgbGFtYmRhLkFzc2V0Q29kZShcImxhbWJkYXMvbGFtYmRhMVwiKSxcbiAgICAvLyAgIGhhbmRsZXI6IFwiaW5kZXguaGFuZGxlclwiLFxuICAgIC8vICAgdnBjOiB2cGMsXG4gICAgLy8gICBzZWN1cml0eUdyb3VwczogW3NnMV0sXG4gICAgLy8gICBlbnZpcm9ubWVudDoge1xuICAgIC8vICAgICBORVBUVU5FX0VORFBPSU5UOiBuZXB0dW5lQ2x1c3Rlci5hdHRyRW5kcG9pbnRcbiAgICAvLyAgIH0sXG4gICAgLy8gICB2cGNTdWJuZXRzOntcbiAgICAvLyAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQsXG4gICAgLy8gICB9XG4gICAgLy8gfSk7XG5cbiAgICBjb25zdCBuZXB0dW5lU3VibmV0ID0gbmV3IG5lcHR1bmUuQ2ZuREJTdWJuZXRHcm91cChcbiAgICAgIHRoaXMsXG4gICAgICBcIm5lcHR1bmVTdWJuZXRHcm91cFwiLFxuICAgICAge1xuICAgICAgICBkYlN1Ym5ldEdyb3VwRGVzY3JpcHRpb246IFwiTXkgU3VibmV0XCIsXG4gICAgICAgIHN1Ym5ldElkczogdnBjLnNlbGVjdFN1Ym5ldHMoeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9KVxuICAgICAgICAgIC5zdWJuZXRJZHMsXG4gICAgICAgIGRiU3VibmV0R3JvdXBOYW1lOiBcIm15c3VibmV0Z3JvdXBcIixcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gQ3JlYXRpbmcgbmVwdHVuZSBjbHVzdGVyXG4gICAgY29uc3QgbmVwdHVuZUNsdXN0ZXIgPSBuZXcgbmVwdHVuZS5DZm5EQkNsdXN0ZXIodGhpcywgXCJNeUNsdXN0ZXJcIiwge1xuICAgICAgZGJTdWJuZXRHcm91cE5hbWU6IG5lcHR1bmVTdWJuZXQuZGJTdWJuZXRHcm91cE5hbWUsXG4gICAgICBkYkNsdXN0ZXJJZGVudGlmaWVyOiBcIm15RGJDbHVzdGVyXCIsXG4gICAgICB2cGNTZWN1cml0eUdyb3VwSWRzOiBbc2cxLnNlY3VyaXR5R3JvdXBJZF0sXG4gICAgfSk7XG4gICAgbmVwdHVuZUNsdXN0ZXIuYWRkRGVwZW5kc09uKG5lcHR1bmVTdWJuZXQpO1xuXG5cbiAgICAvLyBDcmVhdGluZyBuZXB0dW5lIGluc3RhbmNlXG4gICAgY29uc3QgbmVwdHVuZUluc3RhbmNlID0gbmV3IG5lcHR1bmUuQ2ZuREJJbnN0YW5jZSh0aGlzLCBcIm15aW5zdGFuY2VcIiwge1xuICAgICAgZGJJbnN0YW5jZUNsYXNzOiBcImRiLnQzLm1lZGl1bVwiLFxuICAgICAgZGJDbHVzdGVySWRlbnRpZmllcjogbmVwdHVuZUNsdXN0ZXIuZGJDbHVzdGVySWRlbnRpZmllcixcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6IHZwYy5hdmFpbGFiaWxpdHlab25lc1swXSxcbiAgICB9KTtcbiAgICBuZXB0dW5lSW5zdGFuY2UuYWRkRGVwZW5kc09uKG5lcHR1bmVDbHVzdGVyKTtcblxuICAgIC8vIGFkZCB0aGlzIGNvZGUgYWZ0ZXIgdGhlIFZQQyBjb2RlXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJMYW1iZGFcIiwgeyBcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMF9YLFxuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoXCJsYW1iZGFzL2xhbWJkYTFcIiksXG4gICAgICBoYW5kbGVyOiBcImluZGV4LmhhbmRsZXJcIixcbiAgICAgIHZwYzogdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZzFdLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgTkVQVFVORV9FTkRQT0lOVDogbmVwdHVuZUNsdXN0ZXIuYXR0ckVuZHBvaW50XG4gICAgICB9LFxuICAgICAgdnBjU3VibmV0czpcbiAgICAgICAge1xuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJOZXB0dW5lIEVuZHBvaW50XCIsIHtcbiAgICAgIHZhbHVlOiBuZXB0dW5lQ2x1c3Rlci5hdHRyRW5kcG9pbnRcbiAgICB9XG4gICAgKVxuIFxuIFxuICAgICBjb25zdCBhcGlnYXRld2F5ID0gbmV3IGFwaWd3LkxhbWJkYVJlc3RBcGkodGhpcywgXCJhcGlcIiwge1xuICAgICAgIGhhbmRsZXI6IGhhbmRsZXJcbiAgICAgfSk7XG5cbiAgfVxufVxuIl19