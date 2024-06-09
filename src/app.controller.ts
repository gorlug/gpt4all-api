import { Body, Controller, Post } from '@nestjs/common';
import { CreateCompletionRequest, Gpt4AllService } from './gpt4all.service';
import { CompletionResult } from 'gpt4all';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: Gpt4AllService) {}

  @Post('completions')
  async createCompletion(
    @Body() request: CreateCompletionRequest,
  ): Promise<CompletionResult> {
    console.log('request', JSON.stringify(request));
    return this.appService.createCompletion(request);
  }
}
