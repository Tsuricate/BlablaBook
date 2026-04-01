import {
  Box,
  Button,
  Field,
  FieldErrorIcon,
  Flex,
  Heading,
  Input,
  VStack,
  Dialog,
  CloseButton,
  Portal,
} from '@chakra-ui/react';
import { useCurrentUser } from '../context/UserContext';
import { PageLayout } from './layouts/PageLayout';
import homeImage from '../assets/homePageImage.jpg';
import MobileMenu from './MobileMenu';
import { PasswordInput } from './ui/password-input';
import { Toaster, toaster } from './ui/toaster';
import RegisterSchema from '../schema/register.schema';
import type { RegisterFormValues } from '../types/user';
import z from 'zod';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { axiosAuth } from '../utils/axiosAuth';
import type { BackendError, RegisterErrorResponse } from '@/types/api.type';
import axios from 'axios';

const AccountPage = () => {
  const { t } = useTranslation('account');
  const { user, setUser } = useCurrentUser();
  const { logout } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RegisterFormValues>({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const [initialFormData, setInitialFormData] = useState<RegisterFormValues>({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const isFormValid = () => {
    const hasNoErrors = Object.values(errors).every((error) => !error);
    if (!hasNoErrors) return false;
    return true;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setInitialFormData({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    });
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleSaveClick = async () => {
    setIsEditing(true);

    if (!user?.id) {
      toaster.create({
        title: t('errors.title'),
        description: t('errors.userNotFound'),
        type: 'error',
        duration: 3000,
        closable: true,
      });
      return;
    }
    // Enregistrer les modifications
    try {
      const updatedData: Partial<RegisterFormValues> = {};
      if (formData.username !== user.username && formData.username.trim() !== '') {
        updatedData.username = formData.username;
      }
      if (formData.email !== user.email && formData.email.trim() !== '') {
        updatedData.email = formData.email;
      }
      if (formData.password) {
        updatedData.password = formData.password;
      }
      if (formData.confirmPassword) {
        updatedData.confirmPassword = formData.confirmPassword;
      }

      if (Object.keys(updatedData).length === 0) {
        toaster.create({
          title: t('errors.noModification'),
          description: t('errors.noModificationDescription'),
          type: 'info',
          duration: 3000,
          closable: true,
        });
        setIsEditing(false);
        return setFormData(initialFormData);
      }
      const response = await axiosAuth.patch(`/api/auth/users/${user.id}`, updatedData);

      if (response.data.success && response.data.data) {
        toaster.create({
          title: t('success.modificationSuccess'),
          description: t('success.modificationSuccessDescription'),
          type: 'success',
          duration: 3000,
          closable: true,
        });
        setUser(response.data.data);
        setInitialFormData({
          username: response.data.data.username,
          email: response.data.data.email,
          password: '',
          confirmPassword: '',
        });
        setFormData({
          username: response.data.data.username,
          email: response.data.data.email,
          password: '',
          confirmPassword: '',
        });
        setIsEditing(false);
      } else {
        console.error('Error updating user:', response.data.message);
      }
    } catch (error) {
      // console.error('Error updating user:', error);
      setFormData(initialFormData);

      if (axios.isAxiosError<RegisterErrorResponse>(error)) {
        const backEndMessage = error.response?.data.errors;
        const errorMessageMap: Record<string, string> = {
          USERNAME_TAKEN: 'account:errors.errorUsername',
          GENERIC: 'account:errors.errorEmail',
        };
        backEndMessage.forEach((error: BackendError) => {
          const translatedMessagekey = errorMessageMap[error.message];
          toaster.create({
            title: t(`errors.title`), // Ex: "Erreur d'email"
            description: t(`${translatedMessagekey}`), // Ex: "Cet email est déjà utilisé"
            type: 'error',
            duration: 6000,
            closable: true,
          });
        });
      }
      setIsEditing(true);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      username: initialFormData.username || '',
      email: initialFormData.email || '',
      password: '',
      confirmPassword: '',
    });
  };

  const getPasswordError = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return '';
    if (password != confirmPassword) return t('errors.passwordMismatch');
    return '';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...formData, [event.target.name]: event.target.value };
    setFormData(newFormData);

    if (event.target.name === 'password' || event.target.name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: getPasswordError(newFormData.password, newFormData.confirmPassword),
      }));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const isModifiedOrFilled =
      (name === 'username' && value !== initialFormData.username) ||
      (name === 'email' && value !== initialFormData.email) ||
      (name === 'password' && value) ||
      (name === 'confirmPassword' && value);

    if (!isModifiedOrFilled) {
      return;
    }

    const miniSchema = z.object({ [name]: RegisterSchema.shape[name] });

    const result = miniSchema.safeParse({ [name]: value });

    setErrors((prev) => {
      if (!result.success) {
        const error = z.flattenError(result.error).fieldErrors[name]?.[0] || '';
        return { ...prev, [name]: error && value ? error : '' };
      }
      if (name === 'confirmPassword') {
        return { ...prev, confirmPassword: getPasswordError(formData.password, value) };
      }
      return { ...prev, [name]: '' };
    });
  };

  const handleDeleteClick = async () => {
    if (!user?.id) {
      toaster.create({
        title: t('errors.title'),
        description: t('errors.userNotFound'),
        type: 'error',
        duration: 5000,
        closable: true,
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axiosAuth.delete(`/api/auth/users/${user.id}`);
      if (response.data.success) {
        logout();
        toaster.create({
          title: t('success.deleteSuccess'),
          description: t('success.deleteSuccessDescription'),
          type: 'success',
          duration: 3000,
          closable: true,
        });
      } else {
        console.error('Error deleting account:', response.data.message);
      }
    } catch (error) {
      toaster.create({
        title: t('errors.title'),
        description: t('errors.errorsDeleteAccount'),
        type: 'error',
        duration: 3000,
        closable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      const response = await axiosAuth.post('/api/auth/logout');
      if (!response.data.success) {
        console.error('Error logging out:', response.data.message);
        return;
      }
      logout();
      toaster.create({
        title: t('deconnect.title'),
        description: t('deconnect.description'),
        type: 'success',
        duration: 3000,
        closable: true,
      });
    } catch (error) {}
  };

  return (
    <PageLayout imageSrc={homeImage} imagePosition="left">
      <Flex justify="center" align="center" mt={{ md: '20%' }}>
        <Box
          as="form"
          borderWidth={{ base: 0, md: 4 }}
          borderRadius={{ base: 0, md: 4 }}
          width={{ base: '40vh', md: '50vh' }}
          height={{ base: '100vh', md: 'auto' }}
        >
          <VStack p={{ base: 4, md: 8 }} align="start" width="100%">
            <Heading
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              alignSelf="center"
            >
              {t('generale.account')}
            </Heading>
            <Field.Root invalid={!!errors.username}>
              <Field.Label>
                {t('generale.username')}
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="text"
                disabled={!isEditing}
                name="username"
                value={formData.username}
                placeholder={initialFormData.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {isEditing && (
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.username}
                  </Field.ErrorText>
                </Box>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.email}>
              <Field.Label>
                {t('generale.email')}
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="email"
                disabled={!isEditing}
                name="email"
                value={formData.email}
                placeholder={initialFormData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {isEditing && (
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.email}
                  </Field.ErrorText>
                </Box>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.password}>
              <Field.Label>
                {t('generale.password')}
                <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                type="password"
                disabled={!isEditing}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={!isEditing ? '********' : 'Nouveau mot de passe'}
              />
              {isEditing && (
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.password}
                  </Field.ErrorText>
                </Box>
              )}
            </Field.Root>
            {isEditing && (
              <Field.Root invalid={!!errors.confirmPassword}>
                <Field.Label>
                  {t('generale.confirmPassword')}
                  <Field.RequiredIndicator />
                </Field.Label>
                <PasswordInput
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={!isEditing ? '********' : 'Nouveau mot de passe'}
                />
                {isEditing && (
                  <Box minH={6}>
                    <Field.ErrorText>
                      <FieldErrorIcon />
                      {errors.confirmPassword}
                    </Field.ErrorText>
                  </Box>
                )}
              </Field.Root>
            )}
          </VStack>
          <Flex p={{ base: 4, md: 8 }} flexDirection={'column'} gap={4}>
            {!isEditing ? (
              <>
                <Button variant={'solid'} width={'100%'} onClick={handleLogoutClick}>
                  {t('generale.logout')}
                </Button>
                <Button variant={'solid'} width={'100%'} onClick={handleEditClick}>
                  {t('generale.modification')}
                </Button>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <Button variant={'solid'} width={'100%'} colorScheme="red">
                      {t('generale.deleteAccount')}
                    </Button>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>{t('generale.deleteAccount')}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          <p>{t('generale.deleteConfirme')}</p>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button>{t('generale.deleteConfirmeNo')}</Button>
                          </Dialog.ActionTrigger>
                          <Button onClick={handleDeleteClick} loading={isDeleting}>
                            {t('generale.deleteConfirmeYes')}
                          </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" position="absolute" top={2} right={2} />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
              </>
            ) : (
              <>
                <Button
                  variant={'solid'}
                  width={'100%'}
                  onClick={handleSaveClick}
                  disabled={!isFormValid()}
                >
                  {t('generale.modificationConfirme')}
                </Button>

                <Button variant={'solid'} width={'100%'} onClick={handleCancelClick}>
                  {t('generale.modificationCancel')}
                </Button>
              </>
            )}
          </Flex>
        </Box>
        <Toaster />
      </Flex>
      <MobileMenu />
    </PageLayout>
  );
};
export default AccountPage;
