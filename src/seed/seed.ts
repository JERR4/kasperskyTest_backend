import { DataSource } from 'typeorm';
import { User } from '../users/models/user.entity';
import { Group } from '../groups/models/group.entity';
import { faker } from '@faker-js/faker';
import * as path from 'node:path';
import * as fs from 'node:fs';

const dbFile = path.resolve(__dirname, '../../database.sqlite');
if (fs.existsSync(dbFile)) {
  fs.unlinkSync(dbFile);
  console.log('Старый файл базы данных удалён');
}

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, Group],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const groupRepo = dataSource.getRepository(Group);
  const userRepo = dataSource.getRepository(User);

  const groupNames = [
    'Руководство',
    'Бухгалтерия',
    'Отдел кадров',
    'ИТ отдел',
    'Маркетинг',
  ];
  const groups = groupNames.map((name) => groupRepo.create({ name }));
  await groupRepo.save(groups);

  const users: User[] = [];
  for (let i = 0; i < 400; i++) {
    const group =
      Math.random() > 0.25
        ? groups[Math.floor(Math.random() * groups.length)]
        : null;

    users.push(
      userRepo.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 65 }),
        group: group ?? undefined,
        groupId: group?.id,
      }),
    );
  }

  await userRepo.save(users);

  console.log('Seed finished: 400 users, 5 groups');
  process.exit();
}

void seed();
