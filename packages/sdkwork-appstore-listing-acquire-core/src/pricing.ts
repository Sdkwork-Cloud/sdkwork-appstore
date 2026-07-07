import { trim } from '@sdkwork/utils';

const PAID_MODELS = new Set(['PAID', 'SUBSCRIPTION', 'PREMIUM']);

export function normalizePricingModel(value: string | undefined | null): string {
  return trim(value ?? '').toUpperCase();
}

export function isPaidPricingModel(value: string | undefined | null): boolean {
  return PAID_MODELS.has(normalizePricingModel(value));
}

export function isFreePricingModel(value: string | undefined | null): boolean {
  const model = normalizePricingModel(value);
  return model === '' || model === 'FREE' || model === 'FREEMIUM';
}
