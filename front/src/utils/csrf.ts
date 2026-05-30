import { axiosAuth } from './axiosAuth';

let csrfToken: string | null = null;

export const initCsrf = async () => {
  const response = await axiosAuth.get('/auth/csrf');
  csrfToken = response.data.csrfToken;

  if (!csrfToken) {
    throw new Error('CSRF token not received');
  }
};

export const getCsrfToken = () => csrfToken;
