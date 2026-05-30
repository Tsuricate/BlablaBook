import { axiosAuth } from './axiosAuth';

let csrfToken: string | null = null;

export const initCsrf = async () => {
  const response = await axiosAuth.get('/auth/csrf');
  csrfToken = response.data.csrfToken;
};

export const getCsrfToken = () => csrfToken;
