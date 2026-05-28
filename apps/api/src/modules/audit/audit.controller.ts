import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post('events')
  async recordAction(@Body() body: { actorId: string; action: string; subjectType: string; subjectId?: string }) {
    return apiResponse(await this.auditService.recordAction(body));
  }
}
