import { Button, Dialog, Portal } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { AccountActions } from '../../hooks/useAccountActions';
import DialogShell from '../DialogShell';

type DeleteAccountDialogProps = {
  actions: AccountActions;
};

const DeleteAccountDialog = ({ actions }: DeleteAccountDialogProps) => {
  const { t } = useTranslation('account');
  const { isDeleting, handleDeleteClick } = actions;

  return (
    <Dialog.Root placement="center">
      <Dialog.Trigger asChild>
        <Button variant="danger" width="100%">
          {t('general.deleteAccount')}
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <DialogShell
            title={t('general.deleteAccount')}
            footer={
              <>
                <Dialog.ActionTrigger asChild>
                  <Button variant="secondary">{t('general.deleteConfirmeNo')}</Button>
                </Dialog.ActionTrigger>

                <Button variant="danger" onClick={handleDeleteClick} loading={isDeleting}>
                  {t('general.deleteConfirmeYes')}
                </Button>
              </>
            }
          >
            {t('general.deleteConfirme')}
          </DialogShell>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default DeleteAccountDialog;
