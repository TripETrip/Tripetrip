import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { OperationsService } from './operations.service';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('tasks')
  async assignTask(@Body() body: unknown) {
    return apiResponse(await this.operationsService.assignTask(body));
  }
}
