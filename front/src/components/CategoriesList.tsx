import { useState } from 'react';
import { Button, Text, Box, HStack, Wrap, WrapItem } from '@chakra-ui/react';

export interface CategoriesListProps {
  categories: string[];
  onSelectCategory: (categoryName: string) => void;
}

const CategoriesList = ({ categories, onSelectCategory }: CategoriesListProps) => {
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll ? categories : categories.slice(0, 10);

  const Container = showAll ? Wrap : HStack;

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>
        Catégories
      </Text>

      <Container {...(!showAll && { overflowX: 'auto', paddingInline: 2 })} gap={3}>
        {visibleCategories.map((category) => {
          const button = (
            <Button size="sm" variant="outline" onClick={() => onSelectCategory(category)}>
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
          <Button size="sm" variant="ghost" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? 'Voir moins' : 'Voir toutes'}
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default CategoriesList;
