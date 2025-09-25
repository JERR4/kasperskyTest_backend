import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users?search=...&sort=...&order=...
  @Get()
  findAll(
    @Query('nameSearch') nameSearch?: string,
    @Query('emailSearch') emailSearch?: string,
    @Query('sort') sort?: 'name' | 'email' | 'age',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('groupId') groupId?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 50;

    const groupIdValue =
      groupId === 'none' ? 'none' : groupId ? parseInt(groupId) : undefined;

    return this.usersService.findAll(
      nameSearch,
      emailSearch,
      sort,
      order,
      pageNum,
      limitNum,
      groupIdValue,
    );
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  // POST n
  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  // PUT /users/:id
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  // DELETE /users/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
