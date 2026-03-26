export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export type RegisterResponse = ApiResponse<User>;
export type RegisterErrorResponse = ApiResponse<never>;
