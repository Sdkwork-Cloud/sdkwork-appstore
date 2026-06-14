import { useState } from 'react';
import {
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

interface UpdateItem {
  id: string;
  appName: string;
  currentVersion: string;
  newVersion: string;
  size: string;
  releaseDate: string;
  iconColor: string;
  status: 'available' | 'downloading' | 'installed';
  progress?: number;
  changelog: string[];
  security: boolean;
}

const mockUpdates: UpdateItem[] = [
  {
    id: '1',
    appName: 'Amazing Productivity',
    currentVersion: '2.5.0',
    newVersion: '2.5.1',
    size: '2.3 MB',
    releaseDate: '2 days ago',
    iconColor: 'from-blue-500 to-cyan-500',
    status: 'available',
    changelog: [
      'Fixed sync issues with cloud storage',
      'Improved performance for large task lists',
      'Added dark mode support',
      'Bug fixes and stability improvements',
    ],
    security: false,
  },
  {
    id: '2',
    appName: 'Photo Editor Pro',
    currentVersion: '3.1.0',
    newVersion: '3.2.0',
    size: '15.8 MB',
    releaseDate: '1 day ago',
    iconColor: 'from-purple-500 to-pink-500',
    status: 'available',
    changelog: [
      'New AI-powered background removal tool',
      'Added 50+ new filters and effects',
      'Improved export quality options',
      'Performance optimizations',
    ],
    security: false,
  },
  {
    id: '3',
    appName: 'Weather Now',
    currentVersion: '1.8.2',
    newVersion: '1.8.3',
    size: '856 KB',
    releaseDate: '3 hours ago',
    iconColor: 'from-cyan-500 to-blue-500',
    status: 'downloading',
    progress: 65,
    changelog: [
      'Critical security patch',
      'Fixed location accuracy issues',
      'Updated weather data providers',
    ],
    security: true,
  },
  {
    id: '4',
    appName: 'Fitness Tracker',
    currentVersion: '2.0.0',
    newVersion: '2.0.0',
    size: '0 KB',
    releaseDate: 'Today',
    iconColor: 'from-green-500 to-emerald-500',
    status: 'installed',
    changelog: [],
    security: false,
  },
];

export function UpdatesPage() {
  const [updates, setUpdates] = useState(mockUpdates);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const availableUpdates = updates.filter(u => u.status === 'available' || u.status === 'downloading');
  const installedUpdates = updates.filter(u => u.status === 'installed');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const startUpdate = (id: string) => {
    setUpdates(prev =>
      prev.map(u => u.id === id ? { ...u, status: 'downloading' as const, progress: 0 } : u)
    );

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUpdates(prev =>
          prev.map(u => u.id === id ? { ...u, status: 'installed' as const, progress: 100 } : u)
        );
      } else {
        setUpdates(prev =>
          prev.map(u => u.id === id ? { ...u, progress: Math.round(progress) } : u)
        );
      }
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">App Updates</h1>
          <p className="text-gray-500 mt-1">
            {availableUpdates.length > 0
              ? `${availableUpdates.length} update${availableUpdates.length > 1 ? 's' : ''} available`
              : 'All apps are up to date'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Check for Updates
        </button>
      </div>

      {/* Available Updates */}
      {availableUpdates.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4">Available Updates</h2>
          <div className="space-y-3">
            {availableUpdates.map(update => (
              <div key={update.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <div className={`w-14 h-14 bg-gradient-to-br ${update.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xl font-bold text-white">{update.appName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{update.appName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">{update.currentVersion}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-blue-600">{update.newVersion}</span>
                      <span className="text-sm text-gray-400">({update.size})</span>
                      {update.security && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">
                          <Shield className="w-3 h-3" />
                          Security
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {update.status === 'available' && (
                      <button
                        onClick={() => startUpdate(update.id)}
                        className="px-5 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        Update
                      </button>
                    )}
                    {update.status === 'downloading' && (
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${update.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{update.progress}%</span>
                      </div>
                    )}
                    <button
                      onClick={() => toggleExpand(update.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      {expandedId === update.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Changelog */}
                {expandedId === update.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 mt-4">What's New</h4>
                    <ul className="space-y-2">
                      {update.changelog.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">Released {update.releaseDate}</span>
                      <a href="#" className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1">
                        Full release notes
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
            Update All ({availableUpdates.filter(u => u.status === 'available').length} apps)
          </button>
        </section>
      )}

      {/* Installed Updates */}
      {installedUpdates.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">Recently Updated</h2>
          <div className="space-y-3">
            {installedUpdates.map(update => (
              <div key={update.id} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100">
                <div className={`w-14 h-14 bg-gradient-to-br ${update.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl font-bold text-white">{update.appName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{update.appName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Up to date</span>
                    <span className="text-sm text-gray-400">v{update.newVersion}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{update.releaseDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Auto-update settings */}
      <section className="mt-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Auto-update apps</h3>
              <p className="text-sm text-gray-500 mt-0.5">Automatically update apps when new versions are available</p>
            </div>
            <button className="w-12 h-7 bg-blue-500 rounded-full">
              <div className="w-5 h-5 bg-white rounded-full shadow translate-x-6" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
