import { JwtService } from '@nestjs/jwt';
import { Injectable, } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) return null

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateTokens(user: any) {
    const payload = { name: user.name, id: user.id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: 'access',
        expiresIn: '2 days'
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: 'secret',
        expiresIn: '7d'
      })
    };
  }

  async verifyRefreshToken(refresh_token: string) {
    try {
      const { name, id } = await this.jwtService.verify(refresh_token, { secret: 'secret' });

      return { name, id };
    } catch (error) {
      console.log(error);
    }
  }
}
