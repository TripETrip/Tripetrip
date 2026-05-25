import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { CrmService } from './crm.service';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post('leads')
  async captureLead(@Body() body: unknown) {
    return apiResponse(await this.crmService.captureLead(body));
  }
}
