import {
  ChatMessage,
  CompletionInput,
  CompletionResult,
  createCompletion,
  InferenceModel,
  loadModel,
} from 'gpt4all';

export interface CreateCompletionRequest {
  messages: CompletionInput;
  temperature?: number;
}

export interface LoggerService {
  debug(message: any, ...optionalParams: any[]): any;
}

export abstract class Gpt4AllService {
  abstract createCompletion(
    request: CreateCompletionRequest,
  ): Promise<CompletionResult>;
}

export interface Gpt4AllServiceConfig {
  pathToModels: string;
  model: string;
  logger: LoggerService;
  threads?: number;
  contextSize?: number;
  device?: string;
}

export class Gpt4allServiceImpl extends Gpt4AllService {
  private readonly logger: LoggerService;
  model?: InferenceModel;
  private readonly pathToModels: string;
  private readonly modelName: string;
  private readonly threads?: number;
  private readonly contextSize?: number;
  private readonly device?: string;

  constructor({
    pathToModels,
    threads,
    model,
    logger,
    contextSize,
    device,
  }: Gpt4AllServiceConfig) {
    super();
    this.logger = logger;
    this.pathToModels = pathToModels;
    this.modelName = model;
    this.threads = threads;
    this.contextSize = contextSize;
    this.device = device;
  }

  private async initModel(): Promise<InferenceModel> {
    if (this.model) {
      return this.model;
    }
    const options: LoadModelOptions = {
      modelConfigFile: `${this.pathToModels}/models3.json`,
      modelPath: this.pathToModels,
    };
    if (this.contextSize) {
      options.nCtx = this.contextSize;
    }
    if (this.device) {
      options.device = this.device;
    }
    const model = await loadModel(this.modelName, options);
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
    messages,
    temperature,
  }: CreateCompletionRequest): Promise<CompletionResult> {
    const start = Date.now();
    this.logger.debug('creating completion');
    const model = await this.initModel();

    if (typeof messages !== 'string') {
      if ((messages as ChatMessage[]).length === 1) {
        messages = messages[0].content;
      }
    }
    // model.dispose();
    const result = await createCompletion(model, messages, {
      temperature,
    });
    this.logger.debug(`completion took ${Date.now() - start} ms`);
    return result;
  }
}

interface LoadModelOptions {
  /**
   * Where to look for model files.
   */
  modelPath?: string;
  /**
   * Where to look for the backend libraries.
   */
  librariesPath?: string;
  /**
   * The path to the model configuration file, useful for offline usage or custom model configurations.
   */
  modelConfigFile?: string;
  /**
   * Whether to allow downloading the model if it is not present at the specified path.
   */
  allowDownload?: boolean;
  /**
   * Enable verbose logging.
   */
  verbose?: boolean;
  /**
   * The processing unit on which the model will run. It can be set to
   * - "cpu": Model will run on the central processing unit.
   * - "gpu": Model will run on the best available graphics processing unit, irrespective of its vendor.
   * - "amd", "nvidia", "intel": Model will run on the best available GPU from the specified vendor.
   * - "gpu name": Model will run on the GPU that matches the name if it's available.
   * Note: If a GPU device lacks sufficient RAM to accommodate the model, an error will be thrown, and the GPT4All
   * instance will be rendered invalid. It's advised to ensure the device has enough memory before initiating the
   * model.
   * @default "cpu"
   */
  device?: string;
  /**
   * The Maximum window size of this model
   * @default 2048
   */
  nCtx?: number;
  /**
   * Number of gpu layers needed
   * @default 100
   */
  ngl?: number;
}
