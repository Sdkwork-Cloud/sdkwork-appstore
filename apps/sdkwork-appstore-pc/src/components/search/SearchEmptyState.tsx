import React from 'react';

export const SearchEmptyState: React.FC = () => {
  return (
    <div className="py-20 text-center text-gray-500 dark:text-gray-400">
      <p className="text-xl font-bold mb-2 text-[#1C1C1E] dark:text-[#F5F5F5]">No Results Found</p>
      <p className="text-sm">Try searching for something else like "Games", "Music", or "Productivity".</p>
    </div>
  );
};
