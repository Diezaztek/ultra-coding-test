import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(
    process.env.NODE_ENV === 'dev' ? ['log', 'debug', 'error', 'verbose', 'warn'] : ['error', 'warn'],
  )
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  await app.listen(3000);
}
bootstrap();
