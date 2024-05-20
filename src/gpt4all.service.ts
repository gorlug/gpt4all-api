import { createCompletion, InferenceModel, loadModel } from 'gpt4all';

export interface CreateCompletionRequest {
  prompt: string;
  temperature?: number;
}

export interface CompletionResponse {
  choices: string[];
}

export interface LoggerService {
  debug(message: any, ...optionalParams: any[]): any;
}

export abstract class Gpt4AllService {
  abstract createCompletion(
    request: CreateCompletionRequest,
  ): Promise<CompletionResponse>;
}

export interface Gpt4AllServiceConfig {
  pathToModels: string;
  model: string;
  logger: LoggerService;
  threads?: number;
}

export class Gpt4allServiceImpl extends Gpt4AllService {
  private readonly logger: LoggerService;
  model?: InferenceModel;
  private readonly pathToModels: string;
  private readonly modelName: string;
  private readonly threads?: number;

  constructor({ pathToModels, threads, model, logger }: Gpt4AllServiceConfig) {
    super();
    this.logger = logger;
    this.pathToModels = pathToModels;
    this.modelName = model;
    this.threads = threads;
  }

  private async initModel(): Promise<InferenceModel> {
    if (this.model) {
      return this.model;
    }
    const model = await loadModel(this.modelName, {
      modelConfigFile: `${this.pathToModels}/models3.json`,
      modelPath: this.pathToModels,
    });
    if (this.threads) {
      model.llm.setThreadCount(this.threads);
      this.logger.debug(
        `after setting threads to ${this.threads}: ${model.llm.threadCount()}`,
      );
    }
    this.model = model;
    return model;
  }

  async createCompletion({
    prompt,
    temperature,
  }: CreateCompletionRequest): Promise<CompletionResponse> {
    const start = Date.now();
    this.logger.debug('creating completion');
    const model = await this.initModel();

    const result = await createCompletion(model, prompt, {
      temperature,
    });
    // model.dispose();
    this.logger.debug(`completion took ${Date.now() - start} ms`);
    return {
      choices: result.choices.map((choice) => choice.message.content.trim()),
    };
  }
}
