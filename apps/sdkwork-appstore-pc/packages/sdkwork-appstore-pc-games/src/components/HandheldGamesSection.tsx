import React from 'react';
import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppItem } from '../../../../src/types';
import { HandheldGamesGrid } from '../../../../src/components/discover/HandheldGamesGrid';

interface HandheldGamesSectionProps {
  games: AppItem[];
}

export const HandheldGamesSection: React.FC<HandheldGamesSectionProps> = ({ games }) => {
  const { t } = useTranslation();

  if (games.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
        <Trophy className="w-4 h-4 text-amber-500" />
        <span>{t('games.sections.mobileGames', '精品手游合集')}</span>
      </div>
      <HandheldGamesGrid apps={games} />
    </section>
  );
};
