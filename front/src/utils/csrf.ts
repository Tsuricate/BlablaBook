import { axiosAuth } from './axiosAuth';

export const initCsrf = async () => {
  await axiosAuth.get('/auth/csrf');
};
