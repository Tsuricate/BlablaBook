import type { RegisterFormValues } from '../types/user';

export type FieldName = keyof RegisterFormValues;
export type FormErrors = Record<FieldName, string>;

export const errorMessageMap: Record<string, string> = {
  USERNAME_TAKEN: 'account:errors.errorUsername',
  GENERIC: 'account:errors.errorEmail',
};

export const emptyForm = (username = '', email = ''): RegisterFormValues => ({
  username,
  email,
  password: '',
  confirmPassword: '',
});

export const emptyErrors = (): FormErrors => ({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

export const buildUpdatePayload = (
  formData: RegisterFormValues,
  user: { username: string; email: string }
): Partial<RegisterFormValues> => {
  const payload: Partial<RegisterFormValues> = {};

  if (formData.username.trim() && formData.username !== user.username) {
    payload.username = formData.username;
  }
  if (formData.email.trim() && formData.email !== user.email) {
    payload.email = formData.email;
  }
  if (formData.password) {
    payload.password = formData.password;
    payload.confirmPassword = formData.confirmPassword;
  }

  return payload;
};
