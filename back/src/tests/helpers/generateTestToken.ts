import jwt from 'jsonwebtoken';

export const generateTestToken = (userId: number) => {
  return jwt.sign(
    { id: userId },

    process.env.JWT_SECRET as string
  );
};
