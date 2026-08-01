export interface AppstorePcAdminSessionPort {
  hasPermission(permission: string): Promise<boolean>;
}
