import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { zhCN } from './locales/zh-CN';
import { en } from './locales/en';

const SAVED_LANG_KEY = 'app_language';
const initialLang = localStorage.getItem(SAVED_LANG_KEY) || 'zh-CN';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      'en': { translation: en }
    },
    lng: initialLang,
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    }
  });

export const changeLanguage = (lang: 'zh-CN' | 'en') => {
  localStorage.setItem(SAVED_LANG_KEY, lang);
  i18n.changeLanguage(lang);
};

export default i18n;
