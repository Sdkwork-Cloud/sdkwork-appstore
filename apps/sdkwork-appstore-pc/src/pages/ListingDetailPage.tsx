import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Star,
  Download,
  Share2,
  Heart,
  ExternalLink,
  Shield,
  Clock,
  Globe,
  ChevronRight,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Smartphone,
} from 'lucide-react';

interface AppInfo {
  id: string;
  displayName: string;
  subtitle?: string;
  developer: string;
  developerId: string;
  iconUrl?: string;
  rating: number;
  ratingCount: number;
  ageRating: string;
  downloads: string;
  pricingModel: string;
  category: string;
  version: string;
  size: string;
  compatibility: string;
  languages: string[];
  lastUpdated: string;
  description: string;
  whatsNew: string;
  screenshots: string[];
  privacyPolicyUrl?: string;
  supportUrl?: string;
  websiteUrl?: string;
}

const mockApp: AppInfo = {
  id: '1',
  displayName: 'Amazing Productivity App',
  subtitle: 'Get things done faster',
  developer: 'SDKWork Technologies',
  developerId: 'dev-1',
  rating: 4.7,
  ratingCount: 12500,
  ageRating: '4+',
  downloads: '100K+',
  pricingModel: 'FREE',
  category: 'Productivity',
  version: '2.5.1',
  size: '45.2 MB',
  compatibility: 'All platforms',
  languages: ['English', 'Chinese', 'Japanese', 'Korean'],
  lastUpdated: '2 days ago',
  description: `This amazing productivity app helps you organize your work and life. With powerful features like task management, calendar integration, and team collaboration, you'll be able to get more done in less time.

Key Features:
• Smart task management with AI-powered suggestions
• Calendar integration with all major providers
• Team collaboration with real-time sync
• Cross-platform support
• Beautiful and intuitive interface
• Offline mode support
• Dark mode
• Widget support`,
  whatsNew: `What's New in Version 2.5.1:

• Fixed a bug where tasks would sometimes not sync properly
• Improved performance for large task lists
• Added support for new languages
• Updated UI components for better accessibility`,
  screenshots: [],
  privacyPolicyUrl: 'https://example.com/privacy',
  supportUrl: 'https://example.com/support',
  websiteUrl: 'https://example.com',
};

