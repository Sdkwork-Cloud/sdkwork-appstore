import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { changeLanguage } from '../../i18n';

export const HeaderLanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'zh-CN';

  const toggleLanguage = () => {
    const nextLang = currentLang.startsWith('zh') ? 'en' : 'zh-CN';
    changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700/80 whitespace-nowrap"
      title={currentLang.startsWith('zh') ? '切换为 English' : 'Switch to 简体中文'}
    >
      <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
      <span className="hidden xl:inline">{currentLang.startsWith('zh') ? '中文' : 'EN'}</span>
    </button>
  );
};
