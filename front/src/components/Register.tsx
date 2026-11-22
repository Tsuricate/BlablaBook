import { Link as RouterLink } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Checkbox, VStack } from '@chakra-ui/react';
import { RiArrowRightLine } from 'react-icons/ri';
import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import AuthCard from './AuthCard';
import FormField from './FormField';
import { useRegisterForm } from '../hooks/useRegisterForm';
import homeImage from '../assets/homePageImage.jpg';

const Register = () => {
  const { t } = useTranslation('auth');

  const {
    userInfos,
    errors,
    isSubmitting,
    termsAccepted,
    setTermsAccepted,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useRegisterForm();

  return (
    <PageLayout imageSrc={homeImage} imagePosition="left">
      <AuthCard
        title={t('register.title')}
        subtitle={t('register.subtitle')}
        onSubmit={handleSubmit}
        footer={<RouterLink to="/login">{t('register.alreadyHaveAccount')}</RouterLink>}
      >
        <VStack align="start" width="100%">
          <FormField
            name="username"
            label={t('register.username')}
            value={userInfos.username}
            placeholder={t('register.usernamePlaceholder')}
            error={errors.username}
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormField
            name="email"
            label={t('register.email')}
            value={userInfos.email}
            placeholder={t('register.emailPlaceholder')}
            error={errors.email}
            type="email"
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormField
            name="password"
            label={t('register.password')}
            value={userInfos.password}
            placeholder={t('register.passwordPlaceholder')}
            error={errors.password}
            type="password"
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormField
            name="confirmPassword"
            label={t('register.confirmPassword')}
            value={userInfos.confirmPassword}
            placeholder={t('register.confirmPasswordPlaceholder')}
            error={errors.confirmPassword}
            type="password"
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <VStack align="start" width="100%" gap={6}>
            <Checkbox.Root
              checked={termsAccepted}
              onCheckedChange={(event) => setTermsAccepted(!!event.checked)}
              required
              colorPalette="orange"
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
                        style={{
                          color: 'var(--chakra-colors-ui-accent-text)',
                          textDecoration: 'underline',
                        }}
                      />
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
              variant="primary"
            >
              {t('register.submit')}
              <RiArrowRightLine />
            </Button>
          </VStack>
        </VStack>
      </AuthCard>

      <MobileMenu />
    </PageLayout>
  );
};

export default Register;
