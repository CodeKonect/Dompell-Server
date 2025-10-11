import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 1600;

  const options = new DocumentBuilder()
    .setTitle('Dompell API Documentation')
    .setDescription('REST API for Dompell Web Application')
    .setVersion('1.0.0')
    .addServer(`'http://localhost:'${port}/`, 'Local environment')
    .addServer('https://dompell-server.onrender.com', 'Production')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  if (!port)
    throw new NotFoundException('Port not found in environment variables');

  await app.listen(port);
}
bootstrap();
