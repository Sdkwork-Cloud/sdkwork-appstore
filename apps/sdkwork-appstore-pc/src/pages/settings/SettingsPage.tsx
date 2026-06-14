import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  HardDrive,
  Accessibility,
  Keyboard,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Check,
} from 'lucide-react';

interface SettingSection {
  id: string;
  label: string;
  icon: any;
}

const sections: SettingSection[] = [
  { id: 'general', label: 'General', icon: Monitor },
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'en',
    autoUpdate: true,
    downloadOverWifi: true,
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    reviewReminders: true,
    biometric: false,
    twoFactor: false,
    analytics: true,
    personalizedAds: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <nav className="space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <section.icon className="w-5 h-5" />
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeSection === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">General</h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ToggleRow
                label="Auto-update apps"
                description="Automatically update apps when new versions are available"
                enabled={settings.autoUpdate}
                onToggle={() => toggleSetting('autoUpdate')}
              />
              <ToggleRow
                label="Download over Wi-Fi only"
                description="Only download apps when connected to Wi-Fi"
                enabled={settings.downloadOverWifi}
                onToggle={() => toggleSetting('downloadOverWifi')}
              />
              <ToggleRow
                label="Usage analytics"
                description="Help improve the store by sharing anonymous usage data"
                enabled={settings.analytics}
                onToggle={() => toggleSetting('analytics')}
              />
            </div>
          </div>
        )}

        {activeSection === 'account' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Account</h2>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">J</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-gray-500">john@example.com</p>
                  <button className="text-blue-500 text-sm mt-1">Edit profile</button>
                </div>
              </div>

              <div className="space-y-4">
                <SettingRow label="Email" value="john@example.com" />
                <SettingRow label="Phone" value="+1 (555) 123-4567" />
                <SettingRow label="Country" value="United States" />
                <SettingRow label="Member since" value="January 2024" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ToggleRow
                label="Two-factor authentication"
                description="Add an extra layer of security to your account"
                enabled={settings.twoFactor}
                onToggle={() => toggleSetting('twoFactor')}
              />
              <ToggleRow
                label="Biometric login"
                description="Use fingerprint or face recognition to sign in"
                enabled={settings.biometric}
                onToggle={() => toggleSetting('biometric')}
              />
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Notifications</h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ToggleRow
                label="Enable notifications"
                description="Receive notifications about app updates and promotions"
                enabled={settings.notifications}
                onToggle={() => toggleSetting('notifications')}
              />
              <ToggleRow
                label="Push notifications"
                description="Receive push notifications on this device"
                enabled={settings.pushNotifications}
                onToggle={() => toggleSetting('pushNotifications')}
              />
              <ToggleRow
                label="Email notifications"
                description="Receive email notifications about your account"
                enabled={settings.emailNotifications}
                onToggle={() => toggleSetting('emailNotifications')}
              />
              <ToggleRow
                label="Review reminders"
                description="Get reminded to review apps you've downloaded"
                enabled={settings.reviewReminders}
                onToggle={() => toggleSetting('reviewReminders')}
              />
            </div>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Privacy & Security</h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ClickableRow label="Privacy policy" description="Read our privacy policy" />
              <ClickableRow label="Terms of service" description="Read our terms of service" />
              <ClickableRow label="Data export" description="Download a copy of your data" />
              <ClickableRow label="Delete account" description="Permanently delete your account and data" danger />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ToggleRow
                label="Personalized recommendations"
                description="Get app recommendations based on your activity"
                enabled={settings.personalizedAds}
                onToggle={() => toggleSetting('personalizedAds')}
              />
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Appearance</h2>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor },
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-colors ${
                      settings.theme === theme.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <theme.icon className={`w-8 h-8 ${settings.theme === theme.id ? 'text-blue-500' : 'text-gray-500'}`} />
                    <span className={`font-medium ${settings.theme === theme.id ? 'text-blue-600' : 'text-gray-700'}`}>
                      {theme.label}
                    </span>
                    {settings.theme === theme.id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'language' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Language & Region</h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ClickableRow label="Language" value="English (US)" />
              <ClickableRow label="Region" value="United States" />
              <ClickableRow label="Date format" value="MM/DD/YYYY" />
              <ClickableRow label="Time format" value="12-hour" />
            </div>
          </div>
        )}

        {activeSection === 'downloads' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Downloads</h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ClickableRow label="Download location" value="C:\Users\John\Downloads\SDKWork" />
              <ToggleRow
                label="Auto-install after download"
                description="Automatically install apps after downloading"
                enabled={false}
                onToggle={() => {}}
              />
              <ToggleRow
                label="Download queue"
                description="Queue downloads when multiple apps are being downloaded"
                enabled={true}
                onToggle={() => {}}
              />
            </div>
          </div>
        )}

        {activeSection === 'storage' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Storage</h2>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Storage used</span>
                <span className="text-gray-500">2.4 GB of 50 GB</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '4.8%' }} />
              </div>

              <div className="space-y-4">
                <StorageRow label="Apps" size="1.8 GB" percentage={75} />
                <StorageRow label="Cache" size="450 MB" percentage={18} />
                <StorageRow label="Downloads" size="150 MB" percentage={6} />
              </div>
            </div>

            <button className="px-6 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100">
              Clear Cache
            </button>
          </div>
        )}

        {activeSection === 'accessibility' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Accessibility</h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ToggleRow
                label="High contrast"
                description="Increase contrast for better visibility"
                enabled={false}
                onToggle={() => {}}
              />
              <ToggleRow
                label="Reduce motion"
                description="Minimize animations and transitions"
                enabled={false}
                onToggle={() => {}}
              />
              <ToggleRow
                label="Large text"
                description="Increase text size throughout the app"
                enabled={false}
                onToggle={() => {}}
              />
              <ToggleRow
                label="Screen reader support"
                description="Optimize for screen readers"
                enabled={false}
                onToggle={() => {}}
              />
            </div>
          </div>
        )}

        {activeSection === 'shortcuts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              <ShortcutRow action="Search" shortcut="⌘ K" />
              <ShortcutRow action="Home" shortcut="⌘ 1" />
              <ShortcutRow action="Library" shortcut="⌘ 2" />
              <ShortcutRow action="Settings" shortcut="⌘ ," />
              <ShortcutRow action="Refresh" shortcut="⌘ R" />
              <ShortcutRow action="Back" shortcut="⌘ [" />
              <ShortcutRow action="Forward" shortcut="⌘ ]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ label, description, enabled, onToggle }: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-blue-500' : 'bg-gray-200'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function ClickableRow({ label, description, value, danger }: {
  label: string;
  description?: string;
  value?: string;
  danger?: boolean;
}) {
  return (
    <button className="flex items-center justify-between w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left">
      <div>
        <p className={`font-medium ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-gray-500">{value}</span>}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
}

function StorageRow({ label, size, percentage }: { label: string; size: string; percentage: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-700 w-24">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-gray-500 w-20 text-right">{size}</span>
    </div>
  );
}

function ShortcutRow({ action, shortcut }: { action: string; shortcut: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-gray-700">{action}</span>
      <kbd className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">{shortcut}</kbd>
    </div>
  );
}
