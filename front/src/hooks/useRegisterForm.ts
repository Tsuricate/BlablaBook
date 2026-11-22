import z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import RegisterSchema from '../schema/register.schema';
import type { RegisterErrorResponse, RegisterResponse } from '@/types/api.type';
import { toaster } from '../components/ui/toaster';
import type { FieldName } from '../types/user';

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const initialFormValues: RegisterFormValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialFormErrors: RegisterFormErrors = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const useRegisterForm = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  const [userInfos, setUserInfos] = useState<RegisterFormValues>(initialFormValues);
  const [errors, setErrors] = useState<RegisterFormErrors>(initialFormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isFormValid =
    Object.values(errors).every((error) => error.length === 0) &&
    Object.values(userInfos).every((value) => !!value.trim()) &&
    termsAccepted;

  const getPasswordError = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return '';
    if (password !== confirmPassword) return t('register.passwordMismatch');
    return '';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserInfos = {
      ...userInfos,
      [event.target.name]: event.target.value,
    };

    setUserInfos(newUserInfos);

    setErrors((prev) => ({
      ...prev,
      confirmPassword: getPasswordError(newUserInfos.password, newUserInfos.confirmPassword),
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (!Object.keys(RegisterSchema.shape).includes(name as FieldName)) return;

    const field = name as FieldName;
    const result = RegisterSchema.shape[field].safeParse(value);
    const error = result.success ? '' : (result.error.issues[0]?.message ?? '');

    setErrors((prev) => ({
      ...prev,
      [field]:
        error || (field === 'confirmPassword' ? getPasswordError(userInfos.password, value) : ''),
    }));
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post<RegisterResponse>('/api/auth/register', userInfos, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success && response.data.data) {
        toaster.success({
          title: t('register.successTitle'),
          description: t('register.successDescription', {
            username: response.data.data.username,
          }),
        });

        setUserInfos({ ...initialFormValues });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error('User creation failed', response.data.message);
      }
    } catch (error) {
      console.error('error', error);

      if (axios.isAxiosError<RegisterErrorResponse>(error)) {
        const backEndMessage = error.response?.data.message || 'GENERIC';

        const messageKey =
          {
            USERNAME_TAKEN: 'auth:register.errorUsername',
            GENERIC: 'auth:register.defaultError',
          }[backEndMessage] ?? 'auth:register.defaultError';

        toaster.error({
          title: t('register.errorTitle'),
          description: t(messageKey),
        });
      } else {
        toaster.error({
          title: t('register.serverErrorTitle'),
          description: t('register.serverErrorDescription'),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    userInfos,
    errors,
    isSubmitting,
    termsAccepted,
    setTermsAccepted,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
