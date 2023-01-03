import { CategoryEnum } from './../../typeorm/product.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { extname } from 'path';

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  // @IsNumberString()
  price: number;

  @IsNotEmpty()
  // @IsNumberString()
  inventory: number;

  createAt?: Date;

  updateAt?: Date;

  @IsNotEmpty()
  category: CategoryEnum;

  @IsNotEmpty()
  @MaxLength(400)
  @MinLength(15)
  description: string;

  @IsNotEmpty()
  imgUrl: string;
}
