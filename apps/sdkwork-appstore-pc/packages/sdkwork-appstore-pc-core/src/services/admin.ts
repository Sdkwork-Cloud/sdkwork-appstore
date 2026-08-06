export interface SystemMetrics {
  cpuUsage: number;
  memUsage: number;
  activeSockets: number;
  requestsPerSec: number;
  uptimeDays: number;
}

export interface OperatorDashboard {
  totalListings: number;
  totalDownloads: number;
  totalReviews: number;
  pendingModeration: number;
  activePublishers: number;
  dailyInstalls: number;
}

export interface ModerationQueueItem {
  id: string;
  listingId: string;
  listingName: string;
  submissionType: string;
  status: string;
  submittedAt?: string;
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
  getDashboard(): Promise<OperatorDashboard | undefined>;
  getModerationQueue(): Promise<ModerationQueueItem[]>;
  decideReview(reviewId: string, decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES', reasonDetail?: string): Promise<boolean>;
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
  getDashboard: () => adminMonitorPort.getDashboard(),
  getModerationQueue: () => adminMonitorPort.getModerationQueue(),
  decideReview: (reviewId, decision, reasonDetail) =>
    adminMonitorPort.decideReview(reviewId, decision, reasonDetail),
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
    getDashboard: async () => unavailable(),
    getModerationQueue: async () => unavailable(),
    decideReview: async () => unavailable(),
    getClusterNodes: async () => unavailable(),
    restartNode: async () => unavailable(),
    getSystemAuditLogs: async () => unavailable(),
  };
}
