import { useState } from 'react';
import { Button, Heading, Box, HStack, Wrap, WrapItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export interface CategoriesListProps {
  categories: string[];
  onSelectCategory: (categoryName: string) => void;
}

const CategoriesList = ({ categories, onSelectCategory }: CategoriesListProps) => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation('common');

  const visibleCategories = showAll ? categories : categories.slice(0, 10);

  const Container = showAll ? Wrap : HStack;

  return (
    <Box>
      <Heading fontWeight="bold" mb={2}>
        {t('categories.title')}
      </Heading>

      <Container {...(!showAll && { overflowX: 'auto', paddingInline: 2 })} gap={3} py={2}>
        {visibleCategories.map((category) => {
          const button = (
            <Button size="sm" variant="category" onClick={() => onSelectCategory(category)}>
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
          <Button size="sm" variant="primary" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? t('categories.showLess') : t('categories.showAll')}
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default CategoriesList;
