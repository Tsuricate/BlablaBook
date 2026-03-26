import i18n from '../i18n';

export const getThemeLabel = (themeKey: string): string => {
  const key = `book:themes.${themeKey}`;
  const translated = i18n.t(key);
  // Si la clé n'existe pas, i18next retourne la clé elle-même
  return translated === key ? themeKey : translated;
};
