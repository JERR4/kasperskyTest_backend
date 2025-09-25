import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../users/models/user.entity';
import { Group } from '../groups/models/group.entity';
import * as fs from 'fs/promises';

interface BackupData {
  groups: Group[];
  users: User[];
}

@Injectable()
export class BackupService {
  constructor(
    private dataSource: DataSource,
    private backupFile: string,
  ) {}

  async export(): Promise<void> {
    const userRepo = this.dataSource.getRepository(User);
    const groupRepo = this.dataSource.getRepository(Group);

    const groups = await groupRepo.find();
    const users = await userRepo.find();

    const data = { groups, users };
    await fs.writeFile(this.backupFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Backup saved to', this.backupFile);
  }

  async restore(): Promise<void> {
    const userRepo = this.dataSource.getRepository(User);
    const groupRepo = this.dataSource.getRepository(Group);

    const content = await fs.readFile(this.backupFile, 'utf-8');
    const data: BackupData = JSON.parse(content) as BackupData;

    await userRepo.clear();
    await groupRepo.clear();

    const groups = groupRepo.create(data.groups);
    await groupRepo.save(groups);

    const users = userRepo.create(data.users);
    await userRepo.save(users);

    console.log('Database restored from', this.backupFile);
  }
}
