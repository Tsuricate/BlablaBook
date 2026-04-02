import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkUserExists, registerUser } from '../services/auth.service';
import { prisma } from '../utils/prisma.utils';
import * as argon2 from 'argon2';

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

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test pour `checkUserExists` : username déjà utilisé
  it('doit lever une erreur si le username existe déjà', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      email: 'existing@example.com',
      password: 'hashed_password',
    } as User);

    await expect(checkUserExists('test@example.com', 'testuser')).rejects.toThrow('USERNAME_TAKEN');
  });

  // Test pour `checkUserExists` : email déjà utilisé
  it("doit lever une erreur si l'email existe déjà", async () => {
    vi.spyOn(prisma.user, 'findUnique')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 1,
        username: 'existinguser',
        email: 'test@example.com',
        password: 'hashed_password',
      } as User);

    await expect(checkUserExists('test@example.com', 'newuser')).rejects.toThrow('GENERIC');
  });

  // Test pour `checkUserExists` : aucun utilisateur existant
  it("doit retourner null si aucun utilisateur n'existe", async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const result = await checkUserExists('new@example.com', 'newuser');
    expect(result).toBeNull();
  });

  // Test pour `registerUser` : création réussie d'un utilisateur
  it('doit créer un utilisateur avec un mot de passe haché', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    vi.spyOn(argon2, 'hash').mockResolvedValue('hashed_password');
    vi.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_password',
    } as User);

    const user = await registerUser('testuser', 'test@example.com', 'ValidPassword123!');

    expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
    expect(argon2.hash).toHaveBeenCalledWith('ValidPassword123!');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
      },
    });
    expect(user).toEqual({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_password',
    });
  });
});
