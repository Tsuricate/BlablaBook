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
import { PasswordInput } from '../components/ui/password-input';
import LoginSchema from '../schema/login.schema';
import axios from 'axios';
import { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';
import { IoMailOutline } from 'react-icons/io5';
import { TbPasswordUser } from 'react-icons/tb';
import { toaster } from './ui/toaster';
import { PageLayout } from './layouts/PageLayout';
import homeImage from '../assets/homePageImage.jpg';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import MobileMenu from './MobileMenu';
import { useCurrentUser } from '../context/UserContext';

//Typage Typescript
type LoginFormValues = z.infer<typeof LoginSchema>;
type LoginErrorResponse = Partial<Record<keyof LoginFormValues, string>>;

//Formulaire
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

  const isFormInvalid =
    Object.values(errors).every((error) => error.length === 0) &&
    Object.values(userInfos).every((value) => !!value.trim());

  // fonction de soumission du formulaire
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          ...userInfos,
          rememberMe,
        },
        { withCredentials: true }
      );

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
      // Gestion des erreurs (y compris les erreurs lancées par le backend)
      if (axios.isAxiosError(error)) {
        // Erreur HTTP (ex: 401, 500)
        const errorMessage = error.response?.data?.message;

        if (errorMessage === 'INVALID_CREDENTIALS') {
          toaster.create({
            title: t('login.defaultError'),
            description: t('login.error'),
            type: 'error',
            duration: 6000,
            closable: true,
          });
        }
      } else {
        // Erreur inattendue
        toaster.create({
          title: t('login.serverErrorTitle'),
          description: t('login.serverErrorDescription'),
          type: 'error',
          duration: 6000,
          closable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserInfos = {
      ...userInfos,
      [event.target.name]: event.target.value,
    };

    setUserInfos(newUserInfos);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Sert à créer une validation pour un champ individuel
    const miniSchema = z.object({
      [name]: LoginSchema.shape[name as keyof LoginFormValues],
    });

    const result = miniSchema.safeParse({ [name]: value });

    setErrors((prev) => {
      if (!result.success) {
        const flattened = z.flattenError(result.error);
        return {
          ...prev,
          [name]: flattened.fieldErrors[name as keyof LoginFormValues]?.[0] ?? '',
        };
      }
      return { ...prev, [name]: '' };
    });
  };

  return (
    <PageLayout imageSrc={homeImage} imagePosition="left">
      <Flex justify="center" align="center" mt={{ md: '15%' }}>
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
              {t('login.title')}
            </Heading>

            <Field.Root invalid={!!errors.email}>
              <Field.Label>
                <IoMailOutline />
                {t('login.email')}
              </Field.Label>
              <Input
                name="email"
                placeholder={t('login.emailPlaceholder')}
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

            <Field.Root invalid={!!errors.password}>
              <Field.Label>
                <TbPasswordUser />
                {t('login.password')}
              </Field.Label>
              <PasswordInput
                name="password"
                type="password"
                placeholder={t('login.passwordPlaceholder')}
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
            <VStack align="start" width="100%" gap={6}>
              <Checkbox.Root
                checked={rememberMe}
                onCheckedChange={(e) => setRememberMe(!!e.checked)}
              >
                <Checkbox.HiddenInput name="rememberMe" />
                <Checkbox.Control />
                <Checkbox.Label>{t('login.rememberMe')}</Checkbox.Label>
              </Checkbox.Root>

              <Button
                disabled={!isFormInvalid}
                loading={isSubmitting}
                loadingText={t('login.submitting')}
                type="submit"
                width="100%"
                variant="solid"
              >
                {t('login.submit')}
                <RiArrowRightLine />
              </Button>
              <Box textDecoration="underline" alignSelf="center">
                <RouterLink to="/register">{t('login.needAnAccount')}</RouterLink>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Flex>
      <MobileMenu />
    </PageLayout>
  );
};

export default Login;
