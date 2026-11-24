import i18n from '../i18n';

export const getThemeLabel = (themeKey: string): string => {
  const key = `book:themes.${themeKey}`;
  const translated = i18n.t(key);
  // Si la clé n'existe pas, i18next retourne la clé elle-même
  return translated === key ? themeKey : translated;
};

type CollectionTheme = { color: string; accent: string };

const defaultTheme: CollectionTheme = { color: '#A58A72', accent: '#A97A1F' };

const collectionThemes: Record<string, CollectionTheme> = {
  dystopian: { color: '#64818A', accent: '#2F7A8C' },
  postApocalyptic: { color: '#85836C', accent: '#8A8030' },
  timeTravel: { color: '#A58A72', accent: '#B5703A' },
  parallelWorlds: { color: '#817895', accent: '#6E5FA8' },
  impossibleLove: { color: '#8E687E', accent: '#A8456F' },
  screenAdaptations: { color: '#78856D', accent: '#5C8A3F' },
};

export const getCollectionTheme = (key: string): CollectionTheme =>
  collectionThemes[key] ?? defaultTheme;
