import { Injectable } from '@nestjs/common';
import { stableId } from '../../common/domain/ids';

@Injectable()
export class AuditService {
  async recordAction(input: { actorId: string; action: string; subjectType: string; subjectId?: string }) {
    return {
      id: stableId('audit', `${input.actorId}-${input.action}-${input.subjectId || 'platform'}`),
      actorId: input.actorId,
      action: input.action,
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      immutable: true,
      createdAt: new Date().toISOString(),
    };
  }
}
