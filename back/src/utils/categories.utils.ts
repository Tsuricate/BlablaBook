export const formatCategory = (category: string) => {
  return category
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
};
