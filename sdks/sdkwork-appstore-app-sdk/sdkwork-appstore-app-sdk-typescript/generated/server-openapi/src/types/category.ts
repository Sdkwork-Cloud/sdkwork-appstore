import type { CategoryLocalization } from './category-localization';

export interface Category {
  id: string;
  categoryCode: string;
  parentCategoryId?: string;
  categoryLevel: number;
  status: string;
  sortOrder: number;
  iconMediaResourceId?: string;
  localizations: CategoryLocalization[];
}
