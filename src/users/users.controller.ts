import { UpdateUserDto } from './dto/update-user-dto';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('Not founded user in db');
    }
    await this.usersService.updateUser(updateUserDto, user);
  }
}
