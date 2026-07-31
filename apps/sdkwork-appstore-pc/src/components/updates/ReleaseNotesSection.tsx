import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseBanner } from './ReleaseBanner';
import { ReleaseNoteLogItem } from './ReleaseNoteLogItem';

export const ReleaseNotesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <ReleaseBanner
        version="v2.5.0"
        title={t('updates.releaseNotes.bannerTitle')}
        description={t('updates.releaseNotes.bannerDesc')}
      />

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t('updates.releaseNotes.logTitle')}</h3>
        <div className="bg-gray-100/60 dark:bg-[#181a20] border border-gray-200 dark:border-[#22252e] rounded-2xl p-5 space-y-4">
          <ReleaseNoteLogItem
            title={t('updates.releaseNotes.log1Title')}
            description={t('updates.releaseNotes.log1Desc')}
          />
          <ReleaseNoteLogItem
            title={t('updates.releaseNotes.log2Title')}
            description={t('updates.releaseNotes.log2Desc')}
          />
        </div>
      </div>
    </div>
  );
};


