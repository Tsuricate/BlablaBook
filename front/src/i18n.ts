import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// FR
import commonFr from './locales/fr/common.json';
import authFr from './locales/fr/auth.json';
import bookFr from './locales/fr/book.json';
import termsFr from './locales/fr/terms.json';
import accountFr from './locales/fr/account.json';

// EN
import commonEn from './locales/en/common.json';
import authEn from './locales/en/auth.json';
import bookEn from './locales/en/book.json';
import termsEn from './locales/en/terms.json';
import accountEn from './locales/en/account.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: commonFr,
        auth: authFr,
        book: bookFr,
        terms: termsFr,
        account: accountFr,
      },
      en: {
        common: commonEn,
        auth: authEn,
        book: bookEn,
        terms: termsEn,
        account: accountEn,
      },
    },
    lng: localStorage.getItem('userLanguage') || 'fr',
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common', 'auth', 'book'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'htmlTag'],
      caches: [],
    },
  });

export default i18n;
