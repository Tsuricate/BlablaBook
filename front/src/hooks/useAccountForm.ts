import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../context/UserContext';
import { toaster } from '../components/ui/toaster';
import RegisterSchema from '../schema/register.schema';
import type { FieldName, FormErrors, RegisterFormValues } from '../types/user';
import { axiosAuth } from '../utils/axiosAuth';
import { buildUpdatePayload, errorMessageMap } from '../utils/accountForm.utils';
import axios from 'axios';
import type { BackendError, RegisterErrorResponse } from '../types/api.type';

const emptyForm = (username = '', email = ''): RegisterFormValues => ({
  username,
  email,
  password: '',
  confirmPassword: '',
});

const emptyErrors = (): FormErrors => ({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

export const useAccountForm = () => {
  const { t } = useTranslation('account');
  const { user, setUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RegisterFormValues>(
    emptyForm(user?.username, user?.email)
  );
  const [initialFormData, setInitialFormData] = useState<RegisterFormValues>(
    emptyForm(user?.username, user?.email)
  );
  const [errors, setErrors] = useState(emptyErrors());

  const isFormValid = () => Object.values(errors).every((error) => !error);

  const handleEditClick = () => {
    setIsEditing(true);
    setInitialFormData(emptyForm(user?.username, user?.email));
    setFormData(emptyForm());
    setErrors(emptyErrors());
  };

  const showSaveErrors = (error: unknown) => {
    const backendErrors = axios.isAxiosError<RegisterErrorResponse>(error)
      ? error.response?.data.errors
      : undefined;

    if (!backendErrors?.length) {
      toaster.error({ title: t('errors.title'), description: t('errors.generic') });
      return;
    }

    backendErrors.forEach((err: BackendError) => {
      toaster.error({
        title: t('errors.title'),
        description: t(errorMessageMap[err.message] ?? 'errors.generic'),
        duration: 6000,
      });
    });
  };

  const handleSaveClick = async () => {
    if (!user?.id) {
      toaster.error({
        title: t('errors.title'),
        description: t('errors.userNotFound'),
      });
      return;
    }

    const payload = buildUpdatePayload(formData, user);

    if (Object.keys(payload).length === 0) {
      toaster.info({
        title: t('errors.noModification'),
        description: t('errors.noModificationDescription'),
      });
      setIsEditing(false);
      setFormData(initialFormData);
      return;
    }

    try {
      const { data: result } = await axiosAuth.patch(`/auth/users/${user.id}`, payload);

      if (!result.success || !result.data) {
        console.error('Error updating user:', result.message);
        return;
      }

      const updatedUser = result.data;
      toaster.success({
        title: t('success.modificationSuccess'),
        description: t('success.modificationSuccessDescription'),
      });
      setUser(updatedUser);
      setInitialFormData(emptyForm(updatedUser.username, updatedUser.email));
      setFormData(emptyForm(updatedUser.username, updatedUser.email));
      setIsEditing(false);
    } catch (error) {
      showSaveErrors(error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(emptyForm(initialFormData.username, initialFormData.email));
  };

  const getPasswordError = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return '';
    if (password != confirmPassword) return t('errors.passwordMismatch');
    return '';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as FieldName;
    const newFormData = { ...formData, [name]: event.target.value };
    setFormData(newFormData);

    if (name === 'password' || name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: getPasswordError(newFormData.password, newFormData.confirmPassword),
      }));
    }
  };
  //   const { value } = event.target;
  //   const name = event.target.name as FieldName;
  //   const isModifiedOrFilled =
  //     (name === 'username' && value !== initialFormData.username) ||
  //     (name === 'email' && value !== initialFormData.email) ||
  //     (name === 'password' && value) ||
  //     (name === 'confirmPassword' && value);

  //   if (!isModifiedOrFilled) {
  //     return;
  //   }

  //   const miniSchema = z.object({ [name]: RegisterSchema.shape[name] });
  //   const result = miniSchema.safeParse({ [name]: value });

  //   setErrors((prev) => {
  //     if (!result.success) {
  //       const error = z.flattenError(result.error).fieldErrors[name]?.[0] || '';
  //       return { ...prev, [name]: error && value ? error : '' };
  //     }
  //     if (name === 'confirmPassword') {
  //       return { ...prev, confirmPassword: getPasswordError(formData.password, value) };
  //     }
  //     return { ...prev, [name]: '' };
  //   });
  // };

  const validateField = (name: FieldName, value: string): string => {
    const result = RegisterSchema.shape[name].safeParse(value);
    if (!result.success) return result.error.issues[0]?.message ?? '';
    if (name === 'confirmPassword') return getPasswordError(formData.password, value);
    return '';
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const name = event.target.name as FieldName;

    const isUntouched = value === '' || value === initialFormData[name];

    setErrors((prev) => ({ ...prev, [name]: isUntouched ? '' : validateField(name, value) }));
  };

  return {
    user,
    isEditing,
    formData,
    initialFormData,
    errors,
    isFormValid,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleChange,
    handleBlur,
  };
};

export type AccountForm = ReturnType<typeof useAccountForm>;
