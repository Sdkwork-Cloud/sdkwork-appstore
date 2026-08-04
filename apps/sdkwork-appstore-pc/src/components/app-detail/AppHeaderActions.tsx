import React from 'react';
import { Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppItem } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useInstall } from '../../providers/InstallProvider';

interface AppHeaderActionsProps {
  app: AppItem;
}

export const AppHeaderActions: React.FC<AppHeaderActionsProps> = ({ app }) => {
  const { t, i18n } = useTranslation();
  const { installApp } = useInstall();

  return (
    <div className="flex items-center gap-3">
      <button 
        type="button"
        onClick={() => installApp(app)}
        className="bg-blue-600 text-white px-8 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 dark:shadow-none uppercase tracking-wide cursor-pointer"
      >
        {app.price === 0 ? t('appDetail.header.get') : formatPrice(app.price, i18n.language)}
      </button>
      <button 
        type="button"
        aria-label={t('appDetail.header.share')}
        className="p-2 bg-gray-100 dark:bg-[#2C2C2E] text-blue-600 dark:text-[#0A84FF] rounded-full hover:bg-gray-200 dark:hover:bg-[#3C3C3E] transition-colors cursor-pointer"
      >
        <Share className="w-5 h-5" />
      </button>
    </div>
  );
};

