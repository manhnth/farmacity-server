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

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header(
  //     'Access-Control-Allow-Methods',
  //     'GET,PUT,POST,DELETE, PATCH, OPTIONS',
  //   );
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Content-Type, Accept',
  //     'authorization',
  //   );
  //   res.header('Access-Control-Allow-Credentials', true);
  //   next();
  // });

  // app.enableCors({
  //   allowedHeaders: '*',
  //   origin: '*',
  //   credentials: true,
  // });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://farmacity.vercel.app',
      'https://farmacity.vercel.app',
    ],

    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization',
    methods: 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();
