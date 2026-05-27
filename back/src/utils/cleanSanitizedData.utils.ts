export const cleanImageLinks = (imageLinks: any) => {
  if (!imageLinks) return imageLinks;

  return Object.fromEntries(
    Object.entries(imageLinks).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.replaceAll('&amp;', '&') : value,
    ])
  );
};

export const cleanOtherBookData = (data: any) => {
  if (Array.isArray(data)) {
    const cleanedData = data.map((value) =>
      typeof value === 'string' ? value.replaceAll('&amp;', '&') : value
    );
    return cleanedData;
  }

  return typeof data === 'string' ? data.replaceAll('&amp;', '&') : data;
};
