import { isPaidPricingModel } from './pricing';

export type ListingInstallUiState =
  | 'free'
  | 'paid'
  | 'installing'
  | 'installed'
  | 'owned'
  | 'updating'
  | 'disabled';

export interface ResolveListingInstallStateInput {
  pricingModel: string;
  owned: boolean;
  installed: boolean;
  installing: boolean;
  disabled?: boolean;
}

export function resolveListingInstallState(
  input: ResolveListingInstallStateInput,
): ListingInstallUiState {
  if (input.disabled) {
    return 'disabled';
  }
  if (input.installing) {
    return 'installing';
  }
  if (input.owned || input.installed) {
    return input.owned ? 'owned' : 'installed';
  }
  if (isPaidPricingModel(input.pricingModel)) {
    return 'paid';
  }
  return 'free';
}
