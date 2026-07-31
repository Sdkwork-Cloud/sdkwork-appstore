export interface ConsoleUser {
  id: string;
  name: string;
  role: string;
}

export const consoleContext = {
  activeTenantId: 'tenant_default',
  permissions: ['console.read', 'console.write']
};
