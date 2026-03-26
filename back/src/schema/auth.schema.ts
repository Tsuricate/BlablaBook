import z from 'zod';

//Création du Schema Zod
export const AuthSchema = z.object({
  username: z.string().min(1),
  email: z.email().min(1),
  password: z
    .string()
    .min(12)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{12,100}$/),
  confirmPassword: z.string().min(1),
});

export const LoginSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});
