function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

let organizationResolver: (() => string | undefined) | null = null;

/** Supplies organization id for Drive uploads (IAM session or publisher profile). */
export function configurePublisherOrganizationResolver(
  resolver: () => string | undefined,
): void {
  organizationResolver = resolver;
}

export function resolveOrganizationId(publisher: unknown): string {
  const row = (publisher ?? {}) as Record<string, unknown>;
  return (
    readString(row, 'organizationId', 'organization_id') ||
    organizationResolver?.() ||
    ''
  );
}
