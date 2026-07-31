export const admin = {
  header: {
    badge: 'Operations Hub',
    title: 'Cluster Monitoring & System Audit Logs',
    subtitle: 'Real-time monitoring of microservice nodes, CPU/Memory load, API throughput, and security audit trails.',
    refreshBtn: 'Refresh Status',
    refreshing: 'Refreshing...'
  },
  metrics: {
    cpu: 'Avg CPU Load',
    cpuUsage: 'CPU Utilization',
    memory: 'Memory Usage',
    memUsage: 'Memory Usage',
    requests: 'API QPS',
    qps: 'Throughput QPS',
    responseTime: 'Response Time < 12ms',
    activeSessions: 'Active Sessions',
    uptime: 'System Uptime',
    sla: 'SLA Uptime',
    allNodesNormal: 'All Nodes Operational'
  },
  cluster: {
    title: 'Distributed Cluster Nodes Status',
    nodeName: 'Node Name',
    region: 'Region',
    status: 'Status',
    latency: 'Latency',
    load: 'Node Load',
    restartNode: 'Restart Cluster Node',
    ports: 'Port:',
    restartSuccess: 'Restart signal sent for node [{{name}}]',
    thService: 'Service Component',
    thNodeId: 'Node ID',
    thPort: 'Port',
    thStatus: 'Status',
    thLatency: 'Latency',
    thActions: 'Actions',
    healthy: 'Healthy',
    highLoad: 'High Load'
  },
  audit: {
    title: 'System Security Audit Log',
    timestamp: 'Timestamp',
    user: 'User',
    action: 'Action',
    ip: 'Source IP',
    status: 'Result',
    exportCsv: 'Export CSV',
    noLogs: 'No logs found for level {{level}}'
  },
  loading: 'Loading system monitoring data...'
};

