import noBookCover from '../assets/noBookCover.jpg';

export const getBookImageByScreen = (imageLinks?: Book['imageLinks']): string => {
  if (!imageLinks) return noBookCover;

  const width = window.innerWidth;

  if (width >= 1200) {
    return imageLinks.extraLarge || imageLinks.large || imageLinks.medium || noBookCover;
  }
  if (width >= 768) {
    return imageLinks.large || imageLinks.medium || imageLinks.thumbnail || noBookCover;
  }
  if (width >= 480) {
    return imageLinks.medium || imageLinks.small || imageLinks.thumbnail || noBookCover;
  }

  return imageLinks.small || imageLinks.thumbnail || imageLinks.smallThumbnail || noBookCover;
};
