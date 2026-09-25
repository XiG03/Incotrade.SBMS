export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
}
