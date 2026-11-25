import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { Book, Status } from '../types/book';
import {
  Box,
  Collapsible,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Tag,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import AppBreadcrumb from './AppBreadcrumb';
import ExpandableDescription from './ExpandableDescription';

import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { BookCoverPlaceholder } from './BookCoverPlaceholder';
import bookDetail from '../assets/bookDetail.webp';

import { getBookImageByScreen } from '../utils/bookUtils';
import { axiosAuth } from '../utils/axiosAuth';
import { useTruncatedTitle } from '../utils/stringUtils';
import BookLibraryActions from './BookLibraryActions';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [bookLoading, setBookLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const { t } = useTranslation(['book', 'common']);

  const imageSrc = book ? getBookImageByScreen(book.imageLinks) : null;
  const hasRealImage = !!imageSrc;
  const showSkeleton = bookLoading || (hasRealImage && !imageLoaded);
  const visibleCategories = showAllCategories ? book?.categories : book?.categories?.slice(0, 3);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await axiosAuth.get(`/books/${id}`);
        setBook({
          ...res.data,
          startedAt: res.data.startedAt ? new Date(res.data.startedAt) : undefined,
          finishedAt: res.data.finishedAt ? new Date(res.data.finishedAt) : undefined,
        });
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
  const updateBookRatingLocally = (rating: number) => {
    setBook((prev) => (prev ? { ...prev, rating } : prev));
  };
  const updateBookReadingDatesLocally = (startedAt?: Date, finishedAt?: Date) => {
    setBook((prev) => (prev ? { ...prev, startedAt, finishedAt } : prev));
  };

  return (
    <PageLayout imageSrc={bookDetail} imagePosition="left">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        height="100%"
        mt={{ base: '-100px', md: '40px' }}
        transform={{ base: 'translateY(0)', md: `translateX(-${25 * 0.5}vw)` }}
        pb={{ base: 20, md: 2 }}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'stretch' }}
          w="100%"
          flex={{ md: 1 }}
          minW={0}
          minH={{ md: '30rem' }}
          gap={8}
        >
          <Box
            flexShrink={0}
            alignSelf={{ md: 'center' }}
            width={{ sm: 'calc(10vw * 0.5)', md: 'calc(55vw * 0.4)' }}
          >
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
              <Box
                width={{ base: '180px', sm: '200px', md: '100%' }}
                aspectRatio={2 / 3}
                boxShadow="xl"
                borderRadius="md"
                overflow="hidden"
              >
                <BookCoverPlaceholder title={book.title} />
              </Box>
            )}
          </Box>

          <Box
            position="relative"
            flex="1"
            minW={0}
            w={{ base: '100%', md: 'auto' }}
            pt={{ base: 4, md: 0 }}
          >
            <Flex
              direction="column"
              gap={2}
              position={{ base: 'static', md: 'absolute' }}
              inset={{ md: 0 }}
              overflowY={{ md: 'auto' }}
              css={{ scrollbarWidth: 'thin' }}
            >
              <AppBreadcrumb
                items={[
                  { label: t('breadcrumb.home'), to: '/' },
                  { label: t('breadcrumb.category'), to: '/books' },
                  { label: useTruncatedTitle(book?.title) },
                ]}
              />
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '4xl' }}
                fontWeight="semibold"
                letterSpacing="-0.02em"
                lineHeight="1.15"
              >
                {book?.title}
              </Heading>
              <HStack>
                <Text fontSize={{ base: 'lg', md: 'xl' }} color="ui.muted">
                  {book?.authors?.join(', ')}
                </Text>
              </HStack>

              {book && (
                <BookLibraryActions
                  book={book}
                  onStatusChange={updateBookStatusLocally}
                  onRatingChange={updateBookRatingLocally}
                  onReadingDatesChange={updateBookReadingDatesLocally}
                />
              )}

              <HStack mt={2} flexWrap="wrap">
                {visibleCategories?.map((category) => (
                  <Tag.Root
                    key={category}
                    px={3.5}
                    py={1.5}
                    variant="subtle"
                    borderRadius="full"
                    bg="ui.accentSoft"
                    color="ui.accentText"
                    borderWidth="1px"
                    borderColor={{ _light: 'rgba(201,138,46,0.45)', _dark: 'rgba(224,164,88,0.4)' }}
                    fontWeight="semibold"
                    fontSize="sm"
                  >
                    <Tag.Label>{category}</Tag.Label>
                  </Tag.Root>
                ))}

                {book?.categories && book.categories.length > 3 && (
                  <Tag.Root
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="transparent"
                    color="ui.accentText"
                    borderWidth="1px"
                    borderColor={{ _light: 'rgba(201,138,46,0.45)', _dark: 'rgba(224,164,88,0.4)' }}
                    fontWeight="semibold"
                    cursor="pointer"
                    onClick={() => setShowAllCategories((prev) => !prev)}
                  >
                    <Tag.Label>
                      {showAllCategories
                        ? t('common:categories.showLess')
                        : t('common:categories.showAll')}
                    </Tag.Label>
                  </Tag.Root>
                )}
              </HStack>

              <Flex direction="column" flex={{ md: 1 }} minH={0} mt={4} gap={3}>
                <Heading as="h2" fontSize="lg" fontWeight="semibold">
                  {t('details.description')}
                </Heading>

                <ExpandableDescription html={book?.description} />

                <Box flexShrink={0}>
                  <Collapsible.Root
                    open={isDetailsOpen}
                    onOpenChange={(event) => setIsDetailsOpen(event.open)}
                  >
                    <Box
                      bg="ui.raised"
                      borderWidth="1px"
                      borderColor="ui.border"
                      borderRadius="xl"
                      overflow="hidden"
                    >
                      <Collapsible.Trigger asChild>
                        <Flex
                          as="button"
                          w="100%"
                          align="center"
                          justify="space-between"
                          px={4}
                          py={3}
                          cursor="pointer"
                          outline="none"
                          transition="background-color 0.2s ease"
                          _hover={{ bg: { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } }}
                          _focusVisible={{
                            outline: '2px solid',
                            outlineColor: 'ui.accent',
                            outlineOffset: '-2px',
                          }}
                        >
                          <Text fontWeight="semibold">{t('details.technicalDetails')}</Text>
                          <Icon color="ui.muted">
                            {isDetailsOpen ? <IoChevronUp /> : <IoChevronDown />}
                          </Icon>
                        </Flex>
                      </Collapsible.Trigger>

                      <Collapsible.Content>
                        <Grid
                          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
                          gap={4}
                          px={4}
                          pb={4}
                          pt={3}
                          borderTopWidth="1px"
                          borderColor="ui.border"
                        >
                          {[
                            { label: t('details.language'), value: book?.language },
                            { label: t('details.pageCount'), value: book?.pageCount },
                            { label: t('details.publisher'), value: book?.publisher },
                            { label: 'ISBN-13', value: book?.isbn13 },
                            { label: 'ISBN-10', value: book?.isbn10 },
                          ].map(({ label, value }) => (
                            <Box key={label} minW={0}>
                              <Text
                                fontSize="xs"
                                color="ui.muted"
                                textTransform="uppercase"
                                letterSpacing="0.06em"
                              >
                                {label}
                              </Text>
                              <Text mt={0.5} wordBreak="break-word">
                                {value ?? '–'}
                              </Text>
                            </Box>
                          ))}
                        </Grid>
                      </Collapsible.Content>
                    </Box>
                  </Collapsible.Root>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <MobileMenu />
    </PageLayout>
  );
};

export default BookDetails;
