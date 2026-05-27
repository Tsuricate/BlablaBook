import {
  adaptedBooksTheme,
  controlledThemes,
  dystopianWorldsTheme,
  mostRecommendedBooksTheme,
} from './collectionTheme.utils';

const collections = {
  adapted: adaptedBooksTheme,
  dystopian: dystopianWorldsTheme,
  recommended: mostRecommendedBooksTheme,
};

type ControlledKey = keyof typeof controlledThemes;
type CollectionKey = keyof typeof collections;
type ThemeKey = ControlledKey | CollectionKey;
export type Lang = 'en' | 'fr';

/**
 * Pick random themes:
 * - 2 controlled (franchises / universes)
 * - 1 curated collection (hand-picked books)
 */
export const getRandomThemes = (count = 3): ThemeKey[] => {
  const controlledKeys = Object.keys(controlledThemes) as ControlledKey[];
  const collectionKeys = Object.keys(collections) as CollectionKey[];

  const pickRandom = <T>(items: T[], count: number): T[] => {
    const itemsCopy = [...items];
    const pickedItems: T[] = [];

    const maxItemsToPick = Math.min(count, itemsCopy.length);

    for (let i = 0; i < maxItemsToPick; i++) {
      const randomIndex = Math.floor(Math.random() * itemsCopy.length);
      const [selectedItem] = itemsCopy.splice(randomIndex, 1);

      pickedItems.push(selectedItem);
    }

    return pickedItems;
  };

  return [...pickRandom(collectionKeys, 1), ...pickRandom(controlledKeys, 2)];
};

export const getThemeData = (key: ThemeKey, lang: Lang) => {
  if (key in controlledThemes) {
    return {
      type: 'search' as const,
      query: controlledThemes[key as ControlledKey],
    };
  }
  const collection = collections[key as CollectionKey];

  return {
    type: 'collection' as const,
    data: {
      ...collection,
      queries: collection.queries.map((book) => ({
        ...book,
        title: resolveTitle(book.title, lang),
      })),
    },
  };
};

export const buildGoogleBooksQuery = (title: string, author: string) => {
  return `intitle:"${title}" inauthor:"${author}"`;
};

export const resolveTitle = (title: { en: string; fr: string }, lang: Lang) => {
  return title[lang] ?? title.en;
};
