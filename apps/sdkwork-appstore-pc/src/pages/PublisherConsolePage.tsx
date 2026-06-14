import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Package,
  Users,
  Settings,
  Plus,
  TrendingUp,
  Download,
  Star,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Globe,
} from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  status: 'published' | 'draft' | 'in-review' | 'rejected';
  version: string;
  downloads: number;
  rating: number;
  lastUpdated: string;
  iconColor: string;
}

const mockApps: AppItem[] = [
  { id: '1', name: 'Amazing Productivity', status: 'published', version: '2.5.1', downloads: 15000, rating: 4.8, lastUpdated: '2 days ago', iconColor: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Task Manager Pro', status: 'in-review', version: '1.0.0', downloads: 0, rating: 0, lastUpdated: '1 day ago', iconColor: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Quick Notes', status: 'draft', version: '0.9.0', downloads: 0, rating: 0, lastUpdated: '3 days ago', iconColor: 'from-yellow-500 to-orange-500' },
];

export function PublisherConsolePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'team' | 'settings'>('overview');

  const stats = [
    { label: 'Total Apps', value: '3', change: '+1 this month', icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Total Downloads', value: '15.2K', change: '+2.3K this week', icon: Download, color: 'text-green-500', bgColor: 'bg-green-50' },
    { label: 'Average Rating', value: '4.8', change: 'Based on 1.2K ratings', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { label: 'Revenue', value: '$1,234', change: '+$234 this month', icon: TrendingUp, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Developer Console</h1>
        <p className="text-gray-500 mt-2">Manage your apps and publisher account</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        {[
          { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
          { id: 'apps' as const, label: 'My Apps', icon: Package },
          { id: 'team' as const, label: 'Team', icon: Users },
          { id: 'settings' as const, label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <OverviewTab stats={stats} />}
      {activeTab === 'apps' && <AppsTab />}
      {activeTab === 'team' && <TeamTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </div>
  );
}

function OverviewTab({ stats }: { stats: any[] }) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { icon: CheckCircle2, color: 'text-green-500', text: 'Amazing Productivity was approved and published', time: '2 days ago' },
            { icon: Clock, color: 'text-yellow-500', text: 'Task Manager Pro submitted for review', time: '1 day ago' },
            { icon: Download, color: 'text-blue-500', text: '2,345 new downloads this week', time: '3 days ago' },
            { icon: Star, color: 'text-yellow-500', text: 'Received 45 new ratings (average 4.8)', time: '4 days ago' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <activity.icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{activity.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          to="/publisher/apps/new"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Create New App</h4>
            <p className="text-sm text-gray-500">Start building something new</p>
          </div>
        </Link>
        <Link
          to="/publisher/analytics"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">View Analytics</h4>
            <p className="text-sm text-gray-500">Track your app performance</p>
          </div>
        </Link>
        <Link
          to="/publisher/verification"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Verification</h4>
            <p className="text-sm text-gray-500">Verify your identity</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function AppsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">My Apps</h2>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
          New App
        </button>
      </div>

      <div className="space-y-3">
        {mockApps.map((app) => (
          <div
            key={app.id}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all"
          >
            <div className={`w-14 h-14 bg-gradient-to-br ${app.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-xl font-bold text-white">{app.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">{app.name}</h3>
                <StatusBadge status={app.status} />
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-500">v{app.version}</span>
                {app.downloads > 0 && (
                  <span className="text-sm text-gray-500">{app.downloads.toLocaleString()} downloads</span>
                )}
                {app.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-500">{app.rating}</span>
                  </div>
                )}
                <span className="text-sm text-gray-400">Updated {app.lastUpdated}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/publisher/apps/${app.id}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="w-5 h-5 text-gray-500" />
              </Link>
              <Link
                to={`/publisher/apps/${app.id}/edit`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5 text-gray-500" />
              </Link>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamTab() {
  const members = [
    { name: 'John Doe', email: 'john@example.com', role: 'Owner', status: 'active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'active' },
    { name: 'Bob Wilson', email: 'bob@example.com', role: 'Member', status: 'invited' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Team Members</h2>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500">
          <div className="col-span-4">Member</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1"></div>
        </div>
        {members.map((member, i) => (
          <div key={i} className="grid grid-cols-12 px-6 py-4 items-center border-t border-gray-100">
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{member.name[0]}</span>
              </div>
              <span className="font-medium text-gray-900">{member.name}</span>
            </div>
            <div className="col-span-3 text-sm text-gray-500">{member.email}</div>
            <div className="col-span-2">
              <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                {member.role}
              </span>
            </div>
            <div className="col-span-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {member.status}
              </span>
            </div>
            <div className="col-span-1">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-8">
      {/* Profile */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-lg mb-6">Publisher Profile</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              defaultValue="SDKWork Technologies"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Legal Name</label>
            <input
              type="text"
              defaultValue="SDKWork Inc."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              defaultValue="https://sdkwork.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
            <input
              type="email"
              defaultValue="support@sdkwork.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="mt-6 px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600">
          Save Changes
        </button>
      </div>

      {/* Verification */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-lg mb-4">Verification Status</h3>
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Verified Publisher</p>
            <p className="text-sm text-gray-500">Your identity has been verified</p>
          </div>
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Verified
          </span>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">API Keys</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            <Plus className="w-4 h-4" />
            Generate Key
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Production Key', created: 'Jan 15, 2025', lastUsed: '2 hours ago' },
            { name: 'Development Key', created: 'Feb 1, 2025', lastUsed: '1 day ago' },
          ].map((key, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{key.name}</p>
                <p className="text-xs text-gray-400">Created {key.created} • Last used {key.lastUsed}</p>
              </div>
              <button className="text-sm text-red-500 hover:text-red-600 font-medium">Revoke</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    published: { label: 'Published', className: 'bg-green-100 text-green-700' },
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    'in-review': { label: 'In Review', className: 'bg-yellow-100 text-yellow-700' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  }[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
