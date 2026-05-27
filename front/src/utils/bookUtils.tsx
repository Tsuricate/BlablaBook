import type { Book } from '../types/book';

export const getBookImageByScreen = (imageLinks?: Book['imageLinks']): string | null => {
  if (!imageLinks) return null;

  const width = window.innerWidth;
  let url: string | undefined;

  if (width >= 1200) {
    url = imageLinks.extraLarge || imageLinks.large || imageLinks.medium;
  } else if (width >= 768) {
    url = imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
  } else if (width >= 480) {
    url = imageLinks.medium || imageLinks.small || imageLinks.thumbnail;
  } else {
    url = imageLinks.small || imageLinks.thumbnail || imageLinks.smallThumbnail;
  }

  if (url?.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  return url ?? null;
};
