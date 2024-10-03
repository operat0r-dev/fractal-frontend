import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import EN from '@/locales/en/translation.json';
import PL from '@/locales/pl/translation.json';

const resources = {
  en: {
    translation: EN,
  },
  pl: {
    translation: PL,
  },
};

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  debug: true,
  keySeparator: '.',
});

export default i18n;
