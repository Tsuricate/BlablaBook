export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: BackendError[];
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export type BackendError = {
  message: string;
};

export type RegisterResponse = ApiResponse<User>;
export type RegisterErrorResponse = ApiResponse<never>;
