import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DbConfig: TypeOrmModuleOptions =
  process.env.NODE_ENV === 'production'
    ? {
        type: 'postgres',
        url: process.env.DB_URL!,
        entities: [__dirname + '/./typeorm/*.entity.{ts,js}'],
        synchronize: true,
      }
    : {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'localdb1',
        entities: [__dirname + '/./../typeorm/*.entity.{ts,js}'],
        synchronize: true,
      };
