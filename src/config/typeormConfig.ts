import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DbConfig: TypeOrmModuleOptions =
  // process.env.NODE_ENV === 'production'
  //   ?
  {
    type: 'postgres',
    url: 'postgres://rsycgcxd:5DGSQZh6JveCD9R4ne3G81iE4bFlKZ7A@tiny.db.elephantsql.com/rsycgcxd',
    entities: [__dirname + '/./../typeorm/*.entity.{ts,js}'],
    synchronize: true,
  };
// : {
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'postgres',
//     password: 'postgres',
//     database: 'localdb1',
//     entities: [__dirname + '/./../typeorm/*.entity.{ts,js}'],
//     synchronize: true,
//   };
