import { User } from 'src/typeorm/user.entity';
import { OrderItem } from './order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  fullName: string;

  @Column()
  city: string;

  @Column()
  place: string;

  @Column({ nullable: true })
  street: string;

  @Column()
  telephone: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  createAt: Date;

  @Column({ default: false })
  status: boolean;

  @Column({ default: 0 })
  total: number;

  @OneToMany(() => OrderItem, (OrderItem) => OrderItem.order, {
    cascade: true,
  })
  @JoinColumn()
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
