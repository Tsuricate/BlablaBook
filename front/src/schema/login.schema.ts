import z from 'zod';
import i18n from '../i18n';

const LoginSchema = z.object({
  email: z
    .email(i18n.t('auth:validation.emailInvalid'))
    .min(1, i18n.t('auth:validation.emailRequired')),
  password: z
    .string()
    .min(12, i18n.t('auth:validation.passwordRequired'))
    .max(100, i18n.t('auth:validation.passwordRequired')),
});

export default LoginSchema;
