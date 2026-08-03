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

export type ConsoleServicePort = IConsoleSDK;

let consolePort: ConsoleServicePort = createUnconfiguredConsolePort();

/** Bind the real SDK-backed implementation during app bootstrap. */
export function configureConsoleServicePort(port: ConsoleServicePort): void {
  consolePort = port;
}

export const ConsoleService: IConsoleSDK = {
  getManagedApps: () => consolePort.getManagedApps(),
  publishApp: (appData) => consolePort.publishApp(appData),
  getApiCredentials: () => consolePort.getApiCredentials(),
  generateApiKey: (name) => consolePort.generateApiKey(name),
  revokeApiKey: (id) => consolePort.revokeApiKey(id),
  getSecurityPolicy: () => consolePort.getSecurityPolicy(),
  updateSecurityPolicy: (policy) => consolePort.updateSecurityPolicy(policy),
  getConsoleAuditLogs: () => consolePort.getConsoleAuditLogs(),
};

function createUnconfiguredConsolePort(): ConsoleServicePort {
  const unavailable = (): never => {
    throw new Error('The App Store console runtime is not configured.');
  };
  return {
    getManagedApps: async () => unavailable(),
    publishApp: async () => unavailable(),
    getApiCredentials: async () => unavailable(),
    generateApiKey: async () => unavailable(),
    revokeApiKey: async () => unavailable(),
    getSecurityPolicy: async () => unavailable(),
    updateSecurityPolicy: async () => unavailable(),
    getConsoleAuditLogs: async () => unavailable(),
  };
}
