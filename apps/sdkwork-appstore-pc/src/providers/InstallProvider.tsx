import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppItem } from '../types';
import { AnimatePresence } from 'motion/react';
import { InstallModal } from '../components/install/InstallModal';

interface InstallContextType {
  installApp: (app: AppItem) => void;
  openApp: (app: AppItem) => void;
  uninstallApp: (appId: string) => void;
  isInstalled: (appId: string) => boolean;
  isDownloading: (appId: string) => boolean;
  downloadProgress: (appId: string) => number;
  installedAppIds: Set<string>;
  activeDownloadApp: AppItem | null;
  downloadState: 'confirm' | 'downloading' | 'success' | null;
}

const InstallContext = createContext<InstallContextType | undefined>(undefined);

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [appToInstall, setAppToInstall] = useState<AppItem | null>(null);
  const [installState, setInstallState] = useState<'confirm' | 'downloading' | 'success'>('confirm');
  const [progress, setProgress] = useState(0);
  const [installedAppIds, setInstalledAppIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('sdkwork_installed_apps');
      return saved ? new Set(JSON.parse(saved)) : new Set(['app-wechat', 'app-wps']);
    } catch {
      return new Set(['app-wechat', 'app-wps']);
    }
  });

  const installApp = (app: AppItem) => {
    setAppToInstall(app);
    setInstallState('confirm');
    setProgress(0);
  };

  const [runningAppNotice, setRunningAppNotice] = useState<string | null>(null);

  const openApp = (app: AppItem) => {
    setRunningAppNotice(`应用【${app.name}】正在本地桌面沙盒环境运行中...`);
    setTimeout(() => {
      setRunningAppNotice(null);
    }, 3000);
  };

  const uninstallApp = (appId: string) => {
    setInstalledAppIds((prev) => {
      const next = new Set(prev);
      next.delete(appId);
      try {
        localStorage.setItem('sdkwork_installed_apps', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isInstalled = (appId: string) => installedAppIds.has(appId);
  const isDownloading = (appId: string) => appToInstall?.id === appId && installState === 'downloading';
  const downloadProgress = (appId: string) => (appToInstall?.id === appId ? progress : 0);

  const confirmInstall = () => {
    setInstallState('downloading');
  };

  const cancelInstall = () => {
    if (installState === 'confirm') {
      setAppToInstall(null);
    }
  };

  useEffect(() => {
    if (installState === 'downloading' && appToInstall) {
      const duration = 1500 + Math.random() * 1000;
      const intervalTime = 40;
      const steps = duration / intervalTime;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const newProgress = Math.min(100, (currentStep / steps) * 100);
        setProgress(newProgress);

        if (currentStep >= steps) {
          clearInterval(interval);
          setInstallState('success');
          
          setInstalledAppIds((prev) => {
            const next = new Set(prev);
            next.add(appToInstall.id);
            try {
              localStorage.setItem('sdkwork_installed_apps', JSON.stringify(Array.from(next)));
            } catch {
              // ignore
            }
            return next;
          });

          setTimeout(() => {
            setAppToInstall(null);
          }, 1200);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [installState, appToInstall]);

  return (
    <InstallContext.Provider
      value={{
        installApp,
        openApp,
        uninstallApp,
        isInstalled,
        isDownloading,
        downloadProgress,
        installedAppIds,
        activeDownloadApp: appToInstall,
        downloadState: appToInstall ? installState : null,
      }}
    >
      {children}
      {runningAppNotice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gray-900/90 text-white dark:bg-gray-100/90 dark:text-gray-900 rounded-2xl shadow-xl border border-gray-700/50 dark:border-gray-300/50 backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{runningAppNotice}</span>
        </div>
      )}
      <AnimatePresence>
        {appToInstall && (
          <InstallModal
            app={appToInstall}
            installState={installState}
            progress={progress}
            onConfirm={confirmInstall}
            onCancel={cancelInstall}
          />
        )}
      </AnimatePresence>
    </InstallContext.Provider>
  );
}

export function useInstall() {
  const context = useContext(InstallContext);
  if (context === undefined) {
    throw new Error('useInstall must be used within an InstallProvider');
  }
  return context;
}
