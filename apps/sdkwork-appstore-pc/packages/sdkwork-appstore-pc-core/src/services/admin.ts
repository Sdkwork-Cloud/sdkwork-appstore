const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export const AdminMonitorService: IAdminMonitorSDK = {
  getMetrics: async (): Promise<SystemMetrics> => {
    await delay(100);
    return {
      cpuUsage: +(15 + Math.random() * 10).toFixed(1),
      memUsage: +(40 + Math.random() * 5).toFixed(1),
      activeSockets: 1400 + Math.floor(Math.random() * 100),
      requestsPerSec: 300 + Math.floor(Math.random() * 80),
      uptimeDays: 99.98,
    };
  },

  getClusterNodes: async (): Promise<ClusterNode[]> => {
    await delay(150);
    return [
      { id: 'node-hk-01', name: 'hk-east-cluster-01', region: '中国香港', status: '运行良好', cpu: '14.2%', memory: '2.4GB / 8GB', ip: '10.128.0.12' },
      { id: 'node-sg-01', name: 'sg-central-cluster-01', region: '新加坡', status: '运行良好', cpu: '22.8%', memory: '3.1GB / 8GB', ip: '10.132.0.45' },
      { id: 'node-tokyo-02', name: 'jp-tokyo-cluster-02', region: '日本东京', status: '高负载', cpu: '78.5%', memory: '6.8GB / 8GB', ip: '10.140.0.88' },
      { id: 'node-us-01', name: 'us-west-cluster-01', region: '美国硅谷', status: '运行良好', cpu: '19.4%', memory: '2.8GB / 8GB', ip: '10.150.0.19' },
    ];
  },

  restartNode: async (nodeId: string): Promise<boolean> => {
    await delay(800);
    return true;
  },

  getSystemAuditLogs: async (level: string = 'ALL'): Promise<SystemAuditEntry[]> => {
    await delay(120);
    const logs: SystemAuditEntry[] = [
      { id: 'aud-101', timestamp: '10:24:18.420', level: 'INFO', service: 'AuthGateway', event: 'OAuth 2.0 凭证签发成功 [client_id: pc-appstore-shell]', traceId: 'tr-9942a1' },
      { id: 'aud-102', timestamp: '10:22:05.112', level: 'WARN', service: 'MCP-Router', event: 'GitHub MCP Server 响应时延高于预警阈值 (240ms > 200ms)', traceId: 'tr-8831f2' },
      { id: 'aud-103', timestamp: '10:18:49.001', level: 'INFO', service: 'PluginSandbox', event: 'Python 3.12 容器离线隔离算力节点热启动完成', traceId: 'tr-7710c3' },
      { id: 'aud-104', timestamp: '10:15:33.890', level: 'ERROR', service: 'StripeConnector', event: '收到无效签名 HTTP Header (已自动拦截离群请求)', traceId: 'tr-6602d4' },
    ];

    if (level && level !== 'ALL' && level !== '全部') {
      return logs.filter((l) => l.level === level);
    }
    return logs;
  },
};
