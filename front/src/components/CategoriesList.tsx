import { useState } from 'react';
import { Button, Heading, Box, HStack, Wrap, WrapItem, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export interface CategoriesListProps {
  categories: string[];
  onSelectCategory: (categoryName: string) => void;
}

const CategoriesList = ({ categories, onSelectCategory }: CategoriesListProps) => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation(['common', 'book']);

  const visibleCategories = showAll ? categories : categories.slice(0, 10);

  const Container = showAll ? Wrap : HStack;

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
            <Button size="sm" variant={"category" as never} onClick={() => onSelectCategory(category)}>
              {category}
            </Button>
          );

          return showAll ? (
            <WrapItem key={category}>{button}</WrapItem>
          ) : (
            <Box key={category}>{button}</Box>
          );
        })}

        {categories.length > 10 && (
          <Button size="sm" variant={"category" as never} onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? t('categories.showLess') : t('categories.showAll')}
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default CategoriesList;
