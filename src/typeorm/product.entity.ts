import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CategoryEnum {
  NHIET_KE = 'Nhiệt kế',
  MAY_DO_HUYET_AP = 'Máy đo huyết áp',
  MAY_DO_DUONG_HUYET = 'Máy đo đường huyết',
  MAY_XONG_KHI_DUNG = 'Máy xông khí dung',
  THIET_BI_Y_TE_KHAC = 'Thiết bị y tế khác',
  DUNG_CU_KIEM_TRA = 'Dụng cụ kiểm tra',
}
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  imgUrl: string;

  @Column()
  inventory: number;

  @Column({
    type: 'enum',
    enum: CategoryEnum,
    default: CategoryEnum.THIET_BI_Y_TE_KHAC,
  })
  category: CategoryEnum;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamptz',
    // default: () => 'CURRENT_TIMESTAMP',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: false,
    // default: () => 'CURRENT_TIMESTAMP',
    name: 'update_at',
  })
  updateAt: Date;

  // @Column()
}
