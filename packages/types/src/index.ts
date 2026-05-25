import type { Permissions, Roles } from '../../constants/src/index';

export type Role = (typeof Roles)[keyof typeof Roles];
export type Permission = (typeof Permissions)[keyof typeof Permissions];

export type ServiceCategory =
  | 'hotel'
  | 'homestay'
  | 'hostel'
  | 'villa'
  | 'resort'
  | 'camp'
  | 'adventure'
  | 'trek'
  | 'guide'
  | 'taxi'
  | 'bike_rental'
  | 'bus'
  | 'rural_tourism'
  | 'travel_agency'
  | 'experience'
  | 'event';

export interface ApiResponse<T> {
  data: T;
  requestId: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
}
