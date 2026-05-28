export interface LogContext {
  requestId: string;
  actorId?: string;
  module?: string;
}

export function createLogContext(requestId: string, module?: string): LogContext {
  return { requestId, module };
}
