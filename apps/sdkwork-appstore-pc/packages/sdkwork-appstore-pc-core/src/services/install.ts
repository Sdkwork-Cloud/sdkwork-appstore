const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface StorageStats {
  usedMb: number;
  totalMb: number;
  appsCount: number;
  cacheMb: number;
}

export interface IInstallSDK {
  getInstalledAppIds(): Promise<string[]>;
  installApp(appId: string): Promise<boolean>;
  uninstallApp(appId: string): Promise<boolean>;
  getStorageStats(): Promise<StorageStats>;
}

const defaultInstalled = ['app-wechat', 'app-wps'];

export const InstallService: IInstallSDK = {
  getInstalledAppIds: async (): Promise<string[]> => {
    await delay(50);
    try {
      const saved = localStorage.getItem('sdkwork_installed_apps');
      return saved ? JSON.parse(saved) : defaultInstalled;
    } catch {
      return defaultInstalled;
    }
  },

  installApp: async (appId: string): Promise<boolean> => {
    await delay(100);
    try {
      const saved = localStorage.getItem('sdkwork_installed_apps');
      const list: string[] = saved ? JSON.parse(saved) : defaultInstalled;
      if (!list.includes(appId)) {
        list.push(appId);
        localStorage.setItem('sdkwork_installed_apps', JSON.stringify(list));
      }
      return true;
    } catch {
      return false;
    }
  },

  uninstallApp: async (appId: string): Promise<boolean> => {
    await delay(100);
    try {
      const saved = localStorage.getItem('sdkwork_installed_apps');
      let list: string[] = saved ? JSON.parse(saved) : defaultInstalled;
      list = list.filter((id) => id !== appId);
      localStorage.setItem('sdkwork_installed_apps', JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  },

  getStorageStats: async (): Promise<StorageStats> => {
    await delay(80);
    const saved = localStorage.getItem('sdkwork_installed_apps');
    const list: string[] = saved ? JSON.parse(saved) : defaultInstalled;
    
    const usedMb = list.length * 180 + 320;
    return {
      usedMb,
      totalMb: 51200, // 50GB
      appsCount: list.length,
      cacheMb: 1420,
    };
  },
};
