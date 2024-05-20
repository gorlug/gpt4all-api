import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Gpt4allService } from './gpt4all.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [Gpt4allService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('dummy"', () => {
      expect(true).toBe(true);
    });
  });
});
