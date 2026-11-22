import { Box, Button, Flex, VStack } from '@chakra-ui/react';
import type { AccountForm } from '../../hooks/useAccountForm';
import { useTranslation } from 'react-i18next';
import FormField from '../FormField';

type AccountEditFormProps = {
  form: AccountForm;
};

const AccountEditForm = ({ form }: AccountEditFormProps) => {
  const {
    formData,
    initialFormData,
    errors,
    isFormValid,
    handleChange,
    handleBlur,
    handleSaveClick,
    handleCancelClick,
  } = form;

  const { t } = useTranslation('account');

  return (
    <Box as="form" onSubmit={(event) => event.preventDefault()}>
      <VStack align="start" width="100%" gap={0} mb={4}>
        <FormField
          name="username"
          label={t('general.username')}
          value={formData.username}
          placeholder={initialFormData.username}
          error={errors.username}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormField
          name="email"
          label={t('general.email')}
          value={formData.email}
          placeholder={initialFormData.email}
          error={errors.email}
          type="email"
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormField
          name="password"
          label={t('general.password')}
          value={formData.password}
          placeholder="Nouveau mot de passe"
          error={errors.password}
          type="password"
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormField
          name="confirmPassword"
          label={t('general.confirmPassword')}
          value={formData.confirmPassword}
          placeholder="Nouveau mot de passe"
          error={errors.confirmPassword}
          type="password"
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </VStack>

      <Flex direction="column" gap={3}>
        <Button variant="primary" width="100%" onClick={handleSaveClick} disabled={!isFormValid()}>
          {t('general.modificationConfirme')}
        </Button>

        <Button variant="secondary" width="100%" onClick={handleCancelClick}>
          {t('general.modificationCancel')}
        </Button>
      </Flex>
    </Box>
  );
};

export default AccountEditForm;
