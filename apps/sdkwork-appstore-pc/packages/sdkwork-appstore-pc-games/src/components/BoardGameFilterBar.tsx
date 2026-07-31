import React from 'react';

export interface FilterOption {
  name: string;
  filter: string;
}

interface BoardGameFilterBarProps {
  options: FilterOption[];
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const BoardGameFilterBar: React.FC<BoardGameFilterBarProps> = ({
  options,
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
      {options.map((item) => (
        <button
          key={item.name}
          onClick={() => onSelectFilter(item.filter)}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === item.filter
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white/80 dark:bg-[#1a1c23] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252834]'
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
