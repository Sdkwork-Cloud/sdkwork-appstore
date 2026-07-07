import {
  Gamepad2,
  MessageCircle,
  Wrench,
  GraduationCap,
  Briefcase,
  Clapperboard,
  Wallet,
  Heart,
  Activity,
  Camera,
  Music,
  Video,
  Newspaper,
  Zap,
  Code,
  Shield,
  Mail,
  ShoppingBag,
  Plane,
  UtensilsCrossed,
  CloudSun,
  Timer,
  BookOpen,
  Palette,
  Globe,
  Stethoscope,
  Building2,
  Cpu,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';

interface CategoryIconMatch {
  keywords: string[];
  icon: LucideIcon;
  color: string;
}

const CATEGORY_ICON_MAP: CategoryIconMatch[] = [
  { keywords: ['game', '游戏'], icon: Gamepad2, color: '#7c3aed' },
  { keywords: ['social', '社交'], icon: MessageCircle, color: '#3b82f6' },
  { keywords: ['tool', 'util', '工具'], icon: Wrench, color: '#6b7280' },
  { keywords: ['edu', '教育', 'learn'], icon: GraduationCap, color: '#0891b2' },
  { keywords: ['business', '商务', 'office'], icon: Briefcase, color: '#475569' },
  { keywords: ['entertain', '娱乐'], icon: Clapperboard, color: '#e11d48' },
  { keywords: ['finance', '财务', 'money'], icon: Wallet, color: '#059669' },
  { keywords: ['lifestyle', '生活'], icon: Heart, color: '#ec4899' },
  { keywords: ['health', '健康', 'fitness'], icon: Activity, color: '#dc2626' },
  { keywords: ['photo', '摄影', 'camera'], icon: Camera, color: '#9333ea' },
  { keywords: ['music', '音乐'], icon: Music, color: '#6366f1' },
  { keywords: ['video', '视频', 'media'], icon: Video, color: '#db2777' },
  { keywords: ['news', '新闻'], icon: Newspaper, color: '#0369a1' },
  { keywords: ['productiv', '效率'], icon: Zap, color: '#eab308' },
  { keywords: ['develop', '开发者', 'dev', 'code'], icon: Code, color: '#18181b' },
  { keywords: ['security', '安全'], icon: Shield, color: '#15803d' },
  { keywords: ['comm', '通讯', 'message'], icon: Mail, color: '#0284c7' },
  { keywords: ['shop', '购物', 'commerce'], icon: ShoppingBag, color: '#f59e0b' },
  { keywords: ['travel', '旅行'], icon: Plane, color: '#0d9488' },
  { keywords: ['food', '美食', 'drink'], icon: UtensilsCrossed, color: '#ea580c' },
  { keywords: ['weather', '天气'], icon: CloudSun, color: '#0ea5e9' },
  { keywords: ['timer', 'clock'], icon: Timer, color: '#7c2d12' },
  { keywords: ['book', '阅读', 'reading'], icon: BookOpen, color: '#92400e' },
  { keywords: ['design', 'art', '设计'], icon: Palette, color: '#be185d' },
  { keywords: ['network', '网络', 'internet'], icon: Globe, color: '#0284c7' },
  { keywords: ['medical', '医疗'], icon: Stethoscope, color: '#dc2626' },
  { keywords: ['enterprise', '企业'], icon: Building2, color: '#334155' },
  { keywords: ['system', 'driver', '系统'], icon: Cpu, color: '#475569' },
];

/**
 * Returns a differentiated icon and color for a given category name.
 * Falls back to a grid icon if no match is found.
 */
export function getCategoryIcon(categoryId: string, categoryTitle: string): {
  Icon: LucideIcon;
  color: string;
} {
  const haystack = `${categoryId} ${categoryTitle}`.toLowerCase();
  for (const match of CATEGORY_ICON_MAP) {
    if (match.keywords.some((kw) => haystack.includes(kw.toLowerCase()))) {
      return { Icon: match.icon, color: match.color };
    }
  }
  return { Icon: LayoutGrid, color: 'var(--accent)' };
}
