import { CartItem } from './cart-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  total: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  @JoinTable()
  items: CartItem[];

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;
}
