import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from './../users/users.service';
import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Res,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 } from 'uuid';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private authService: AuthService,
    private readonly mailerService: MailerService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { access_token, refresh_token } =
      await this.authService.generateTokens(req.user);

    res.cookie('refresh_token', refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    });
    return res.send({ access_token });
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      return user;
    } catch (error) {
      if (error.driverError?.code === '23505') {
        throw new BadRequestException('Email already exist', {
          cause: new Error(),
          description: 'Some error description',
        });
      }
    }
  }

  @Get('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refresh_token } = req.cookies;

    if (!refresh_token) return;

    const user = await this.authService.verifyRefreshToken(refresh_token);

    // generate new tokens
    // attach new refresh token to cookie
    // and return access token
    const { access_token, refresh_token: new_refresh_token } =
      await this.authService.generateTokens(user);

    res.cookie('refresh_token', new_refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    });
    return res.send({ access_token });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.cookie('refresh_token', 'logout', {
      maxAge: 1000,
      httpOnly: true,
    });

    res.send({ message: 'logged out!' });
  }

  @Post('forgotPassword')
  async resetPassword(@Body() userEmail: any) {
    const email = userEmail.email;

    const user = await this.userService.findOne(email);

    if (!user) {
      throw new BadRequestException(`Not found user with email: ${email}`);
    }

    const resetToken = v4();

    await this.redis.set(
      'RESETPASSWORD' + resetToken,
      user.id,
      'EX',
      1000 * 60 * 60 * 24, // 1 day
    );

    const res = await this.mailerService
      .sendMail({
        to: 'ntmanh2903@gmail.com', // list of receivers
        from: 'ntmanhvp2k@gmail.com', // sender address
        subject: 'Farmacity reset password ✔', // Subject line
        // text: 'reset password',
        // plaintext body
        html: `<a href='http://localhost:3000/changePassword/${resetToken}'>reset password</a>`, // HTML body content
      })
      .then(() => {
        console.log('ok');
      })
      .catch((e) => {
        console.log(e);
      });
    return res;
  }

  @Post('changePassword')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const { token, newPassword } = changePasswordDto;

    const userId = await this.redis.get('RESETPASSWORD' + token);

    if (!userId) {
      throw new BadRequestException(`reset token expired!`);
    }

    const user = await this.userService.getUserById(+userId);

    if (!user) {
      throw new NotFoundException(`Not found user in db!`);
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );

    return await this.userService.updateUser(
      { password: hashedPassword },
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async me(@Req() req: any) {
    return req.user;
  }
}
