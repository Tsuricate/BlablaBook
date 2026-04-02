import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Schéma Zod avec messages d'erreur en dur
const RegisterSchema = z
  .object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
    email: z.string().email("L'email est invalide").min(1, "L'email est requis"),
    password: z
      .string()
      .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
      .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{12,100}$/,
        'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
      ),
    confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

describe('RegisterSchema Validation with Zod', () => {
  // Tests pour le champ "username"
  describe('Username validation', () => {
    it("doit retourner une erreur si le nom d'utilisateur est vide", () => {
      const data = {
        username: '',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const flattenedErrors = z.flattenError(result.error);
        expect(flattenedErrors.fieldErrors.username).toContain("Le nom d'utilisateur est requis");
      }
    });

    it("doit valider un nom d'utilisateur correct", () => {
      const data = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  // Tests pour le champ "email"
  describe('Email validation', () => {
    it("doit retourner une erreur si l'email est vide", () => {
      const data = {
        username: 'testuser',
        email: '',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const flattenedErrors = z.flattenError(result.error);
        expect(flattenedErrors.fieldErrors.email).toContain("L'email est requis");
      }
    });

    it("doit retourner une erreur si l'email est invalide", () => {
      const data = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const flattenedErrors = z.flattenError(result.error);
        expect(flattenedErrors.fieldErrors.email).toContain("L'email est invalide");
      }
    });

    it('doit valider un email correct', () => {
      const data = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  // Tests pour le champ "password"
  describe('Password validation', () => {
    it('doit retourner une erreur si le mot de passe est trop court', () => {
      const data = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Short1!',
        confirmPassword: 'Short1!',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const flattenedErrors = z.flattenError(result.error);
        expect(flattenedErrors.fieldErrors.password).toContain(
          'Le mot de passe doit contenir au moins 12 caractères'
        );
      }
    });

    it('doit retourner une erreur si le mot de passe est trop long', () => {
      const data = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'a'.repeat(101),
        confirmPassword: 'a'.repeat(101),
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const flattenedErrors = z.flattenError(result.error);
        expect(flattenedErrors.fieldErrors.password).toContain(
          'Le mot de passe ne doit pas dépasser 100 caractères'
        );
      }
    });

    it('doit retourner une erreur si le mot de passe ne respecte pas la complexité requise', () => {
      const data = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'nocapsnodigits123',
        confirmPassword: 'nocapsnodigits123',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const flattenedErrors = z.flattenError(result.error);
        expect(flattenedErrors.fieldErrors.password).toContain(
          'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
        );
      }
    });
  });

  // Tests pour le champ "confirmPassword"
  describe('ConfirmPassword validation', () => {
    it('doit retourner une erreur si la confirmation du mot de passe est vide', () => {
      const data = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: '',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const flattenedErrors = z.flattenError(result.error);
        expect(flattenedErrors.fieldErrors.confirmPassword).toContain(
          'La confirmation du mot de passe est requise'
        );
      }
    });

    it('doit retourner une erreur si les mots de passe ne correspondent pas', () => {
      const data = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'InvalidPassword123!',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const flattenedErrors = z.flattenError(result.error);
        expect(flattenedErrors.fieldErrors.confirmPassword).toContain(
          'Les mots de passe ne correspondent pas'
        );
      }
    });
  });

  // Test global pour un formulaire valide
  it("doit valider un formulaire d'inscription complet et correct", () => {
    const data = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    };
    const result = RegisterSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
