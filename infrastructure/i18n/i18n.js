import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import sw from './locales/sw.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  pt: { translation: pt },
  sw: { translation: sw },
};

const languageMap = {
  '1': 'en',
  '2': 'es',
  '3': 'fr',
  '4': 'pt',
  '5': 'sw',
};

const initI18n = async () => {
  const languageId = await AsyncStorage.getItem('selected_language');
  const defaultLanguage = languageId ? languageMap[languageId] : 'en';

  await i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

// Initialize i18n
initI18n();

// Export changeLanguage function for dynamic switching
export const changeLanguage = async (languageId) => {
  const langCode = languageMap[languageId] || 'en';
  await i18n.changeLanguage(langCode);
};

export default i18n;