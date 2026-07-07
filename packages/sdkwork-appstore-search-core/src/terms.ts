import { coalesce } from '@sdkwork/utils';

export function readSearchTerm(item: unknown): string {
  if (!item || typeof item !== 'object') {
    return '';
  }
  const record = item as Record<string, unknown>;
  const value = coalesce(
    readString(record.term),
    readString(record.queryText),
    readString(record.query_text),
    readString(record.q),
  );
  return value ?? '';
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
