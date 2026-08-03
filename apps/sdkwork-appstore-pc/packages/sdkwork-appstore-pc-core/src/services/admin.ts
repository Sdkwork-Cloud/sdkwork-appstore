export interface SystemMetrics {
  cpuUsage: number;
  memUsage: number;
  activeSockets: number;
  requestsPerSec: number;
  uptimeDays: number;
}

export interface ClusterNode {
  id: string;
  name: string;
  region: string;
  status: '运行良好' | '高负载' | '排水中' | '异常离线';
  cpu: string;
  memory: string;
  ip: string;
}

export interface SystemAuditEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  service: string;
  event: string;
  traceId: string;
}

export interface IAdminMonitorSDK {
  getMetrics(): Promise<SystemMetrics>;
  getClusterNodes(): Promise<ClusterNode[]>;
  restartNode(nodeId: string): Promise<boolean>;
  getSystemAuditLogs(level?: string): Promise<SystemAuditEntry[]>;
}

export type AdminMonitorServicePort = IAdminMonitorSDK;

let adminMonitorPort: AdminMonitorServicePort = createUnconfiguredAdminMonitorPort();

/** Bind the real backend-admin implementation during app bootstrap. */
export function configureAdminMonitorServicePort(port: AdminMonitorServicePort): void {
  adminMonitorPort = port;
}

export const AdminMonitorService: IAdminMonitorSDK = {
  getMetrics: () => adminMonitorPort.getMetrics(),
  getClusterNodes: () => adminMonitorPort.getClusterNodes(),
  restartNode: (nodeId) => adminMonitorPort.restartNode(nodeId),
  getSystemAuditLogs: (level = 'ALL') => adminMonitorPort.getSystemAuditLogs(level),
};

function createUnconfiguredAdminMonitorPort(): AdminMonitorServicePort {
  const unavailable = (): never => {
    throw new Error('The App Store admin monitor runtime is not configured.');
  };
  return {
    getMetrics: async () => unavailable(),
    getClusterNodes: async () => unavailable(),
    restartNode: async () => unavailable(),
    getSystemAuditLogs: async () => unavailable(),
  };
}
