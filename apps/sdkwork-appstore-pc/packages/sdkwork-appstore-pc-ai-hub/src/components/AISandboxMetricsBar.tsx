import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AISandboxMetricsBarProps {
  demoResponse: string;
  metrics: {
    tokenCount?: number;
    latencyMs?: number;
    modelUsed?: string;
  };
}

export const AISandboxMetricsBar: React.FC<AISandboxMetricsBarProps> = ({
  demoResponse,
  metrics,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!demoResponse) return null;

  const handleCopy = () => {
    if (!demoResponse) return;
    navigator.clipboard.writeText(demoResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 px-1 pt-1">
      <div className="flex items-center gap-3">
        <span>{t('aihub.sandbox.usedModel')}: <strong className="text-teal-600 dark:text-teal-400">{metrics.modelUsed}</strong></span>
        <span>{t('aihub.sandbox.latencyLabel')}: <strong>{metrics.latencyMs}ms</strong></span>
        <span>Tokens: <strong>{metrics.tokenCount}</strong></span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 font-medium cursor-pointer transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? t('common.actions.copied') : t('aihub.sandbox.copyResponse')}</span>
      </button>
    </div>
  );
};
