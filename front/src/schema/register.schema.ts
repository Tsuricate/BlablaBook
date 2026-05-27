import z from 'zod';
import i18n from '../i18n';

//Création du Schema Zod
const RegisterSchema = z
  .object({
    username: z.string().min(1, i18n.t('auth:validation.usernameRequired')),
    email: z
      .email(i18n.t('auth:validation.emailInvalid'))
      .min(1, i18n.t('auth:validation.emailRequired')),
    password: z
      .string()
      .min(12, i18n.t('auth:validation.passwordMinLength'))
      .max(100, i18n.t('auth:validation.passwordMaxLength'))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{12,100}$/,
        i18n.t('auth:validation.passwordComplexity')
      ),
    confirmPassword: z.string().min(1, i18n.t('auth:validation.confirmPasswordRequired')),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: i18n.t('auth:validation.passwordsMismatch'),
    path: ['confirmPassword'],
  });

export default RegisterSchema;
