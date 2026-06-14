import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Download,
  Share2,
  Heart,
  Shield,
  Globe,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Flag,
  ThumbsUp,
} from 'lucide-react';

export function ListingDetailPage() {
  const { listingSlug } = useParams<{ listingSlug: string }>();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const app = {
    name: 'Amazing Productivity',
    subtitle: 'Get things done faster',
    developer: 'SDKWork Technologies',
    rating: 4.7,
    ratingCount: 12500,
    ageRating: '4+',
    downloads: '100K+',
    pricingModel: 'FREE',
    category: 'Productivity',
    version: '2.5.1',
    size: '45.2 MB',
    description: 'This amazing productivity app helps you organize your work and life. With powerful features like task management, calendar integration, and team collaboration, you will be able to get more done in less time.',
    whatsNew: 'Fixed sync issues. Improved performance. Added dark mode support.',
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => setIsWishlisted(!isWishlisted)} className="w-10 h-10 flex items-center justify-center">
              <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="pt-14 pb-24">
        {/* App Info */}
        <section className="px-4 py-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">{app.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold">{app.name}</h1>
              <p className="text-sm text-gray-500">{app.subtitle}</p>
              <Link to="#" className="text-sm text-blue-500">{app.developer}</Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 pb-4">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-sm">{app.rating}</span>
              </div>
              <span className="text-xs text-gray-400">{(app.ratingCount / 1000).toFixed(1)}K</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{app.ageRating}</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <Download className="w-4 h-4 mx-auto text-gray-500" />
              <span className="text-xs text-gray-500">{app.downloads}</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <span className="text-xs font-medium text-blue-500">
                {app.pricingModel === 'FREE' ? 'Free' : `$${app.pricingModel}`}
              </span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="px-4 pb-4">
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-blue-500 text-white rounded-full font-semibold active:bg-blue-600">
              {app.pricingModel === 'FREE' ? 'Get' : 'Buy'}
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Screenshots */}
        <section className="pb-4">
          <div className="flex gap-3 overflow-x-auto px-4 pb-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-40 h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Screenshot {i}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="px-4 py-4">
          <h2 className="font-bold mb-2">Description</h2>
          <div className={`relative ${!showFullDesc ? 'max-h-20 overflow-hidden' : ''}`}>
            <p className="text-sm text-gray-600 leading-relaxed">{app.description}</p>
            {!showFullDesc && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-sm text-blue-500 mt-1">
            {showFullDesc ? 'Less' : 'More'}
          </button>
        </section>

        {/* What's New */}
        <section className="px-4 py-4 border-t border-gray-100">
          <h2 className="font-bold mb-2">What's New</h2>
          <p className="text-sm text-gray-600">{app.whatsNew}</p>
        </section>

        {/* Information */}
        <section className="px-4 py-4 border-t border-gray-100">
          <h2 className="font-bold mb-3">Information</h2>
          <div className="space-y-3">
            <InfoRow label="Developer" value={app.developer} />
            <InfoRow label="Category" value={app.category} />
            <InfoRow label="Version" value={app.version} />
            <InfoRow label="Size" value={app.size} />
            <InfoRow label="Compatibility" value="All devices" />
            <InfoRow label="Languages" value="English, Chinese" />
          </div>
        </section>

        {/* Reviews */}
        <section className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Reviews</h2>
            <button className="text-sm text-blue-500">See All</button>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Alex', rating: 5, text: 'Amazing app! Highly recommended.', time: '2d ago' },
              { user: 'Sarah', rating: 4, text: 'Great app, would love more features.', time: '1w ago' },
            ].map((review, i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{review.user[0]}</span>
                  </div>
                  <span className="font-medium text-sm">{review.user}</span>
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.text}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{review.time}</span>
                  <button className="flex items-center gap-1 text-xs text-gray-400">
                    <ThumbsUp className="w-3 h-3" /> Helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 z-50">
        <button className="w-full py-3 bg-blue-500 text-white rounded-full font-semibold flex items-center justify-center gap-2 active:bg-blue-600">
          <Download className="w-5 h-5" />
          Install
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
