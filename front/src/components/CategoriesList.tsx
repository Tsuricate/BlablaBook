import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Heading, Box, HStack, Wrap, WrapItem, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { CATEGORIES } from '../utils/categories';

const CategoriesList = () => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation(['common', 'book']);
  const navigate = useNavigate();

  const categories = CATEGORIES.map((category) => ({
    ...category,
    label: t(`book:categories.list.${category.key}`),
  }));
  const visibleCategories = showAll ? categories : categories.slice(0, 10);

  const Container = showAll ? Wrap : HStack;

  const handleSelectCategory = (category: (typeof CATEGORIES)[number]) => {
    navigate(`/categories/${category.slug}`);
  };

  return (
    <Box as="section" mb={{ base: 4, md: 6 }}>
      <Box mb={3}>
        <Heading
          size="lg"
          fontWeight="semibold"
          letterSpacing="-0.02em"
          color={{ _light: 'brown.800', _dark: 'light.100' }}
        >
          {t('categories.title')}
        </Heading>

        <Text mt={1} fontSize="sm" color={{ _light: 'brown.600', _dark: 'light.400' }}>
          {t('book:categories.subtitle')}
        </Text>
      </Box>

      <Container
        {...(!showAll && { overflowX: 'auto' })}
        pt={{ md: 2 }}
        css={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        gap={3}
      >
        {visibleCategories.map((category) => {
          const button = (
            <Button size="sm" variant="category" onClick={() => handleSelectCategory(category)}>
              {category.label}
            </Button>
          );

          return showAll ? (
            <WrapItem key={category.key}>{button}</WrapItem>
          ) : (
            <Box key={category.key}>{button}</Box>
          );
        })}

        {categories.length > 10 && (
          <Button size="sm" variant="category" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? t('categories.showLess') : t('categories.showAll')}
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default CategoriesList;
