import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../context/UserContext';
import { toaster } from '../components/ui/toaster';
import { axiosAuth } from '../utils/axiosAuth';

export const useAccountActions = () => {
  const { t } = useTranslation('account');
  const { user, logout } = useCurrentUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    if (!user?.id) {
      toaster.error({
        title: t('errors.title'),
        description: t('errors.userNotFound'),
        duration: 5000,
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axiosAuth.delete(`/auth/users/${user.id}`);
      if (response.data.success) {
        logout();
        toaster.success({
          title: t('success.deleteSuccess'),
          description: t('success.deleteSuccessDescription'),
        });
      } else {
        console.error('Error deleting account:', response.data.message);
      }
    } catch (error) {
      toaster.error({
        title: t('errors.title'),
        description: t('errors.errorsDeleteAccount'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      const response = await axiosAuth.post('/auth/logout');
      if (!response.data.success) {
        console.error('Error logging out:', response.data.message);
        return;
      }
      logout();
      toaster.success({
        title: t('deconnect.title'),
        description: t('deconnect.description'),
      });
    } catch (error) {
      toaster.error({
        title: t('errors.title'),
        description: t('errors.generic'),
      });
    }
  };

  return { isDeleting, handleDeleteClick, handleLogoutClick };
};

export type AccountActions = ReturnType<typeof useAccountActions>;
