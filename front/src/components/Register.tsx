import z from 'zod';
import {
  Box,
  Field,
  Input,
  Button,
  Heading,
  FieldErrorIcon,
  Flex,
  VStack,
  Checkbox,
} from '@chakra-ui/react';
import { PasswordInput } from './ui/password-input';
import RegisterSchema from '../schema/register.schema';
import axios from 'axios';
import { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';
import type { RegisterErrorResponse, RegisterResponse } from '@/types/api.type';
import { toaster } from './ui/toaster';
import { PageLayout } from './layouts/PageLayout';
import homeImage from '../assets/homePageImage.jpg';
import { Link as RouterLink, useNavigate } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import MobileMenu from './MobileMenu';

//Typage Typescript
type RegisterFormValues = z.infer<typeof RegisterSchema>;
type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

//Formulaire
const Register = () => {
  const { t } = useTranslation('auth');

  const [userInfos, setUserInfos] = useState<RegisterFormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isFormValid =
    Object.values(errors).every((error) => error.length === 0) &&
    Object.values(userInfos).every((value) => !!value.trim()) &&
    termsAccepted;

  // fonction de soumission du formulaire
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post<RegisterResponse>(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        userInfos,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      // Traitement de la résponse
      if (response.data.success && response.data.data) {
        toaster.create({
          title: t('register.successTitle'),
          description: t('register.successDescription', {
            username: response.data.data.username,
          }),
          type: 'success',
          duration: 3000,
          closable: true,
        });

        // Vider le formulaire
        setUserInfos({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Redirection vers la page de connexion
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error('User creation failed', response.data.message);
      }
    } catch (error) {
      console.error('error', error);
      // Traitement des erreurs
      if (axios.isAxiosError<RegisterErrorResponse>(error)) {
        const backEndMessage = error.response?.data.message || 'GENERIC';
        const messageKey =
          {
            USERNAME_TAKEN: 'auth:register.errorUsername',
            GENERIC: 'auth:register.defaultError',
          }[backEndMessage] ?? 'auth:register.defaultError';

        const translatedMessage = t(messageKey);

        toaster.create({
          title: t('register.errorTitle'),
          description: translatedMessage,
          type: 'error',
          duration: 6000,
          closable: true,
        });
      } else {
        toaster.create({
          title: t('register.serverErrorTitle'),
          description: t('register.serverErrorDescription'),
          type: 'error',
          duration: 6000,
          closable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordError = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return '';
    if (password != confirmPassword) return t('register.passwordMismatch');
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

    // Sert à créer une validation pour un champ individuel
    const miniSchema = z.object({
      [name]: RegisterSchema.shape[name as keyof RegisterFormValues],
    });

    const result = miniSchema.safeParse({ [name]: value });

    setErrors((prev) => {
      if (!result.success) {
        const flattened = z.flattenError(result.error);
        return {
          ...prev,
          [name]: flattened.fieldErrors[name as keyof RegisterFormValues]?.[0] ?? '',
        };
      }
      // Vérification en temps réel pour confirmPassword
      if (name === 'confirmPassword') {
        return {
          ...prev,
          confirmPassword: getPasswordError(userInfos.password, value),
        };
      }
      return { ...prev, [name]: '' };
    });
  };

  return (
    <PageLayout imageSrc={homeImage} imagePosition="left">
      <Flex justify="center" align="center" height="100%" pt={{ md: 4 }} pb={{ base: 16, md: 2 }}>
        <Box
          as="form"
          onSubmit={handleSubmit}
          borderWidth={{ base: 0, md: 4 }}
          borderRadius={{ base: 0, md: 4 }}
          width={{ base: '40vh', md: '50vh' }}
          height={{ base: '100%', md: 'auto' }}
        >
          <VStack p={{ base: 4, md: 8 }} align="start" width="100%">
            <Heading
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              alignSelf="center"
            >
              {t('register.title')}
            </Heading>
            <Field.Root invalid={!!errors.username} required>
              <Field.Label>
                {t('register.username')}
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name="username"
                placeholder={t('register.usernamePlaceholder')}
                value={userInfos.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Box minH={6}>
                <Field.ErrorText>
                  <FieldErrorIcon />
                  {errors.username}
                </Field.ErrorText>
              </Box>
            </Field.Root>

            <Field.Root invalid={!!errors.email} required>
              <Field.Label>
                {t('register.email')}
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name="email"
                placeholder={t('register.emailPlaceholder')}
                value={userInfos.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Box minH={6}>
                <Field.ErrorText>
                  <FieldErrorIcon />
                  {errors.email}
                </Field.ErrorText>
              </Box>
            </Field.Root>

            <Field.Root invalid={!!errors.password} required>
              <Field.Label>
                {t('register.password')}
                <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                name="password"
                type="password"
                placeholder={t('register.passwordPlaceholder')}
                value={userInfos.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Box minH={6}>
                <Field.ErrorText>
                  <FieldErrorIcon />
                  {errors.password}
                </Field.ErrorText>
              </Box>
            </Field.Root>

            <Field.Root invalid={!!errors.confirmPassword} required>
              <Field.Label>
                {t('register.confirmPassword')}
                <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                name="confirmPassword"
                type="password"
                placeholder={t('register.confirmPasswordPlaceholder')}
                value={userInfos.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Box minH={6}>
                <Field.ErrorText>
                  <FieldErrorIcon />
                  {errors.confirmPassword}
                </Field.ErrorText>
              </Box>
            </Field.Root>
            <VStack align="start" width="100%" gap={6}>
              <Checkbox.Root
                checked={termsAccepted}
                onCheckedChange={(event) => setTermsAccepted(!!event.checked)}
                required
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  <Trans
                    i18nKey="register.acceptTerms"
                    ns="auth"
                    components={{
                      termsLink: (
                        <RouterLink
                          to="/terms"
                          target="_blank"
                          style={{ color: ' #00BCD4', textDecoration: 'underline' }}
                        ></RouterLink>
                      ),
                    }}
                  />
                </Checkbox.Label>
              </Checkbox.Root>
              <Button
                disabled={!isFormValid}
                loading={isSubmitting}
                loadingText={t('register.submitting')}
                width="100%"
                type="submit"
                variant="solid"
              >
                {t('register.submit')}
                <RiArrowRightLine />
              </Button>
              <Box textDecoration="underline" alignSelf="center">
                <RouterLink to="/login">{t('register.alreadyHaveAccount')}</RouterLink>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Flex>
      <MobileMenu />
    </PageLayout>
  );
};

export default Register;
