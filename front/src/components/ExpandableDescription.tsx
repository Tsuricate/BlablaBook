import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { renderDescription } from '../utils/htmlParser';
import { useTranslation } from 'react-i18next';

const ExpandableDescription = ({ html }: { html?: string }) => {
  const { t } = useTranslation('common');
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => {
      // Only measure when collapsed, as expanded content is no longer clamped.
      if (!expanded) setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [html, expanded]);

  const showFade = !expanded && isTruncated;

  // Fade out the bottom of the text to indicate that more content is available.
  const fade = 'linear-gradient(to bottom, black calc(100% - 2.2em), transparent)';

  return (
    <Box display="flex" flexDirection="column" flex={{ md: expanded ? 1 : 'none' }} minH={0}>
      <Box
        flex={{ md: expanded ? 1 : 'none' }}
        minH={0}
        overflowY={expanded ? 'auto' : 'visible'}
        maxH={expanded ? { base: '55vh', md: 'none' } : undefined}
        pr={expanded ? 3 : 0}
        css={{ scrollbarWidth: 'thin' }}
      >
        <Box
          ref={textRef}
          lineClamp={expanded ? 'none' : 5}
          lineHeight="1.7"
          color="ui.text"
          css={{ '& strong, & b': { fontWeight: 600 } }}
          style={showFade ? { maskImage: fade, WebkitMaskImage: fade } : undefined}
        >
          {renderDescription(html)}
        </Box>
      </Box>
      {(isTruncated || expanded) && (
        <Button
          variant="plain"
          size="sm"
          pl={0}
          mt={2}
          gap={1}
          alignSelf="flex-start"
          flexShrink={0}
          fontWeight="semibold"
          color="ui.accentText"
          _hover={{ textDecoration: 'underline' }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? t('categories.showLess') : t('categories.showAll')}
          {expanded ? <LuChevronUp /> : <LuChevronDown />}
        </Button>
      )}
    </Box>
  );
};
export default ExpandableDescription;
