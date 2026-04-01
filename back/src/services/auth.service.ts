// src/services/auth.service.ts
import { AuthSchema } from '../schema/auth.schema';
import { prisma, User } from '../utils/prisma.utils';
import * as argon2 from 'argon2';
import { convertInMs } from '../utils/time.utils';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';

// Typage TypeScript
type AuthFormValues = z.infer<typeof AuthSchema>;
export type UserError = {
  status?: number;
  field: 'username' | 'generic';
  message: string;
};

// Vérifie si l'utilisateur existe déjà
export const checkUserExists = async (email: string, username: string) => {
  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    const error: UserError = {
      status: 409,
      field: 'username',
      message: 'USERNAME_TAKEN',
    };
    throw error;
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    const error: UserError = {
      status: 409,
      field: 'generic',
      message: 'GENERIC',
    };
    throw error;
  }
  return null;
};

// Crée un nouvel utilisateur
export const registerUser = async (username: string, email: string, password: string) => {
  // Vérification de l'existence de l'utilisateur
  await checkUserExists(email, username);

  // Hachage du mot de passe
  const hashedPassword = await argon2.hash(password);

  // Création de l'utilisateur
  return prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
};

// Recherche un utilisateur par email
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

// Vérifie le mot de passe de l'utilisateur
export const verifyPassword = async (
  userPassword: string,
  inputPassword: string
): Promise<boolean> => {
  return argon2.verify(userPassword, inputPassword);
};

// Génère un token JWT
export const generateToken = (payload: { id: number; username: string; email: string }): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  if (!expiresIn) {
    throw new Error('JWT_EXPIRES_IN environment variable is not defined');
  }

  const options: SignOptions = { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, secret as jwt.Secret, options);
};

// Génère un refresh token
export const generateRefreshToken = (expiresIn: string): { token: string; expiresAt: Date } => {
  const token = crypto.randomBytes(128).toString('base64');

  const expiresAt = new Date(Date.now() + convertInMs(expiresIn));

  return { token, expiresAt };
};

// Enregistre le refresh token en base de données
export const saveRefreshToken = async (userId: number, token: string, expiresAt: Date) => {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      issuedAt: new Date(),
      expiresAt: expiresAt,
    },
  });
};

// Logique complète de login
export const login = async (email: string, password: string, rememberMe: boolean) => {
  // Recherche de l'utilisateur
  const user = await findUserByEmail(email);
  if (!user) {
    throw {
      status: 401,
      message: 'INVALID_CREDENTIALS',
    };
  }

  // Vérification du mot de passe
  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) {
    throw {
      status: 401,
      message: 'INVALID_CREDENTIALS',
    };
  }

  // Génération des tokens
  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
  });

  const refreshExpires = rememberMe
    ? process.env.REFRESH_TOKEN_EXPIRES_IN
    : process.env.JWT_EXPIRES_IN;

  if (!refreshExpires) {
    throw new Error('Missing refresh token expiration env variable');
  }

  const { token: refreshToken, expiresAt } = generateRefreshToken(refreshExpires);

  await saveRefreshToken(user.id, refreshToken, expiresAt);

  return {
    user: { id: user.id, username: user.username, email: user.email },
    token,
    refreshToken,
  };
};

export const getCurrentUser = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, createdAt: true },
  });
};

export const refreshUserToken = async (refreshToken: string) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw { status: 401, message: 'Invalid or expired refresh token' };
  }

  const token = generateToken({
    id: tokenRecord.user.id,
    username: tokenRecord.user.username,
    email: tokenRecord.user.email,
  });

  return {
    token,
    user: {
      id: tokenRecord.user.id,
      username: tokenRecord.user.username,
      email: tokenRecord.user.email,
    },
  };
};

export const deleteUser = async (userId: number) => {
  deleteRefreshToken(userId);
  const deletedUser = prisma.user.delete({ where: { id: userId } });
  const deletedUserHasBook = prisma.userBook.deleteMany({ where: { userId: userId } });
  const transactions = await prisma.$transaction([deletedUserHasBook, deletedUser]);

  return transactions;
};

export const deleteRefreshToken = async (userId: number) => {
  return prisma.refreshToken.deleteMany({ where: { userId: userId } });
};

export const updateUser = async (
  userId: number,
  username: string | undefined,
  email: string | undefined,
  password: string | undefined
) => {
  const updates: Partial<User> = {};

  if (username) {
    updates.username = username;
  }

  if (email) {
    updates.email = email;
  }

  if (password) {
    const hashedPassword = await argon2.hash(password);
    updates.password = hashedPassword;
  }

  if (Object.keys(updates).length === 0) {
    throw { status: 400, message: 'No fields to update' };
  }

  const errors: { message: string }[] = [];

  if (updates.email) {
    const existingEmail = await findUserByEmail(updates.email);
    if (existingEmail) {
      // throw { status: 409, message: 'GENERIC' };
      errors.push({ message: 'GENERIC' });
    }
  }

  if (updates.username) {
    const existingUser = await findUserByUsername(updates.username);
    if (existingUser) {
      // throw { status: 409, message: 'USERNAME_TAKEN' };
      errors.push({ message: 'USERNAME_TAKEN' });
    }
  }

  if (errors.length > 0) {
    throw { status: 409, errors };
  }

  return prisma.user.update({ where: { id: userId }, data: updates });
};
