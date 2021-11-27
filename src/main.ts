import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'API-VERSION',
  })

  const config = new DocumentBuilder()
    .setTitle('Games API')
    .setDescription('Games API')
    .setVersion('1.0')
    .addTag('game')
    .addTag('publisher')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
