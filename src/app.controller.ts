import { Body, Controller, Post } from '@nestjs/common';
import {
  CompletionResponse,
  CreateCompletionRequest,
  Gpt4AllService,
} from './gpt4all.service';

@Controller()
export class AppController {
  constructor(private readonly appService: Gpt4AllService) {}

  @Post()
  async createCompletion(
    @Body() request: CreateCompletionRequest,
  ): Promise<CompletionResponse> {
    return this.appService.createCompletion(request);
  }
}
