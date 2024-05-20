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
        return new Gpt4allServiceImpl({
          pathToModels: './models',
          model: configService.get('GPT4All_MODEL'),
          logger: new Logger(Gpt4allServiceImpl.name),
          threads: Number.parseInt(threadCount, 10),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
