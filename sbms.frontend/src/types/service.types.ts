export interface ServiceCreateRequest {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}

export interface ServiceUpdateRequest extends ServiceCreateRequest {
  id: string;
  isActive: boolean;
}

export interface ServiceResponse {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}
