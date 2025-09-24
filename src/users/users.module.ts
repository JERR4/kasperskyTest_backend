import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Group } from '../groups/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
