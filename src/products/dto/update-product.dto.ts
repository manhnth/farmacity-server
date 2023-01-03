import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { extname } from 'path';
import { CategoryEnum } from 'src/typeorm/product.entity';

export class UpdateProductDto {
  // @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name?: string;

  // @IsNotEmpty()
  @IsNumberString()
  price?: number;

  // @IsNotEmpty()
  @IsNumberString()
  inventory?: number;

  category?: CategoryEnum;

  // @IsNotEmpty()
  @MaxLength(400)
  @MinLength(15)
  description?: string;
}
