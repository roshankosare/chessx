import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  console.log(`app is running on port: ${process.env.PORT}`);
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
