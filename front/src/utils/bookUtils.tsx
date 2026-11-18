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

export const palette: [string, string][] = [
  ['#9b3d4a', '#5e1f2c'],
  ['#c4693f', '#8c3d1c'],
  ['#a97a1f', '#6e4b0c'],
  ['#3f7a5c', '#1f4a38'],
  ['#2b6a8a', '#153f58'],
  ['#4a4f8f', '#292c5e'],
  ['#7a4a86', '#4a2656'],
  ['#b0566e', '#762e45'],
  ['#2f8079', '#1a524e'],
  ['#5c6470', '#343a44'],
];

export const getPaletteIndex = (text: string): number =>
  [...text].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0) % palette.length;
