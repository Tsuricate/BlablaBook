import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import ChangeLanguages from '../ChangeLanguages';
import { PageLayout } from '../layouts/PageLayout';
import homeImage from '../../assets/homePageImage.jpg';
import MobileMenu from '../MobileMenu';
import { Toaster } from '../ui/toaster';
import AccountEditForm from './AccountEditForm';
import DeleteAccountDialog from './DeleteAccountDialog';
import { useAccountForm } from '../../hooks/useAccountForm';
import AccountSection from './AccountSection';
import AccountSettingRow from './AccountSettingRow';
import { LuLogOut, LuSettings2 } from 'react-icons/lu';
import { useAccountActions } from '../../hooks/useAccountActions';
import { useTranslation } from 'react-i18next';

const AccountPage = () => {
  const form = useAccountForm();
  const actions = useAccountActions();
  const { t } = useTranslation('account');
  const { handleLogoutClick } = actions;
  const { user, isEditing, handleEditClick } = form;

  return (
    <PageLayout imageSrc={homeImage} imagePosition="left">
      <Box maxW="760px" w="100%" mx="auto" pt={{ base: 4, md: 24 }} pb={24} px={{ base: 4, md: 6 }}>
        <Flex align="center" gap={6}>
          <Flex
            align="center"
            justify="center"
            flexShrink={0}
            w="104px"
            h="104px"
            borderRadius="full"
            bg="ui.accentSoft"
            color="ui.accentText"
            borderWidth="2px"
            borderColor={{ _light: 'rgba(201,138,46,0.45)', _dark: 'rgba(224,164,88,0.4)' }}
            fontFamily="heading"
            fontSize="5xl"
            fontWeight="semibold"
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Flex>
          <Box minW={0}>
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="semibold"
              letterSpacing="-0.03em"
            >
              {user?.username}
            </Heading>
            <Text color="ui.muted" wordBreak="break-all">
              {user?.email}
            </Text>
          </Box>
        </Flex>

        <AccountSection
          title={t('general.account')}
          boxed
          action={
            !isEditing && (
              <Button
                variant="plain"
                color="ui.accentText"
                px={3}
                h="36px"
                gap={2}
                borderRadius="full"
                _hover={{ bg: 'ui.accentSoft' }}
                onClick={handleEditClick}
              >
                <LuSettings2 />
                {t('general.modification')}
              </Button>
            )
          }
        >
          {isEditing ? (
            <Box p={5}>
              <AccountEditForm form={form} />
            </Box>
          ) : (
            <>
              <AccountSettingRow
                label={t('general.username')}
                value={user?.username ?? ''}
                onClick={handleEditClick}
              />

              <AccountSettingRow
                label={t('general.email')}
                value={user?.email ?? ''}
                onClick={handleEditClick}
              />

              <AccountSettingRow
                label={t('general.password')}
                value="••••••••"
                onClick={handleEditClick}
                last
              />
            </>
          )}
        </AccountSection>

        {!isEditing && (
          <>
            <AccountSection title={t('general.preferences')}>
              <ChangeLanguages />
            </AccountSection>

            <AccountSection title={t('general.session')}>
              <Flex direction="column" gap={3}>
                <Button variant="secondary" width="100%" onClick={handleLogoutClick}>
                  <LuLogOut />
                  {t('general.logout')}
                </Button>
                <DeleteAccountDialog actions={actions} />
              </Flex>
            </AccountSection>
          </>
        )}
      </Box>

      <Toaster />
      <MobileMenu />
    </PageLayout>
  );
};

export default AccountPage;
