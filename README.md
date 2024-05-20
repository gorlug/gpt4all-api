# GPT4All API Wrapper

## Description

This is a simple REST API wrapper around [GPT4All](https://gpt4all.io/)

It is built using the [Nest](https://github.com/nestjs/nest) framework for running locally or on your own server.

There is also an [AWS CDK](https://aws.amazon.com/de/cdk/) stack for AWS Lambda deployment of the API. It works, but it is rather slow even on the highest memory setting.

## Installation

```bash
$ pnpm install
```

## Standalone

### Preparing the environment

Download the latest [models.json](https://raw.githubusercontent.com/nomic-ai/gpt4all/main/gpt4all-chat/metadata/models.json) into the models folder. Then download one of the models in that JSON file also into the models folder. You can see better overview over the models on the [GPT4All](https://gpt4all.io/) website.

Create a `.env` file in the root folder and add the following content:

```
GPT4ALL_MODEL=FILE_NAME_OF_THE_MODEL
```

Where `FILE_NAME_OF_THE_MODEL` is the name of the model file you downloaded, e.g. `mistral-7b-openorca.gguf2.Q4_0.gguf`.

You can optionally set the number of CPU threads by adding

```
CPU_THREADS=8
```

### Running the REST API app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### Trying out the API

You can run the TypeScript file `cli/cli.ts` as an example.

## AWS Lambda

### Preparing the environment

For this deployment the model `mistral-7b-openorca.gguf2.Q4_0.gguf` will be used. It can be changed by editing the source code. Download this model into `cdk/docker/models`

### Setting up the Docker image

We will build an amd64 docker image.

Go into `cdk/docker` and run `./build.sh`

You now have an image with the name `gpt4all-api:latest`.

#### Running the image locally

It is possible to try out the AWS lambda image locally. Call the script `./run_image.sh` and afterward the script `./run_lambda.sh`.

### Pushing the image to AWS ECR

Set the URI of your ECR repository as the URI environment variable: `URI=ECR_REPOSITORY_URI`

First login into the ECR docker repository by calling `./login.sh`

Then tag the image with the URI of your repository by calling `./tag_image.sh`

Finally, push the image to the repository by calling `./push.sh`

### CDK deployment

Go to the `cdk` folder. If the name of your repository is not `gpt4all-api` then set it as an environment variable in you terminal:

`REPOSITORY_NAME=your-repository-name`

Install all packages by calling `pnpm install`.

Bootstrap the deployment: `pnpm cdk bootstrap`

Deploy the stack using `pnpm cdk deploy`

On the terminal you will see the output `Gpt4AllStack.gpt4alllambdaname` that shows you the function name. Go to that function in the AWS web console. This lambda is supposed to be run behind an API Gateway. This Gateway is not yet implemented in that CDK stack. Here is a test event to run the lambda:

```json
{
  "body": "{\"prompt\":\"What is 1 + 1?\",\"temperature\":0.5}"
}
```

## Stay in touch

* Author - [Achim Rohn](https://achim-rohn.de)

## License

This project is [MIT licensed](LICENSE).
