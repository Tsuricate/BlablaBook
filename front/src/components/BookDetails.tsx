import { useEffect, useState } from 'react';
import axios from 'axios';
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
  VStack,
} from '@chakra-ui/react';
import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import bookDetail from '../assets/bookDetail.webp';
import AppBreadcrumb from './AppBreadcrumb';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { renderDescription } from '../utils/htmlParser';
import { getBookImageByScreen } from '../utils/bookUtils';
import { useTruncatedTitle } from '../utils/stringUtils';
import { useTranslation } from 'react-i18next';
import noBookCover from '../assets/noBookCover.jpg';
import type { Book } from '../types/book';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [bookLoading, setBookLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useTranslation('book');

  const imageSrc = book ? getBookImageByScreen(book.imageLinks) : null;
  const hasRealImage = !!imageSrc;
  const showSkeleton = bookLoading || (hasRealImage && !imageLoaded);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/books/${id}`);
        setBook(res.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setBookLoading(false);
      }
    };
    fetchBook();
  }, [id]);

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
        <Box flexShrink={0} width={{ sm: 'calc(10vw * 0.5)', md: 'calc(50vw * 0.4)' }}>
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
              <Text fontSize="xl" color="gray.500">
                {book?.authors?.join(', ')}
              </Text>
            </HStack>

            <VStack align="start" gap={4} mt={2}>
              <HStack>
                {book?.categories?.map((category) => (
                  <Tag.Root key={category} variant="solid" rounded="full" px={3} py={1}>
                    <Tag.Label>{category}</Tag.Label>
                  </Tag.Root>
                ))}
              </HStack>
            </VStack>
            <Stack mt={4}>
              <Text fontWeight="bold">{t('details.description')}</Text>
              <Text>{renderDescription(book?.description)}</Text>

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
