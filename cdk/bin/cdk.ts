#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Gpt4allStack } from '../lib/gpt4all-stack';

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;
const repositoryName = process.env.REPOSITORY_NAME || 'gpt4all-api';

const app = new cdk.App();
new Gpt4allStack(app, 'Gpt4AllStack', {
  repositoryName,
  env: {
    region,
    account,
  },
});
