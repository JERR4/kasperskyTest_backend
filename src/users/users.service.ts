import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../groups/group.entity';
import { UserResponseDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async findAll(
    nameSearch?: string,
    emailSearch?: string,
    sort: 'name' | 'email' | 'age' = 'name',
    order: 'ASC' | 'DESC' = 'ASC',
    page: number = 1,
    limit: number = 50,
    groupId?: number | 'none',
  ) {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.group', 'group');

    if (nameSearch) {
      qb.andWhere('user.name LIKE :name', { name: `%${nameSearch}%` });
    }

    if (emailSearch) {
      qb.andWhere('user.email LIKE :email', { email: `%${emailSearch}%` });
    }

    if (groupId !== undefined) {
      if (groupId === 'none') {
        qb.andWhere('user.group IS NULL');
      } else {
        qb.andWhere('group.id = :groupId', { groupId });
      }
    }

    if (sort) {
      qb.orderBy(`user.${sort}`, order);
    }

    const [users, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = users.map(u => new UserResponseDto(u));
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['group'],
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return new UserResponseDto(user);
  }

  async create(data: {
    name: string;
    email: string;
    age: number;
    groupId?: number;
  }): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    if (data.groupId) {
      const group = await this.groupRepository.findOne({
        where: { id: data.groupId },
      });
      if (!group) throw new NotFoundException('Группа не найдена');
    }

    const user = this.userRepository.create({ ...data });
    return this.userRepository.save(user);
  }


  async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      age: number;
      groupId?: number;
    }>,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser && existingUser?.id !== id) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    if (data.groupId) {
      const group = await this.groupRepository.findOne({
        where: { id: data.groupId },
      });
      if (!group) throw new NotFoundException('Группа не найдена');
    }
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');
    await this.userRepository.remove(user);
  }
}
