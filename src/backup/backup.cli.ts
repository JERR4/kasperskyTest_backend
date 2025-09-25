import { DataSource } from 'typeorm';
import { BackupService } from './backup.service';
import { User } from '../users/models/user.entity';
import { Group } from '../groups/models/group.entity';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as constants from 'node:constants';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, Group],
  synchronize: false,
});

async function main() {
  await dataSource.initialize();

  const action = process.argv[2];
  const filePath = process.argv[3]
    ? path.resolve(process.argv[3])
    : path.resolve(__dirname, '../../backup.json');

  const backupService = new BackupService(dataSource, filePath);

  if (action === 'export') {
    await backupService.export();
  } else if (action === 'restore') {
    try {
      await fs.access(filePath, constants.F_OK);
    } catch {
      console.error(`Файл бэкапа не найден: ${filePath}`);
      process.exit(1);
    }

    try {
      await backupService.restore();
    } catch (err) {
      console.error(
        `Ошибка при восстановлении из бэкапа: ${(err as Error).message}`,
      );
      process.exit(1);
    }
  } else {
    console.log(
      'Usage: ts-node backup.cli.ts [export|restore] [optional path]',
    );
  }

  process.exit();
}

main();
