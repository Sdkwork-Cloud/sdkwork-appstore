export interface CompliancePermissionUpdateRequest {
  permissions: { permissionCode: string; usagePurpose: string; isRequired?: boolean; }[];
}
