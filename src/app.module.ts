import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Gpt4AllService, Gpt4allServiceImpl } from './gpt4all.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    {
      provide: Gpt4AllService,
      useFactory: (configService: ConfigService) => {
        const threadCount = configService.get('CPU_THREADS');
        const contextSize = configService.get('CONTEXT_SIZE');
        const device = configService.get('DEVICE');
        return new Gpt4allServiceImpl({
          pathToModels: './models',
          model: configService.get('GPT4All_MODEL'),
          logger: new Logger(Gpt4allServiceImpl.name),
          threads: threadCount ? Number.parseInt(threadCount, 10) : undefined,
          contextSize: contextSize
            ? Number.parseInt(contextSize, 10)
            : undefined,
          device: device ? device : undefined,
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
