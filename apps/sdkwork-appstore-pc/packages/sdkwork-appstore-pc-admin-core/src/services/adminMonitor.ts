import type { SdkworkAppstoreBackendClient } from '@sdkwork/appstore-backend-sdk';
import {
  configureAdminMonitorServicePort,
  type AdminMonitorServicePort,
  type ClusterNode,
  type SystemAuditEntry,
  type SystemMetrics,
} from '@sdkwork/appstore-pc-core';

/**
 * Backend-admin monitor surface. Constructed only inside this backend-admin
 * package boundary; the app bootstrap wires the backend SDK client here.
 */
export function configureAppstorePcAdminMonitor(
  client: SdkworkAppstoreBackendClient,
): void {
  configureAdminMonitorServicePort(createAdminMonitorServicePort(client));
}

export function createAdminMonitorServicePort(
  client: SdkworkAppstoreBackendClient,
): AdminMonitorServicePort {
  return {
    async getMetrics(): Promise<SystemMetrics> {
      // Runtime process metrics (CPU/memory/sockets/RPS/uptime) are not
      // exposed by the App Store backend API. The operator dashboard carries
      // storefront scale statistics only, so fail closed instead of returning
      // fabricated runtime numbers; the monitor page keeps its initial state.
      await client.analytics.appstore.analytics.operator.dashboard.retrieve();
      throw new Error('Runtime process metrics are not exposed by the App Store backend API.');
    },

    async getClusterNodes(): Promise<ClusterNode[]> {
      throw new Error('Cluster node management is not exposed by the App Store backend API.');
    },

    async restartNode(): Promise<boolean> {
      throw new Error('Cluster node management is not exposed by the App Store backend API.');
    },

    async getSystemAuditLogs(): Promise<SystemAuditEntry[]> {
      throw new Error('System audit logs are not exposed by the App Store backend API.');
    },
  };
}
