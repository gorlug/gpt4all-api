import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  CreateCompletionRequest,
  Gpt4allServiceImpl,
  LoggerService,
} from '../gpt4all.service';

class LambdaLoggerService implements LoggerService {
  debug(message: any, ...optionalParams: any[]): any {
    console.log(message, optionalParams);
  }
}

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No body provided',
      }),
    };
  }
  const body = JSON.parse(event.body) as CreateCompletionRequest;
  const gpt4Service = new Gpt4allServiceImpl({
    pathToModels: '/opt/models',
    model: 'mistral-7b-openorca.gguf2.Q4_0.gguf',
    threads: 10,
    logger: new LambdaLoggerService(),
  });
  const result = await gpt4Service.createCompletion(body);
  if (result instanceof Error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: result.message,
      }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
export default handler;
