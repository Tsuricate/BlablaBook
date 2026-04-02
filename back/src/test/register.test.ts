import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import { registerUserController } from '../controllers/auth.controller';
import { prisma } from '../utils/prisma.utils';

// Définition du type User
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

// Mock de Prisma
vi.mock('../utils/prisma.utils', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock d'argon2
vi.mock('argon2', () => ({
  hash: vi.fn(),
}));

describe('Register User', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test pour une inscription réussie
  it('doit créer un utilisateur avec des données valides', async () => {
    // Mock de Prisma pour simuler qu'aucun utilisateur n'existe
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    // Mock d'argon2 pour simuler le hachage du mot de passe
    vi.spyOn(argon2, 'hash').mockResolvedValue('hashed_password');
    // Mock de Prisma pour simuler la création de l'utilisateur
    vi.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_password',
    } as User);

    // Simulation d'une requête Express
    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Appel du contrôleur
    await registerUserController(req, res);

    // Vérifications
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(2); // Vérification du username et de l'email
    expect(argon2.hash).toHaveBeenCalledWith('ValidPassword123!');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'User created successfully',
      data: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    });
  });

  // Test pour un username déjà utilisé
  it('doit retourner une erreur si le username est déjà utilisé', async () => {
    // Mock de Prisma pour simuler un username existant
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      email: 'existing@example.com',
      password: 'hashed_password',
    } as User);

    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await registerUserController(req, res);

    // Vérifications
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'USERNAME_TAKEN',
    });
  });

  // Test pour un email déjà utilisé
  it("doit retourner une erreur si l'email est déjà utilisé", async () => {
    // Mock de Prisma pour simuler un email existant
    vi.spyOn(prisma.user, 'findUnique')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 1,
        username: 'existinguser',
        email: 'test@example.com',
        password: 'hashed_password',
      } as User);

    const req = {
      body: {
        username: 'newuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await registerUserController(req, res);

    // Vérifications
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'GENERIC',
    });
  });

  // Test pour des mots de passe non identiques
  it('doit retourner une erreur si les mots de passe ne correspondent pas', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'DifferentPassword123!',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await registerUserController(req, res);

    // Vérifications
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Passwords do not match',
    });
  });

  // Test pour une erreur inconnue
  it("doit retourner une erreur inconnue en cas d'exception", async () => {
    // Mock de Prisma pour simuler une erreur inattendue
    vi.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error('Database error'));

    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await registerUserController(req, res);

    // Vérifications
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unknown error',
    });
  });
});
