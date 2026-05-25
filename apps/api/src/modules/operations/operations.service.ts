import { Injectable } from '@nestjs/common';
import { AssignTaskSchema } from '../../../../../packages/validators/src/index';
import { stableId } from '../../common/domain/ids';

@Injectable()
export class OperationsService {
  async assignTask(input: unknown) {
    const parsed = AssignTaskSchema.parse(input);

    return {
      id: stableId('task', `${parsed.organizationId}-${parsed.title}`),
      organizationId: parsed.organizationId,
      title: parsed.title,
      assigneeRole: parsed.assigneeRole,
      status: 'assigned',
      workflow: 'staff_operations',
      auditRequired: true,
    };
  }
}
