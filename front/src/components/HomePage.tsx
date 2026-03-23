import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Stack } from '@chakra-ui/react';
import axios from 'axios';

import { PageLayout } from '../components/layouts/PageLayout';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import SearchBar from './SearchBar';
import CategoriesList from './CategoriesList';
import BookCardList from './BookCardList';

import homeImage from '../assets/homePageImage.jpg';
import { booksMock } from '../mocks/mockData';
import { slugify } from '@/utils/stringUtils';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<string[]>('/api/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClear = () => {
    setSearchValue('');
  };

  const handleSubmit = async () => {
    // En attente de l'API Back
  };

  const handleSelectCategory = (categoryName: string) => {
    const slug = slugify(categoryName);
    navigate(`/categories/${slug}`);
  };

  return (
    <>
      <PageLayout imageSrc={homeImage} header={<Header />} imagePosition="top" imageSize="25%">
        <Stack gap={6} pb={{ base: 20, md: 2 }}>
          <SearchBar
            searchValue={searchValue}
            onChange={handleSearchChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          <CategoriesList categories={categories} onSelectCategory={handleSelectCategory} />

          <BookCardList title="List Title" books={booksMock} />
          <BookCardList title="Second List Title" books={booksMock} />
        </Stack>

        <MobileMenu />
      </PageLayout>
    </>
  );
};

export default HomePage;


export default HomePage;
