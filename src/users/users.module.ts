import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { Group } from '../groups/models/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
