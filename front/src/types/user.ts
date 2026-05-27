export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type User = {
  id: number;
  email: string;
  username: string;
};
