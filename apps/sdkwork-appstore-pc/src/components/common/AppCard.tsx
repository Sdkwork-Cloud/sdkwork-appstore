import { Link } from 'react-router-dom';
import { Star, Download } from 'lucide-react';
import type { ListingSummary } from '@sdk/generated/server-openapi';

interface AppCardProps {
  app: ListingSummary;
  layout?: 'grid' | 'list';
}

export function AppCard({ app, layout = 'grid' }: AppCardProps) {
  if (layout === 'list') {
    return (
      <Link
        to={`/app/${app.listingSlug}`}
        className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-all duration-300 group"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
          {app.icon?.url ? (
            <img src={app.icon.url} alt={app.displayName} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-2xl font-bold text-white">{app.displayName[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {app.displayName}
          </h3>
          {app.subtitle && (
            <p className="text-sm text-gray-500 truncate">{app.subtitle}</p>
          )}
          <div className="flex items-center gap-4 mt-1">
            {app.averageRating && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-600">{app.averageRating}</span>
              </div>
            )}
            <span className="text-xs text-gray-400">
              {app.pricingModel === 'FREE' ? 'Free' : `$${app.pricingModel}`}
            </span>
          </div>
        </div>
        <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors">
          {app.pricingModel === 'FREE' ? 'Get' : 'Buy'}
        </button>
      </Link>
    );
  }

  return (
    <Link
      to={`/app/${app.listingSlug}`}
      className="group block"
    >
      <div className="bg-white rounded-2xl p-4 hover:shadow-md transition-all duration-300">
        <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
          {app.icon?.url ? (
            <img src={app.icon.url} alt={app.displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-white">{app.displayName[0]}</span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {app.displayName}
        </h3>
        {app.subtitle && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{app.subtitle}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {app.averageRating && (
              <>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-600">{app.averageRating}</span>
              </>
            )}
          </div>
          <span className="text-xs font-medium text-blue-500">
            {app.pricingModel === 'FREE' ? 'Free' : `$${app.pricingModel}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
