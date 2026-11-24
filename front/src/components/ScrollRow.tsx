import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const FADE_WIDTH = 48;

type ScrollRowProps = {
  children: ReactNode;
};

const ScrollRow = ({ children }: ScrollRowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Track whether the row has reached either scroll boundary
  const updateEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateEdges();
    // Recalculate boundaries when the container size changes
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = ref.current;
    el?.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  // Fade the edges only when more content is available in that direction
  const mask = `linear-gradient(to right, ${atStart ? 'black' : 'transparent'} 0, black ${FADE_WIDTH}px, black calc(100% - ${FADE_WIDTH}px), ${atEnd ? 'black' : 'transparent'} 100%)`;

  const arrow = (direction: 1 | -1) => (
    <IconButton
      aria-label={direction === 1 ? 'Suivant' : 'Précédent'}
      onClick={() => scrollByPage(direction)}
      display={{ base: 'none', md: 'inline-flex' }}
      position="absolute"
      top="110px"
      left={direction === -1 ? 0 : undefined}
      right={direction === 1 ? 0 : undefined}
      zIndex={1}
      size="lg"
      rounded="full"
      color="ui.text"
      bg={{ _light: 'white', _dark: '#2A2927' }}
      borderWidth="1px"
      borderColor={{ _light: 'rgba(61,51,40,0.08)', _dark: 'rgba(255,255,255,0.12)' }}
      boxShadow={{
        _light: '0 8px 24px rgba(61,51,40,0.28), 0 2px 6px rgba(61,51,40,0.12)',
        _dark: '0 8px 24px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.4)',
      }}
      transition="opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: 'scale(1.1)' }}
      css={{ '[data-row]:hover &': { opacity: 1 } }}
    >
      {direction === 1 ? <LuChevronRight strokeWidth={2.5} /> : <LuChevronLeft strokeWidth={2.5} />}
    </IconButton>
  );

  return (
    <Box position="relative" minW={0}>
      {!atStart && arrow(-1)}
      {!atEnd && arrow(1)}
      <Flex
        ref={ref}
        onScroll={updateEdges}
        gap={6}
        overflowX="auto"
        pb={2}
        css={{ scrollbarWidth: 'none' }}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {children}
      </Flex>
    </Box>
  );
};

export default ScrollRow;
