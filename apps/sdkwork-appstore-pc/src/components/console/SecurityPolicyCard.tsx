import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConsoleService, SecurityPolicy } from '../../services/api';

export const SecurityPolicyCard: React.FC = () => {
  const { t } = useTranslation();
  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    ConsoleService.getSecurityPolicy().then((p) => setPolicy(p));
  }, []);

  const handleToggle = async (key: keyof SecurityPolicy) => {
    if (!policy) return;
    setUpdating(true);
    const updated = await ConsoleService.updateSecurityPolicy({
      [key]: !policy[key],
    });
    setPolicy(updated);
    setUpdating(false);
  };

  if (!policy) return null;

  return (
    <div className="bg-gray-100/50 dark:bg-[#181a20] border border-gray-200 dark:border-[#22252e] rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{t('console.security.title')}</span>
        </h2>
        {updating && <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />}
      </div>

      <p className="text-xs text-gray-400">
        {t('console.security.crossOrigin')}:
      </p>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#20232b] rounded-xl border border-gray-200 dark:border-[#2d313c]">
          <div>
            <div className="font-bold text-gray-800 dark:text-gray-200">{t('console.security.mfa')}</div>
            <div className="text-[10px] text-gray-400">MFA Protection</div>
          </div>
          <button
            onClick={() => handleToggle('mfaRequired')}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all cursor-pointer ${
              policy.mfaRequired ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#20232b] rounded-xl border border-gray-200 dark:border-[#2d313c]">
          <div>
            <div className="font-bold text-gray-800 dark:text-gray-200">{t('console.security.ipWhitelist')}</div>
            <div className="text-[10px] text-gray-400">IP Whitelist</div>
          </div>
          <button
            onClick={() => handleToggle('ipWhitelistEnabled')}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all cursor-pointer ${
              policy.ipWhitelistEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#20232b] rounded-xl border border-gray-200 dark:border-[#2d313c]">
          <div>
            <div className="font-bold text-gray-800 dark:text-gray-200">{t('console.security.crossOrigin')}</div>
            <div className="text-[10px] text-gray-400">{policy.dataIsolationMode} ({policy.rateLimitPerMin} QPM)</div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
            {t('console.apiKeys.active')}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 pt-1">
        <Lock className="w-3 h-3" />
        <span>DJCP Level 3 Compliant</span>
      </div>
    </div>
  );
};

