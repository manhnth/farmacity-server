import { PORT } from './constants';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    //   {
    //   cors: true,
    // }
  );
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    //  [
    //   // '*',
    //   // 'http://localhost:3000',
    //   // 'http://farmacity.vercel.app',
    //   // 'https://farmacity.vercel.app',
    // ],

    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS, PATCH',
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();
