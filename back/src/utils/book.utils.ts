export const simplifyCategories = (categories: string[]): string[] =>
  [
    ...new Set(categories.flatMap((category) => category.split('/').map((part) => part.trim()))),
  ].filter((name) => name !== 'General');
