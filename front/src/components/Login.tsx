import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import axios from 'axios';
import z from 'zod';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../context/UserContext';
import { Box, Field, Input, Button, FieldErrorIcon, VStack, Checkbox } from '@chakra-ui/react';
import { PageLayout } from './layouts/PageLayout';
import AuthCard from './AuthCard';
import MobileMenu from './MobileMenu';
import { toaster } from './ui/toaster';
import { PasswordInput } from '../components/ui/password-input';
import { RiArrowRightLine } from 'react-icons/ri';
import LoginSchema from '../schema/login.schema';
import homeImage from '../assets/homePageImage.jpg';
import { initCsrf } from '../utils/csrf';

type LoginFormValues = z.infer<typeof LoginSchema>;
type LoginErrorResponse = Partial<Record<keyof LoginFormValues, string>>;

const Login = () => {
  const { t } = useTranslation('auth');
  const { setUser } = useCurrentUser();

  const [userInfos, setUserInfos] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrorResponse>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const isFormValid = LoginSchema.safeParse(userInfos).success;

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        '/api/auth/login',
        {
          ...userInfos,
          rememberMe,
        },
        { withCredentials: true }
      );
      await initCsrf();

      setUser(response.data.data);

      if (response.data.success && response.data.data) {
        setUserInfos({
          email: '',
          password: '',
        });

        navigate('/');
      } else {
        console.error('Logging in failed', response.data.message);
      }
    } catch (error) {
      console.error('Error :', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;

        if (errorMessage === 'INVALID_CREDENTIALS') {
          toaster.error({
            title: t('login.defaultError'),
            description: t('login.error'),
          });
        }
      } else {
        toaster.error({
          title: t('login.serverErrorTitle'),
          description: t('login.serverErrorDescription'),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateField = (name: keyof LoginFormValues, value: string): string => {
    const result = LoginSchema.shape[name].safeParse(value);
    return result.success ? '' : (result.error.issues[0]?.message ?? '');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof LoginFormValues;
    const { value } = event.target;

    setUserInfos((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => (prev[name] ? { ...prev, [name]: validateField(name, value) } : prev));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof LoginFormValues;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, event.target.value) }));
  };

  return (
    <PageLayout imageSrc={homeImage} imagePosition="left">
      <AuthCard
        title={t('login.title')}
        subtitle={t('login.subtitle')}
        onSubmit={handleSubmit}
        footer={<RouterLink to="/register">{t('login.needAnAccount')}</RouterLink>}
      >
        <VStack align="start" width="100%">
          <Field.Root invalid={!!errors.email}>
            <Field.Label>{t('login.email')}</Field.Label>
            <Input
              name="email"
              placeholder={t('login.emailPlaceholder')}
              value={userInfos.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Box minH={5}>
              <Field.ErrorText>
                <FieldErrorIcon />
                {errors.email}
              </Field.ErrorText>
            </Box>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>{t('login.password')}</Field.Label>
            <PasswordInput
              name="password"
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              value={userInfos.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Box minH={5}>
              <Field.ErrorText>
                <FieldErrorIcon />
                {errors.password}
              </Field.ErrorText>
            </Box>
          </Field.Root>

          <VStack align="start" width="100%" gap={6}>
            <Checkbox.Root checked={rememberMe} onCheckedChange={(e) => setRememberMe(!!e.checked)}>
              <Checkbox.HiddenInput name="rememberMe" />
              <Checkbox.Control />
              <Checkbox.Label>{t('login.rememberMe')}</Checkbox.Label>
            </Checkbox.Root>

            <Button
              disabled={!isFormValid}
              loading={isSubmitting}
              loadingText={t('login.submitting')}
              type="submit"
              width="100%"
              variant="primary"
            >
              {t('login.submit')}
              <RiArrowRightLine />
            </Button>
          </VStack>
        </VStack>
      </AuthCard>
      <MobileMenu />
    </PageLayout>
  );
};

export default Login;
