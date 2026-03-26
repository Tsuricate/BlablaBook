import { Button, HStack, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useColorModeValue } from './ui/color-mode';

interface SearchBarProps {
  searchValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClear?: () => void;
}

const SearchBar = ({ searchValue, onChange, onSubmit, onClear }: SearchBarProps) => {
  const { t } = useTranslation('common');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <InputGroup
      endElement={
        <HStack gap={1} paddingInline={0}>
          {searchValue && (
            <Button
              aria-label={t('search.clear')}
              variant="plain"
              onClick={onClear}
              color="brown.600"
            >
              {t('search.clear')}
            </Button>
          )}
          <IconButton
            variant="plain"
            aria-label={t('search.ariaLabel')}
            size="md"
            onClick={onSubmit}
            color={useColorModeValue('brown.600', 'brown.400')}
          >
            <LuSearch />
          </IconButton>
        </HStack>
      }
    >
      <Input
        placeholder={t('search.placeholder')}
        value={searchValue}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
    </InputGroup>
  );
};

export default SearchBar;
