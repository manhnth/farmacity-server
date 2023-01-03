import { ProductsModule } from './../products/products.module';
import { CartItem } from '../typeorm/cart-item.entity';
import { Cart } from '../typeorm/cart.entity';
import { UsersModule } from './../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './../auth/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { User } from 'src/typeorm/user.entity';
import { CartService } from './cart.service';
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    TypeOrmModule.forFeature([Cart, CartItem]),
  ],
  controllers: [CartController],
  providers: [JwtStrategy, CartService],
  exports: [CartService],
})
export class CartModule {}
