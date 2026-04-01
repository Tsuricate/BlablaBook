import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Stack, Text, Spinner, Center, Button, HStack } from '@chakra-ui/react';
import axios from 'axios';

import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import BookCardList from './BookCardList';

import homeImage from '../assets/homePageImage.jpg';
import type { Book } from '../types/book';

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
  const [categoryName, setCategoryName] = useState('');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    setNotFound(false);

    const params: Record<string, string | number> = { limit: LIMIT, page };
    if (search) params.search = search;

    axios
      .get<CategoryBooksResponse>(`${import.meta.env.VITE_API_URL}/api/categories/${category}`, { params })
      .then((res) => {
        setBooks(res.data.books);
        setCategoryName(res.data.category);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true);
        }
        setBooks([]);
      })
      .finally(() => setLoading(false));
  }, [category, page, search]);

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
    <PageLayout imageSrc={homeImage} imagePosition="top">
      <Stack gap={6} pb={{ base: 20, md: 2 }}>
        {categoryName && (
          <Text fontSize="2xl" fontWeight="bold">
            {categoryName}
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
            <Text color="brown.600">Catégorie introuvable.</Text>
          </Center>
        )}

        {!loading && !notFound && books.length === 0 && (
          <Center py={10}>
            <Text color="brown.600">Aucun livre trouvé pour cette catégorie.</Text>
          </Center>
        )}

        {!loading && books.length > 0 && (
          <>
            <Text fontSize="sm" color="brown.600">
              {total} livre{total > 1 ? 's' : ''}
            </Text>

            <BookCardList books={books} wrap />

            {totalPages > 1 && (
              <HStack justify="center" gap={2}>
                <Button
                  size="sm"
                  variant={"category" as never}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Précédent
                </Button>
                <Text fontSize="sm">
                  Page {page} / {totalPages}
                </Text>
                <Button
                  size="sm"
                  variant={"category" as never}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant
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
