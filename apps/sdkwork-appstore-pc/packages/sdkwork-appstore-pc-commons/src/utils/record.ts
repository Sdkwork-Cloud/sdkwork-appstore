import { coalesce, defaultIfBlank } from '@sdkwork/utils';

export function readRecordString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  const values = keys.map((key) => {
    const value = record[key];
    return typeof value === 'string' ? value : undefined;
  });
  return coalesce(...values) ?? '';
}

export function readRecordStringOrDefault(
  record: Record<string, unknown>,
  defaultValue: string,
  ...keys: string[]
): string {
  return defaultIfBlank(readRecordString(record, ...keys), defaultValue);
}

export function readRecordNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return 0;
}

/** @deprecated Use readRecordString */
export const readString = readRecordString;

/** @deprecated Use readRecordNumber */
export const readNumber = readRecordNumber;
