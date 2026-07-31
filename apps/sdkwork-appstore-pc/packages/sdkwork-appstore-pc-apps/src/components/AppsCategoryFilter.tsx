import React from 'react';
import { useTranslation } from 'react-i18next';

interface AppsCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const AppsCategoryFilter: React.FC<AppsCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const label = t(`apps.categories.${cat}`, cat);
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200/70 dark:bg-[#1a1c23] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#252834]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
