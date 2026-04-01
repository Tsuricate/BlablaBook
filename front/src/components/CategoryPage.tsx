import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Stack, Text, Spinner, Center, Button, HStack } from '@chakra-ui/react';
import axios from 'axios';

import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import BookCardList from './BookCardList';

import homeImage from '../assets/homePageImage.jpg';
import type { Book } from '../types/book';
import { CATEGORIES } from '../utils/categories';
import i18n from '../i18n';

interface CategoryBooksResponse {
  category: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  books: Book[];
}

const LIMIT = 20;

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const language = i18n.language.split('-')[0];

  const { t } = useTranslation(['common', 'book']);

  const categoryConfig = CATEGORIES.find((categoryItem) => categoryItem.slug === category);
  const categoryLabel = categoryConfig
    ? t(`book:categories.list.${categoryConfig.key}`)
    : t('book:categories.categoryNotFound');

  useEffect(() => {
    if (!categoryConfig) {
      setNotFound(true);
      setLoading(false);
      setBooks([]);
      return;
    }

    setLoading(true);
    setNotFound(false);

    const params = {
      limit: LIMIT,
      page,
      lang: language,
      ...(search && { search }),
    };

    axios
      .get<CategoryBooksResponse>(
        `${import.meta.env.VITE_API_URL}/api/categories/${categoryConfig.key}`,
        { params }
      )
      .then((res) => {
        setBooks(res.data.books);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true);
        }
        setBooks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryConfig, page, search]);

  const handleSearchSubmit = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  return (
    <PageLayout imageSrc={homeImage}>
      <Stack gap={6} pb={{ base: 20, md: 2 }}>
        {categoryConfig && (
          <Text fontSize="2xl" fontWeight="bold">
            {categoryLabel}
          </Text>
        )}

        <SearchBar
          searchValue={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSubmit={handleSearchSubmit}
          onClear={handleSearchClear}
        />

        {loading && (
          <Center py={10}>
            <Spinner size="lg" />
          </Center>
        )}

        {!loading && notFound && (
          <Center py={10}>
            <Text color="brown.600">{t('book:categories.categoryNotFound')}</Text>
          </Center>
        )}

        {!loading && !notFound && books.length === 0 && (
          <Center py={10}>
            <Text color="brown.600">{t('book:categories.noBooksInCategory')}</Text>
          </Center>
        )}

        {!loading && books.length > 0 && (
          <>
            <Text>{t('categories.booksCount', { count: Number(total) || 0 })}</Text>

            <BookCardList books={books} wrap />

            {totalPages > 1 && (
              <HStack justify="center" gap={2}>
                <Button
                  size="sm"
                  variant="category"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  {t('common:previous')}
                </Button>
                <Text fontSize="sm">
                  {t('common:page')} {page} / {totalPages}
                </Text>
                <Button
                  size="sm"
                  variant="category"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t('common:next')}
                </Button>
              </HStack>
            )}
          </>
        )}
      </Stack>

      <MobileMenu />
    </PageLayout>
  );
};

export default CategoryPage;
