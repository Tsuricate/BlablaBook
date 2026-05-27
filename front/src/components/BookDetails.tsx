import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Box,
  Collapsible,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Skeleton,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import bookDetail from '../assets/bookDetail.webp';
import AppBreadcrumb from './AppBreadcrumb';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { getBookImageByScreen } from '../utils/bookUtils';
import { useTruncatedTitle } from '../utils/stringUtils';
import { useTranslation } from 'react-i18next';
import noBookCover from '../assets/noBookCover.jpg';
import type { Book, Status } from '../types/book';
import { axiosAuth } from '../utils/axiosAuth';
import AddBookActions from './AddBookActions';
import EditBookActions from './EditBookActions';
import { useCurrentUser } from '../context/UserContext';
import ExpandableDescription from './ui/EnableDescrition';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [bookLoading, setBookLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const { t } = useTranslation(['book', 'common']);
  const { isLoggedIn } = useCurrentUser();

  const imageSrc = book ? getBookImageByScreen(book.imageLinks) : null;
  const hasRealImage = !!imageSrc;
  const showSkeleton = bookLoading || (hasRealImage && !imageLoaded);
  const visibleCategories = showAllCategories ? book?.categories : book?.categories?.slice(0, 3);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await axiosAuth.get(`${import.meta.env.VITE_API_URL}/api/books/${id}`);
        setBook(res.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setBookLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const updateBookStatusLocally = (status: Status) => {
    setBook((prev) => (prev ? { ...prev, status } : prev));
  };

  return (
    <PageLayout imageSrc={bookDetail} imagePosition="left">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        height="100%"
        mt={{ base: '-100px', md: '40px' }}
        gap={8}
        transform={{ base: 'translateY(0)', md: `translateX(-${25 * 0.5}vw)` }}
        pb={{ base: 20, md: 2 }}
      >
        <Box flexShrink={0} width={{ sm: 'calc(10vw * 0.5)', md: 'calc(55vw * 0.4)' }}>
          {showSkeleton && (
            <Skeleton
              width={{ base: '180px', sm: '200px', md: '100%' }}
              h={{ base: '220px', md: 'auto' }}
            />
          )}

          {hasRealImage && (
            <Image
              src={imageSrc}
              alt={t('details.coverAlt')}
              borderRadius="md"
              boxShadow="xl"
              width={{ base: '180px', sm: '200px', md: '100%' }}
              height="auto"
              opacity={imageLoaded ? 1 : 0}
              transition="opacity 0.3s ease"
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {!hasRealImage && book && (
            <Image
              src={noBookCover}
              alt="no cover"
              borderRadius="md"
              boxShadow="xl"
              width={{ base: '180px', sm: '200px', md: '100%' }}
              height="auto"
            />
          )}
        </Box>

        <Box flex="1" pt={{ base: 4, md: 0 }} alignContent={{ md: 'center' }} height="100%">
          <Stack gap={2}>
            <AppBreadcrumb
              items={[
                { label: t('breadcrumb.home'), to: '/' },
                { label: t('breadcrumb.category'), to: '/books' },
                { label: useTruncatedTitle(book?.title) },
              ]}
            />
            <Text fontSize="3xl" fontWeight="bold">
              {book?.title}
            </Text>
            <HStack>
              <Text fontSize="xl" color={{ _light: 'brown.800', _dark: 'light.500' }}>
                {book?.authors?.join(', ')}
              </Text>
            </HStack>

            {book && !isLoggedIn && <AddBookActions book={book} variant="button" />}

            {book && isLoggedIn && !book.status && (
              <AddBookActions
                book={book}
                variant="button"
                onStatusChange={updateBookStatusLocally}
              />
            )}

            {book && isLoggedIn && book.status && (
              <EditBookActions
                book={book}
                variant="button"
                onStatusChange={updateBookStatusLocally}
              />
            )}

            <HStack mt={2} flexWrap="wrap" fontWeight="semibold">
              {visibleCategories?.map((category) => (
                <Tag.Root
                  key={category}
                  px={3}
                  py={1}
                  variant="subtle"
                  borderRadius="xl"
                  color={{ _light: 'light.50', _dark: 'light.100' }}
                  bg={{ _light: 'light.600', _dark: 'gray.850' }}
                  backgroundImage={{
                    _light: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,0,0,0.03))',
                    _dark: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(0,0,0,0.18))',
                  }}
                  border="1px solid"
                  borderColor={{
                    _light: 'white',
                    _dark: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <Tag.Label>{category}</Tag.Label>
                </Tag.Root>
              ))}

              {book?.categories && book.categories.length > 3 && (
                <Tag.Root
                  variant="solid"
                  bg={{ _light: 'light.600', _dark: 'gray.850' }}
                  color={{ _light: 'light.50', _dark: 'light.100' }}
                  borderRadius="xl"
                  cursor="pointer"
                  backgroundImage={{
                    _light: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,0,0,0.03))',
                    _dark: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(0,0,0,0.18))',
                  }}
                  px={3}
                  py={1}
                  onClick={() => setShowAllCategories((prev) => !prev)}
                >
                  <Tag.Label>
                    {' '}
                    {showAllCategories
                      ? t('common:categories.showLess')
                      : t('common:categories.showAll')}
                  </Tag.Label>
                </Tag.Root>
              )}
            </HStack>
            <Stack mt={4}>
              <Text fontWeight="bold">{t('details.description')}</Text>
              <ExpandableDescription html={book?.description} />

              <Collapsible.Root
                open={isDetailsOpen}
                onOpenChange={(event) => setIsDetailsOpen(event.open)}
              >
                <Collapsible.Trigger asChild>
                  <Flex align="center" justify="space-between" cursor="pointer" py={3}>
                    <Text fontWeight="bold">{t('details.technicalDetails')}</Text>
                    <Icon>{isDetailsOpen ? <IoChevronUp /> : <IoChevronDown />}</Icon>
                  </Flex>
                </Collapsible.Trigger>

                <Collapsible.Content>
                  <Grid
                    templateColumns={{ base: 'repeat(2, auto)', md: 'repeat(4, auto)' }}
                    gap={4}
                  >
                    <GridItem>
                      <Text fontWeight="bold">{t('details.language')} :</Text>
                      <Text>{book?.language ?? '–'}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">{t('details.pageCount')} :</Text>
                      <Text>{book?.pageCount ?? '–'}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">{t('details.publisher')} :</Text>
                      <Text>{book?.publisher ?? '–'}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">ISBN-13 :</Text>
                      <Text>{book?.isbn10 ?? '–'}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">ISBN-10 :</Text>
                      <Text>{book?.isbn13 ?? '–'}</Text>
                    </GridItem>
                  </Grid>
                </Collapsible.Content>
              </Collapsible.Root>
            </Stack>
          </Stack>
        </Box>
      </Flex>

      <MobileMenu />
    </PageLayout>
  );
};

export default BookDetails;
