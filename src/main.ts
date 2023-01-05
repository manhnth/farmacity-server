import { PORT } from './constants';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    //   {
    //   cors: true,
    // }
  );
  app.use(cookieParser());

  const options = new DocumentBuilder()
    .setTitle('Admin manager')
    .setDescription('API Manger')
    .setVersion('1.0')
    .addTag('admin management')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://farmacity.vercel.app',
      'https://farmacity.vercel.app',
    ],

    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, Access-Control-Allow-Credentials',
    methods: 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();
