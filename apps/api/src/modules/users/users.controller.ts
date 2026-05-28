import { Controller, Get, Param } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/workspace')
  async getTravelerWorkspace(@Param('id') id: string) {
    return apiResponse(await this.usersService.getTravelerWorkspace(id));
  }
}
