import { Product } from './../typeorm/product.entity';
import { CartModule } from './../cart/cart.module';
import { UsersModule } from './../users/users.module';
import { OrderItem } from '../typeorm/order-item.entity';
import { AuthModule } from './../auth/auth.module';
import { Order } from './../typeorm/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    AuthModule,
    UsersModule,
    CartModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
