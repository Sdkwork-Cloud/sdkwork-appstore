export { default as AdminMonitorPage } from '../../../src/pages/AdminMonitor';
export { MonitorHeader } from '../../../src/components/admin/MonitorHeader';
export { MetricsOverview } from '../../../src/components/admin/MetricsOverview';
export { ClusterNodesTable } from '../../../src/components/admin/ClusterNodesTable';
export { SystemAuditLog } from '../../../src/components/admin/SystemAuditLog';

export const adminMonitorRoute = {
  path: '/admin/monitor',
  title: 'Admin Monitor',
  id: 'admin-monitor'
};
