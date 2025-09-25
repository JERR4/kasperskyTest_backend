import { Controller, Get } from '@nestjs/common';
import { GroupsService } from '../service/groups.service';
import { Group } from '../models/group.entity';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // GET /groups
  @Get()
  findAll(): Promise<Group[]> {
    return this.groupsService.findAll();
  }
}
