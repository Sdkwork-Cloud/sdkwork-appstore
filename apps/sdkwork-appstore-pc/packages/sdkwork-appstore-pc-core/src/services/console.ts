const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ManagedApp {
  id: string;
  name: string;
  version: string;
  status: '已上架' | '审核中' | '已提交上架' | '已下架';
  downloads: string;
  updatedAt?: string;
}

export interface ApiCredential {
  id: string;
  name: string;
  keyPrefix: string;
  fullKey?: string;
  createdAt: string;
  status: 'active' | 'revoked';
}

export interface SecurityPolicy {
  mfaRequired: boolean;
  ipWhitelistEnabled: boolean;
  rateLimitPerMin: number;
  dataIsolationMode: 'Strict Domain Isolation' | 'Shared Tenant' | 'VPC Peering';
}

export interface ConsoleAuditLog {
  id: string;
  action: string;
  operator: string;
  timestamp: string;
  ip: string;
}

export interface IConsoleSDK {
  getManagedApps(): Promise<ManagedApp[]>;
  publishApp(appData: { name: string; category: string; version: string; description: string }): Promise<ManagedApp>;
  getApiCredentials(): Promise<ApiCredential[]>;
  generateApiKey(name: string): Promise<ApiCredential>;
  revokeApiKey(id: string): Promise<boolean>;
  getSecurityPolicy(): Promise<SecurityPolicy>;
  updateSecurityPolicy(policy: Partial<SecurityPolicy>): Promise<SecurityPolicy>;
  getConsoleAuditLogs(): Promise<ConsoleAuditLog[]>;
}

const getSavedManagedApps = (): ManagedApp[] => {
  try {
    const saved = localStorage.getItem('sdkwork_console_apps');
    return saved ? JSON.parse(saved) : [
      { id: 'dev-1', name: 'SDKWork Copilot Studio', version: '2.1.0', status: '已上架', downloads: '124,500', updatedAt: '2026-07-20' },
      { id: 'dev-2', name: 'Smart AI Audio Lab', version: '1.0.4', status: '审核中', downloads: '1,200', updatedAt: '2026-07-25' },
    ];
  } catch {
    return [
      { id: 'dev-1', name: 'SDKWork Copilot Studio', version: '2.1.0', status: '已上架', downloads: '124,500', updatedAt: '2026-07-20' },
      { id: 'dev-2', name: 'Smart AI Audio Lab', version: '1.0.4', status: '审核中', downloads: '1,200', updatedAt: '2026-07-25' },
    ];
  }
};

const saveManagedApps = (apps: ManagedApp[]) => {
  try {
    localStorage.setItem('sdkwork_console_apps', JSON.stringify(apps));
  } catch {
    // ignore
  }
};

const getSavedCredentials = (): ApiCredential[] => {
  try {
    const saved = localStorage.getItem('sdkwork_console_credentials');
    return saved ? JSON.parse(saved) : [
      {
        id: 'key-1',
        name: 'Production Primary Key',
        keyPrefix: 'sdkwork_live_9984...',
        fullKey: 'sdkwork_live_key_9984201384729104',
        createdAt: '2026-01-15',
        status: 'active',
      },
    ];
  } catch {
    return [
      {
        id: 'key-1',
        name: 'Production Primary Key',
        keyPrefix: 'sdkwork_live_9984...',
        fullKey: 'sdkwork_live_key_9984201384729104',
        createdAt: '2026-01-15',
        status: 'active',
      },
    ];
  }
};

const saveCredentials = (list: ApiCredential[]) => {
  try {
    localStorage.setItem('sdkwork_console_credentials', JSON.stringify(list));
  } catch {
    // ignore
  }
};

const getSavedPolicy = (): SecurityPolicy => {
  try {
    const saved = localStorage.getItem('sdkwork_security_policy');
    return saved ? JSON.parse(saved) : {
      mfaRequired: true,
      ipWhitelistEnabled: false,
      rateLimitPerMin: 1200,
      dataIsolationMode: 'Strict Domain Isolation',
    };
  } catch {
    return {
      mfaRequired: true,
      ipWhitelistEnabled: false,
      rateLimitPerMin: 1200,
      dataIsolationMode: 'Strict Domain Isolation',
    };
  }
};

const savePolicy = (p: SecurityPolicy) => {
  try {
    localStorage.setItem('sdkwork_security_policy', JSON.stringify(p));
  } catch {
    // ignore
  }
};

let managedAppsStore: ManagedApp[] = getSavedManagedApps();
let credentialsStore: ApiCredential[] = getSavedCredentials();
let currentSecurityPolicy: SecurityPolicy = getSavedPolicy();

export const ConsoleService: IConsoleSDK = {
  getManagedApps: async (): Promise<ManagedApp[]> => {
    await delay(150);
    return managedAppsStore;
  },

  publishApp: async (appData): Promise<ManagedApp> => {
    await delay(350);
    const newApp: ManagedApp = {
      id: `dev-${Date.now()}`,
      name: appData.name,
      version: appData.version || '1.0.0',
      status: '已提交上架',
      downloads: '0',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    managedAppsStore.unshift(newApp);
    saveManagedApps(managedAppsStore);
    return newApp;
  },

  getApiCredentials: async (): Promise<ApiCredential[]> => {
    await delay(120);
    return credentialsStore;
  },

  generateApiKey: async (name: string): Promise<ApiCredential> => {
    await delay(300);
    const randomSuffix = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const fullKey = `sdkwork_live_${randomSuffix}`;
    const newKey: ApiCredential = {
      id: `key-${Date.now()}`,
      name: name || 'Custom API Key',
      keyPrefix: `${fullKey.substring(0, 16)}...`,
      fullKey,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    credentialsStore.unshift(newKey);
    saveCredentials(credentialsStore);
    return newKey;
  },

  revokeApiKey: async (id: string): Promise<boolean> => {
    await delay(150);
    const target = credentialsStore.find((k) => k.id === id);
    if (target) {
      target.status = 'revoked';
      saveCredentials(credentialsStore);
      return true;
    }
    return false;
  },

  getSecurityPolicy: async (): Promise<SecurityPolicy> => {
    await delay(100);
    return currentSecurityPolicy;
  },

  updateSecurityPolicy: async (policy: Partial<SecurityPolicy>): Promise<SecurityPolicy> => {
    await delay(200);
    currentSecurityPolicy = { ...currentSecurityPolicy, ...policy };
    savePolicy(currentSecurityPolicy);
    return currentSecurityPolicy;
  },

  getConsoleAuditLogs: async (): Promise<ConsoleAuditLog[]> => {
    await delay(150);
    return [
      { id: 'log-1', action: 'API Key 生成', operator: 'admin@sdkwork.com', timestamp: '2026-07-27 10:14:20', ip: '192.168.1.102' },
      { id: 'log-2', action: '应用版本发布 [2.1.0]', operator: 'dev@sdkwork.com', timestamp: '2026-07-26 18:32:00', ip: '192.168.1.105' },
      { id: 'log-3', action: '安全策略修改 [MFA 强制开启]', operator: 'sec-admin@sdkwork.com', timestamp: '2026-07-24 11:05:40', ip: '10.0.4.12' },
    ];
  },
};
