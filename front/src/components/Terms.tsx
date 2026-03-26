import { Box, Heading, Text, Stack, List, Icon, Button } from '@chakra-ui/react';
import { FaBook } from 'react-icons/fa';
import { PageLayout } from './layouts/PageLayout';
import homeImage from '../assets/homePageImage.jpg';
import MobileMenu from './MobileMenu';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation('terms');

  return (
    <PageLayout imageSrc={homeImage}>
      <Box my={8} px={{ base: 4, md: 8 }} py={8} borderRadius="lg" boxShadow="md">
        <Stack gap={6}>
          {/* En-tête */}
          <Box textAlign="center" textDecoration={'underline'}>
            <Icon as={FaBook} boxSize={10} color="blue.500" mb={2} />
            <Heading size={{ base: '2xl', md: '4xl' }} fontWeight={{ base: 'sm', md: 'md' }} mb={2}>
              {t('cgu.title')}
            </Heading>
            <Text fontWeight={{ base: 'sm', md: 'md' }}>{t('cgu.subtitle')}</Text>
          </Box>

          {/* Article 1 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article1.title')}
            </Heading>
            <Text mb={2}>{t('articles.article1.content')}</Text>
          </Box>

          {/* Article 2 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article2.title')}
            </Heading>
            <Text mb={2}>{t('articles.article2.content1')}</Text>
            <Text mb={2}>{t('articles.article2.content2')}</Text>
            <Text>{t('articles.article2.contact')}</Text>
            <Text mt={1}>{t('articles.article2.email')}</Text>
          </Box>

          {/* Article 3 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article3.title')}
            </Heading>
            <Text>{t('articles.article3.content')}</Text>
          </Box>

          {/* Article 4 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article4.title')}
            </Heading>
            <Text mb={2}>{t('articles.article4.content1')}</Text>
            <List.Root pl={4}>
              {(t('articles.article4.list', { returnObjects: true }) as Array<string>).map(
                (item: string, index: number) => (
                  <List.Item key={index}>{item}</List.Item>
                )
              )}
            </List.Root>
            <Text mt={3}>{t('articles.article4.content2')}</Text>
          </Box>

          {/* Article 5 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article5.title')}
            </Heading>
            <Text mb={2}>{t('articles.article5.content1')}</Text>
            <List.Root pl={4}>
              {(t('articles.article5.list', { returnObjects: true }) as Array<string>).map(
                (item: string, index: number) => (
                  <List.Item key={index}>{item}</List.Item>
                )
              )}
            </List.Root>
            <Text mt={3}>{t('articles.article5.content2')}</Text>
          </Box>

          {/* Article 6 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article6.title')}
            </Heading>
            <Text mb={2}>{t('articles.article6.content1')}</Text>
            <List.Root pl={4}>
              {(t('articles.article6.list', { returnObjects: true }) as Array<string>).map(
                (item: string, index: number) => (
                  <List.Item key={index}>{item}</List.Item>
                )
              )}
            </List.Root>
            <Text mt={3}>{t('articles.article6.content2')}</Text>
          </Box>

          {/* Article 7 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article7.title')}
            </Heading>
            <Text mb={2}>{t('articles.article7.content1')}</Text>
            <List.Root pl={4}>
              {(t('articles.article7.list1', { returnObjects: true }) as Array<string>).map(
                (item: string, index: number) => (
                  <List.Item key={index}>{item}</List.Item>
                )
              )}
            </List.Root>
            <Text mt={3}>{t('articles.article7.content2')}</Text>
            <Text mt={3}>{t('articles.article7.content3')}</Text>
            <List.Root pl={4}>
              {(t('articles.article7.list2', { returnObjects: true }) as Array<string>).map(
                (item: string, index: number) => (
                  <List.Item key={index}>{item}</List.Item>
                )
              )}
            </List.Root>
            <Text mt={3}>{t('articles.article7.content4')}</Text>
          </Box>

          {/* Article 8 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article8.title')}
            </Heading>
            <Text mb={2}>{t('articles.article8.content1')}</Text>
            <Text>{t('articles.article8.content2')}</Text>
          </Box>

          {/* Article 9 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article9.title')}
            </Heading>
            <Text mb={2}>{t('articles.article9.content1')}</Text>
            <List.Root pl={4}>
              {(t('articles.article9.list', { returnObjects: true }) as Array<string>).map(
                (item: string, index: number) => (
                  <List.Item key={index}>{item}</List.Item>
                )
              )}
            </List.Root>
            <Text mt={3}>{t('articles.article9.content2')}</Text>
          </Box>

          {/* Article 10 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article10.title')}
            </Heading>
            <Text mb={2}>{t('articles.article10.content1')}</Text>
            <Text>{t('articles.article10.content2')}</Text>
          </Box>

          {/* Article 11 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article11.title')}
            </Heading>
            <Text mb={2}>{t('articles.article11.content1')}</Text>
            <List.Root pl={4}>
              {(t('articles.article11.list', { returnObjects: true }) as Array<string>).map(
                (item: string, index: number) => (
                  <List.Item key={index}>{item}</List.Item>
                )
              )}
            </List.Root>
            <Text mt={3}>{t('articles.article11.content2')}</Text>
          </Box>

          {/* Article 12 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article12.title')}
            </Heading>
            <Text>{t('articles.article12.content')}</Text>
          </Box>

          {/* Article 13 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article13.title')}
            </Heading>
            <Text>{t('articles.article13.content')}</Text>
          </Box>

          {/* Article 14 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              {t('articles.article14.title')}
            </Heading>
            <Text>{t('articles.article14.content')}</Text>
          </Box>

          <Button asChild width="100%" variant="solid">
            <RouterLink to="/register">{t('buttons.back')}</RouterLink>
          </Button>
        </Stack>
      </Box>
      <MobileMenu />
    </PageLayout>
  );
};

export default Terms;
