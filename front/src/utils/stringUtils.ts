import { useBreakpointValue } from '@chakra-ui/react';

/**
 * Converts a string to a URL-friendly slug.
 * Example: "Science Fiction" -> "science-fiction"
 */
export const slugify = (value: string) =>
  value
    .split('/')[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const useTruncatedTitle = (title?: string) => {
  const maxChars = useBreakpointValue({ base: 30, md: 50, xl: 80 }) ?? 30;

  if (!title) return '';

  return title.length > maxChars ? title.slice(0, maxChars) + '…' : title;
};
