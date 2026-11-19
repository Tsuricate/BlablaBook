import { Button, HStack, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
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
      mb={{ base: 2, md: 3 }}
      endElement={
        <HStack gap={1} paddingInline={0}>
          {searchValue && (
            <Button
              aria-label={t('search.clear')}
              variant="plain"
              onClick={onClear}
              color="ui.muted"
            >
              {t('search.clear')}
            </Button>
          )}
          <IconButton
            variant="plain"
            aria-label={t('search.ariaLabel')}
            size="md"
            onClick={onSubmit}
            color="ui.muted"
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
        variant="searchBar"
      />
    </InputGroup>
  );
};

export default SearchBar;
