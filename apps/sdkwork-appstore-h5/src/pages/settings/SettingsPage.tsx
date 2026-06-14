import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  HardDrive,
  ChevronRight,
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Check,
} from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('system');

  const sections = [
    { label: 'Account', icon: User, path: '/settings/account' },
    { label: 'Notifications', icon: Bell, path: '/settings/notifications' },
    { label: 'Privacy & Security', icon: Shield, path: '/settings/privacy' },
    { label: 'Appearance', icon: Palette, path: '/settings/appearance' },
    { label: 'Language & Region', icon: Globe, path: '/settings/language' },
    { label: 'Downloads', icon: Download, path: '/settings/downloads' },
    { label: 'Storage', icon: HardDrive, path: '/settings/storage' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Settings</h1>
        </div>
      </header>

      {/* Profile Card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">J</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">John Doe</h3>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
        </div>
      </div>

      {/* Theme Selection */}
      <div className="px-4 py-2">
        <h3 className="text-sm font-medium text-gray-500 mb-3 px-1">Appearance</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 ${
                theme === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <t.icon className={`w-6 h-6 ${theme === t.id ? 'text-blue-500' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${theme === t.id ? 'text-blue-600' : 'text-gray-700'}`}>
                {t.label}
              </span>
              {theme === t.id && <Check className="w-4 h-4 text-blue-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Settings List */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          {sections.map((section, i) => (
            <button
              key={i}
              className="flex items-center gap-4 w-full px-4 py-4 border-b border-gray-100 last:border-0"
            >
              <section.icon className="w-5 h-5 text-gray-500" />
              <span className="flex-1 text-left font-medium text-gray-900">{section.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">SDKWork App Store</p>
            <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
