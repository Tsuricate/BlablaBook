// src/services/auth.service.ts
import { AuthSchema } from '../schema/auth.schema';
import { prisma } from '../utils/prisma.utils';
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
export const registerUser = async (data: AuthFormValues) => {
  const { username, email, password } = data;

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