export function ListingDetailPage() {
  const { listingSlug } = useParams<{ listingSlug: string }>();
  const navigate = useNavigate();
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullWhatsNew, setShowFullWhatsNew] = useState(false);

  const app = mockApp;

  const ratingStars = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(app.rating)) return 'full';
    if (i < app.rating) return 'half';
    return 'empty';
  });

  const ratingDistribution = [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/category/${app.category.toLowerCase()}`} className="hover:text-blue-500">
          {app.category}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{app.displayName}</span>
      </nav>

      {/* App Header */}
      <div className="flex gap-8 mb-10">
        <div className="w-48 h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl overflow-hidden">
          {app.iconUrl ? (
            <img src={app.iconUrl} alt={app.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <span className="text-6xl font-bold text-white block">{app.displayName[0]}</span>
              <span className="text-xs text-white/80 mt-1 block">{app.category}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{app.displayName}</h1>
          {app.subtitle && (
            <p className="text-lg text-gray-500 mt-1">{app.subtitle}</p>
          )}
          <Link
            to={`/developer/${app.developerId}`}
            className="text-blue-500 hover:text-blue-600 text-sm mt-1 inline-block"
          >
            {app.developer}
          </Link>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {ratingStars.map((star, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      star === 'full'
                        ? 'text-yellow-400 fill-yellow-400'
                        : star === 'half'
                        ? 'text-yellow-400 fill-yellow-400/50'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{app.rating}</span>
              <span className="text-sm text-gray-400">({app.ratingCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="px-2 py-0.5 bg-gray-100 rounded-full">{app.ageRating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Download className="w-4 h-4" />
              <span>{app.downloads}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                {app.pricingModel === 'FREE' ? 'Free' : `$${app.pricingModel}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/25">
              {app.pricingModel === 'FREE' ? 'Get' : 'Buy'}
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isWishlisted
                  ? 'bg-red-50 text-red-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Screenshots</h2>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-64 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex-shrink-0 flex items-center justify-center border border-gray-200"
              >
                <div className="text-center text-gray-400">
                  <Smartphone className="w-12 h-12 mx-auto mb-2" />
                  <span className="text-sm">Screenshot {i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className={`relative ${!showFullDescription ? 'max-h-32 overflow-hidden' : ''}`}>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{app.description}</p>
            {!showFullDescription && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-500 hover:text-blue-600 font-medium mt-2"
          >
            {showFullDescription ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </section>

      {/* What's New */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">What's New</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className={`relative ${!showFullWhatsNew ? 'max-h-24 overflow-hidden' : ''}`}>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{app.whatsNew}</p>
            {!showFullWhatsNew && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          <button
            onClick={() => setShowFullWhatsNew(!showFullWhatsNew)}
            className="text-blue-500 hover:text-blue-600 font-medium mt-2"
          >
            {showFullWhatsNew ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </section>

      {/* Ratings & Reviews */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Ratings & Reviews</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex gap-10">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900">{app.rating}</div>
              <div className="flex items-center gap-0.5 mt-2">
                {ratingStars.map((star, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      star === 'full'
                        ? 'text-yellow-400 fill-yellow-400'
                        : star === 'half'
                        ? 'text-yellow-400 fill-yellow-400/50'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{app.ratingCount.toLocaleString()} ratings</p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-8">{item.stars} ★</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-10 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="mt-8 space-y-6">
            {[
              { user: 'Alex M.', rating: 5, date: '2 days ago', helpful: 24, text: 'This app is amazing! It has completely changed how I organize my work. The AI suggestions are incredibly helpful.' },
              { user: 'Sarah K.', rating: 4, date: '1 week ago', helpful: 12, text: 'Great app overall. Would love to see more customization options in the next update.' },
              { user: 'John D.', rating: 5, date: '2 weeks ago', helpful: 8, text: 'Best productivity app I\'ve ever used. The cross-platform sync works flawlessly.' },
            ].map((review, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{review.user[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.user}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, j) => (
                            <Star
                              key={j}
                              className={`w-3.5 h-3.5 ${
                                j < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 text-blue-500 hover:text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors">
            See All Reviews
          </button>
        </div>
      </section>

      {/* Information */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Information</h2>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          <InfoRow icon={<Globe className="w-5 h-5" />} label="Developer" value={app.developer} />
          <InfoRow icon={<Shield className="w-5 h-5" />} label="Category" value={app.category} />
          <InfoRow icon={<Clock className="w-5 h-5" />} label="Updated" value={app.lastUpdated} />
          <InfoRow icon={<ExternalLink className="w-5 h-5" />} label="Version" value={app.version} />
          <InfoRow icon={<Download className="w-5 h-5" />} label="Size" value={app.size} />
          <InfoRow icon={<Monitor className="w-5 h-5" />} label="Compatibility" value={app.compatibility} />
          <InfoRow icon={<Globe className="w-5 h-5" />} label="Languages" value={app.languages.join(', ')} />
          <InfoRow icon={<Shield className="w-5 h-5" />} label="Age Rating" value={app.ageRating} />
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Privacy</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Privacy Details</h3>
              <p className="text-gray-600 mt-1">
                The developer does not collect any data from this app. Privacy practices may vary based on the features you use.
              </p>
              {app.privacyPolicyUrl && (
                <a
                  href={app.privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 mt-3 inline-flex items-center gap-1"
                >
                  Privacy Policy
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Support</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            {app.websiteUrl && (
              <a
                href={app.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Website</span>
              </a>
            )}
            {app.supportUrl && (
              <a
                href={app.supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Support</span>
              </a>
            )}
            <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Flag className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Report</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="text-gray-400">{icon}</div>
      <span className="text-gray-500 w-32 flex-shrink-0">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}
