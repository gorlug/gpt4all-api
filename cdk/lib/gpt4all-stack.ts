import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DockerImageCode, DockerImageFunction } from 'aws-cdk-lib/aws-lambda';
import { Repository } from 'aws-cdk-lib/aws-ecr';

export interface Gpt4allStackProps extends cdk.StackProps {
  repositoryName: string;
}

export class Gpt4allStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: Gpt4allStackProps) {
    super(scope, id, props);

    const lambda = new DockerImageFunction(this, 'gpt4all-lambda', {
      code: DockerImageCode.fromEcr(
        Repository.fromRepositoryArn(
          this,
          'gpt4all-ecr',
          `arn:aws:ecr:eu-central-1:${props?.env?.account}:repository/gpt4all-api`,
        ),
        { tagOrDigest: 'latest' },
      ),
      timeout: cdk.Duration.seconds(15 * 60),
      memorySize: 10240,
    });

    new CfnOutput(this, 'gpt4all-lambda-name', {
      value: lambda.functionName,
    });
  }
}
