import { useState, useEffect } from 'react';
import { MonitorHeader } from '../components/admin/MonitorHeader';
import { MetricsOverview, MonitorMetrics } from '../components/admin/MetricsOverview';
import { ClusterNodesTable } from '../components/admin/ClusterNodesTable';
import { SystemAuditLog } from '../components/admin/SystemAuditLog';
import { AdminMonitorService, ClusterNode, SystemAuditEntry } from '../services/api';

export default function AdminMonitor() {
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<MonitorMetrics>({
    cpuUsage: 18.4,
    memUsage: 42.1,
    activeSockets: 1420,
    requestsPerSec: 320,
    uptimeDays: 99.98,
  });
  const [nodes, setNodes] = useState<ClusterNode[]>([]);
  const [logs, setLogs] = useState<SystemAuditEntry[]>([]);

  const loadData = async () => {
    try {
      const [m, n, l] = await Promise.all([
        AdminMonitorService.getMetrics(),
        AdminMonitorService.getClusterNodes(),
        AdminMonitorService.getSystemAuditLogs(),
      ]);
      setMetrics(m);
      setNodes(n);
      setLogs(l);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      AdminMonitorService.getMetrics().then((m) => setMetrics(m));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRestartNode = async (nodeId: string) => {
    await AdminMonitorService.restartNode(nodeId);
    const updatedNodes = await AdminMonitorService.getClusterNodes();
    setNodes(updatedNodes);
    const updatedLogs = await AdminMonitorService.getSystemAuditLogs();
    setLogs(updatedLogs);
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-full space-y-6 select-none animate-fade-in">
      {/* Sub-component: Monitor Header */}
      <MonitorHeader
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Sub-component: Top 4 Metrics Cards */}
      <MetricsOverview metrics={metrics} />

      {/* Sub-component: Services Cluster Table */}
      <ClusterNodesTable nodes={nodes} onRestartNode={handleRestartNode} />

      {/* Sub-component: Audit Log */}
      <SystemAuditLog logs={logs} />
    </div>
  );
}

