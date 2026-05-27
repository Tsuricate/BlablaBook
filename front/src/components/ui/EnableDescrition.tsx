import { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { renderDescription } from '../../utils/htmlParser';
import { useTranslation } from 'react-i18next';

const ExpandableDescription = ({ html }: { html?: string }) => {
  const { t } = useTranslation('common');
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Box lineClamp={expanded ? 'none' : 5}>{renderDescription(html)}</Box>

      <Button
        variant="plain"
        fontWeight="semibold"
        size="sm"
        pl={0}
        onClick={() => setExpanded((prev) => !prev)}
        color={{ _light: 'brown.500', _dark: 'light.300' }}
        textDecoration="underline"
      >
        {expanded ? t('categories.showLess') : t('categories.showAll')}
      </Button>
    </Box>
  );
};

export default ExpandableDescription;
