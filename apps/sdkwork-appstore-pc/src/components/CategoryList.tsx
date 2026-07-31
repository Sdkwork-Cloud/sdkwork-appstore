import { useNavigate } from 'react-router-dom';
import { CategoryItem, Category } from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate('/search', { state: { filter: categoryName } });
  };

  return (
    <section className="pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#1C1C1E] dark:text-[#F5F5F5]">Browse Categories</h2>
        <button className="text-blue-600 dark:text-[#0A84FF] text-sm font-medium hover:underline cursor-pointer">See All</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat, index) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            index={index}
            onClick={handleCategoryClick}
          />
        ))}
      </div>
    </section>
  );
}
