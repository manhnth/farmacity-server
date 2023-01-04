import { UserRole } from './../../typeorm/user.entity';
import { IsEmail } from 'class-validator';
export class UpdateUserDto {
  // name: string;
  // @IsEmail()
  // email: string;
  // role?: UserRole;
  password: string;
}
