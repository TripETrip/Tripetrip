export interface ApiEnvelope<T> {
  data: T;
  requestId: string;
}

export function apiResponse<T>(data: T, requestId = 'local-request'): ApiEnvelope<T> {
  return { data, requestId };
}
