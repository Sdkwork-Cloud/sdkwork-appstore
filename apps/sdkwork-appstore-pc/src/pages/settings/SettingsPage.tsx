import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { fetchCurrentIamUser, getCurrentUser, type IamUser } from '@/bootstrap/iamRuntime';
import { isAuthenticated } from '@/services/storeClient';
import { LoadingSpinner } from '@sdkwork/appstore-pc-commons';
import { useTheme } from '@/hooks/useTheme';

interface SettingSection {
  id: string;
  label: string;
  icon: typeof Monitor;
}

const sections: SettingSection[] = [
  { id: 'general', label: '通用', icon: Monitor },
  { id: 'account', label: '账户', icon: User },
  { id: 'notifications', label: '通知', icon: Bell },
  { id: 'privacy', label: '隐私与安全', icon: Shield },
  { id: 'appearance', label: '外观', icon: Palette },
  { id: 'language', label: '语言与地区', icon: Globe },
  { id: 'downloads', label: '下载', icon: Download },
  { id: 'storage', label: '存储', icon: HardDrive },
  { id: 'accessibility', label: '无障碍', icon: Accessibility },
  { id: 'shortcuts', label: '键盘快捷键', icon: Keyboard },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const { theme, setTheme } = useTheme();
  const [iamUser, setIamUser] = useState<IamUser | null>(getCurrentUser());
  const [accountLoading, setAccountLoading] = useState(false);
  const [settings, setSettings] = useState({
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

  useEffect(() => {
    if (!isAuthenticated()) {
      setIamUser(null);
      return;
    }
    let cancelled = false;
    setAccountLoading(true);
    void fetchCurrentIamUser()
      .then((user) => {
        if (!cancelled) {
          setIamUser(user);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAccountLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const displayInitial =
    iamUser?.displayName?.trim()?.[0]?.toUpperCase() ||
    iamUser?.email?.trim()?.[0]?.toUpperCase() ||
    '?';

  return (
    <div className="flex gap-8">
      <div className="w-64 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">设置</h1>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-canvas)]'
              }`}
            >
              <section.icon className="w-5 h-5" />
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1">
        {activeSection === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">通用</h2>
            <div className="card divide-y divide-[var(--border-subtle)]">
              <ToggleRow
                label="自动更新应用"
                description="有新版本时自动更新已安装应用"
                enabled={settings.autoUpdate}
                onToggle={() => toggleSetting('autoUpdate')}
              />
              <ToggleRow
                label="仅 Wi-Fi 下载"
                description="仅在连接 Wi-Fi 时下载应用"
                enabled={settings.downloadOverWifi}
                onToggle={() => toggleSetting('downloadOverWifi')}
              />
              <ToggleRow
                label="使用情况分析"
                description="分享匿名使用数据以帮助改进应用商店"
                enabled={settings.analytics}
                onToggle={() => toggleSetting('analytics')}
              />
            </div>
          </div>
        )}

        {activeSection === 'account' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">账户</h2>

            {!isAuthenticated() ? (
              <div className="card p-8 text-center">
                <p className="text-[var(--text-secondary)] mb-4">登录 SDKWork 账户以查看个人资料与组织信息。</p>
                <Link
                  to="/login"
                  className="inline-flex px-6 py-2.5 bg-[var(--accent)] text-[var(--text-inverse)] rounded-full text-sm font-medium hover:opacity-90"
                >
                  前往登录
                </Link>
              </div>
            ) : accountLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-active))',
                      }}
                    >
                      <span className="text-3xl font-bold" style={{ color: 'var(--text-inverse)' }}>
                        {displayInitial}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        {iamUser?.displayName || 'SDKWork 用户'}
                      </h3>
                      <p className="text-[var(--text-tertiary)]">{iamUser?.email || '未绑定邮箱'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SettingRow label="用户 ID" value={iamUser?.userId || '—'} />
                    <SettingRow label="邮箱" value={iamUser?.email || '—'} />
                    <SettingRow label="组织 ID" value={iamUser?.organizationId || '—'} />
                  </div>
                </div>

                <div className="card divide-y divide-[var(--border-subtle)]">
                  <ToggleRow
                    label="双因素认证"
                    description="为账户增加一层安全保护（IAM 控制台配置）"
                    enabled={settings.twoFactor}
                    onToggle={() => toggleSetting('twoFactor')}
                  />
                  <ToggleRow
                    label="生物识别登录"
                    description="使用指纹或面容识别登录（宿主能力接入后启用）"
                    enabled={settings.biometric}
                    onToggle={() => toggleSetting('biometric')}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">通知</h2>
            <div className="card divide-y divide-[var(--border-subtle)]">
              <ToggleRow
                label="启用通知"
                description="接收应用更新与活动通知"
                enabled={settings.notifications}
                onToggle={() => toggleSetting('notifications')}
              />
              <ToggleRow
                label="推送通知"
                description="在本设备接收推送通知"
                enabled={settings.pushNotifications}
                onToggle={() => toggleSetting('pushNotifications')}
              />
              <ToggleRow
                label="邮件通知"
                description="接收账户相关邮件通知"
                enabled={settings.emailNotifications}
                onToggle={() => toggleSetting('emailNotifications')}
              />
              <ToggleRow
                label="评价提醒"
                description="提醒你对已下载应用进行评价"
                enabled={settings.reviewReminders}
                onToggle={() => toggleSetting('reviewReminders')}
              />
            </div>
            <p className="text-sm text-[var(--text-tertiary)]">
              通知列表在「消息」页展示；推送通道接入后将与此处偏好同步。
            </p>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">隐私与安全</h2>
            <div className="card divide-y divide-[var(--border-subtle)]">
              <ClickableRow label="隐私政策" description="阅读隐私政策" />
              <ClickableRow label="服务条款" description="阅读服务条款" />
              <ClickableRow label="导出数据" description="下载你的数据副本" />
              <ClickableRow label="删除账户" description="永久删除账户与数据" danger />
            </div>
            <div className="card divide-y divide-[var(--border-subtle)]">
              <ToggleRow
                label="个性化推荐"
                description="根据你的活动推荐应用"
                enabled={settings.personalizedAds}
                onToggle={() => toggleSetting('personalizedAds')}
              />
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">外观</h2>
            <div className="card p-6">
              <h3 className="font-semibold mb-4 text-[var(--text-primary)]">主题</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {[
                  { id: 'light' as const, label: '浅色', icon: Sun },
                  { id: 'dark' as const, label: '深色', icon: Moon },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTheme(option.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-colors ${
                      theme === option.id
                        ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                        : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <option.icon
                      className="w-8 h-8"
                      style={{ color: theme === option.id ? 'var(--accent)' : 'var(--text-tertiary)' }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: theme === option.id ? 'var(--accent)' : 'var(--text-primary)' }}
                    >
                      {option.label}
                    </span>
                    {theme === option.id && <Check className="w-5 h-5 text-[var(--accent)]" />}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-[var(--text-tertiary)]">也可在顶栏快速切换深色模式。</p>
            </div>
          </div>
        )}

        {activeSection === 'language' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">语言与地区</h2>
            <div className="card divide-y divide-[var(--border-subtle)]">
              <ClickableRow label="界面语言" value="简体中文" />
              <ClickableRow label="地区" value="中国大陆" />
              <ClickableRow label="日期格式" value="YYYY-MM-DD" />
              <ClickableRow label="时间格式" value="24 小时制" />
            </div>
          </div>
        )}

        {activeSection === 'downloads' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">下载</h2>
            <div className="card divide-y divide-[var(--border-subtle)]">
              <ClickableRow label="下载位置" value="由宿主/浏览器管理" />
              <ToggleRow
                label="下载后自动安装"
                description="下载完成后自动安装（桌面宿主能力）"
                enabled={false}
                onToggle={() => {}}
              />
              <ToggleRow
                label="下载队列"
                description="多个应用同时下载时排队"
                enabled
                onToggle={() => {}}
              />
            </div>
          </div>
        )}

        {activeSection === 'storage' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">存储</h2>
            <div className="card p-6">
              <p className="text-[var(--text-secondary)]">
                本地缓存与已安装应用占用将在桌面宿主接入后在此展示。Web 版暂不统计本地磁盘用量。
              </p>
            </div>
          </div>
        )}

        {activeSection === 'accessibility' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">无障碍</h2>
            <div className="card divide-y divide-[var(--border-subtle)]">
              <ToggleRow label="高对比度" description="提高界面对比度" enabled={false} onToggle={() => {}} />
              <ToggleRow label="减少动效" description="减少动画与过渡效果" enabled={false} onToggle={() => {}} />
              <ToggleRow label="大号文字" description="增大全局文字尺寸" enabled={false} onToggle={() => {}} />
              <ToggleRow label="屏幕阅读器优化" description="针对读屏软件优化" enabled={false} onToggle={() => {}} />
            </div>
          </div>
        )}

        {activeSection === 'shortcuts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">键盘快捷键</h2>
            <div className="card divide-y divide-[var(--border-subtle)]">
              <ShortcutRow action="搜索" shortcut="Ctrl K" />
              <ShortcutRow action="首页" shortcut="Ctrl 1" />
              <ShortcutRow action="库" shortcut="Ctrl 2" />
              <ShortcutRow action="设置" shortcut="Ctrl ," />
              <ShortcutRow action="刷新" shortcut="Ctrl R" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-sm text-[var(--text-tertiary)]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'}`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className="font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function ClickableRow({
  label,
  description,
  value,
  danger,
}: {
  label: string;
  description?: string;
  value?: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-between w-full px-6 py-4 hover:bg-[var(--bg-canvas)] transition-colors text-left"
    >
      <div>
        <p className={`font-medium ${danger ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}`}>{label}</p>
        {description && <p className="text-sm text-[var(--text-tertiary)]">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-[var(--text-tertiary)]">{value}</span>}
        <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
      </div>
    </button>
  );
}

function ShortcutRow({ action, shortcut }: { action: string; shortcut: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-[var(--text-secondary)]">{action}</span>
      <kbd className="px-3 py-1.5 bg-[var(--bg-canvas)] rounded-lg text-sm font-mono text-[var(--text-secondary)]">
        {shortcut}
      </kbd>
    </div>
  );
}
