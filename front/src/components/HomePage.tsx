import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Stack } from '@chakra-ui/react';
import axios from 'axios';

import { PageLayout } from '../components/layouts/PageLayout';
import MobileMenu from '../components/MobileMenu';
import SearchBar from './SearchBar';
import CategoriesList from './CategoriesList';
import BookCardList from './BookCardList';

import homeImage from '../assets/homePageImage.jpg';
import { slugify } from '../utils/stringUtils';
import { getThemeLabel } from '../utils/themeUtils';
import { useBookSearch } from '../hooks/useBookSearch';
import { useTranslation } from 'react-i18next';
import type { Category } from '../types/category';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const isInitialRender = useRef(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios
      .get<Category[]>(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const {
    searchValue,
    searchResults,
    handleSearchChange,
    handleSubmit,
    handleLoadMoreBooks,
    handleClear,
    isLoading,
    isInitialLoading,
    hasMoreResults,
    activeQuery,
  } = useBookSearch();

  const [featuredBooks, setFeaturedBooks] = useState<Record<string, Book[]>>({});

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (!activeQuery) {
      const fetchFeatured = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/books/topFeaturedThemes`
          );
          setFeaturedBooks(res.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchFeatured();
    } else {
      setFeaturedBooks({});
    }
  }, [activeQuery]);

  const handleSelectCategory = (categoryName: string) => {
    const slug = slugify(categoryName);
    navigate(`/categories/${slug}`);
  };

  return (
    <PageLayout imageSrc={homeImage} imagePosition="top" imageSize={25}>
      <Stack gap={6} pb={{ base: 20, md: 2 }}>
        <SearchBar
          searchValue={searchValue}
          onChange={handleSearchChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />

        <CategoriesList categories={categories} onSelectCategory={handleSelectCategory} />

        {activeQuery ? (
          <>
            <BookCardList
              title={t('search.resultsFor', { query: activeQuery })}
              books={searchResults}
              isLoading={isInitialLoading}
            />
            {hasMoreResults && (
              <Button onClick={handleLoadMoreBooks} loading={isLoading} mt={4}>
                {t('search.loadMore')}
              </Button>
            )}
          </>
        ) : (
          Object.entries(featuredBooks).map(([themeKey, books]) => (
            <BookCardList
              key={themeKey}
              title={getThemeLabel(themeKey)}
              books={books}
              wrap={false}
            />
          ))
        )}
      </Stack>

      <MobileMenu />
    </PageLayout>
  );
};

export default HomePage;
