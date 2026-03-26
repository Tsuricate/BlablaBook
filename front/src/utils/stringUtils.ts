import { useBreakpointValue } from '@chakra-ui/react';

/**
 * Converts a string to a URL-friendly slug.
 * Example: "Science Fiction" -> "science-fiction"
 */
export const slugify = (string: string) =>
  string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

export const useTruncatedTitle = (title?: string) => {
  const maxChars = useBreakpointValue({ base: 30, md: 50, xl: 80 }) ?? 30;

  if (!title) return '';

  return title.length > maxChars ? title.slice(0, maxChars) + '…' : title;
};
