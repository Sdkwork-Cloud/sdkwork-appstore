import { trim } from '@sdkwork/utils';

export interface ListingReportReason {
  value: string;
  label: string;
  description?: string;
}

export const LISTING_REPORT_REASONS: ListingReportReason[] = [
  { value: 'offensive', label: '冒犯性内容', description: '含仇恨、歧视或令人不适的内容' },
  { value: 'spam', label: '垃圾信息', description: '误导性描述、关键词堆砌或重复发布' },
  { value: 'malware', label: '恶意软件', description: '疑似病毒、间谍软件或有害行为' },
  { value: 'copyright', label: '侵权或抄袭', description: '侵犯版权、商标或其他知识产权' },
  { value: 'misleading', label: '与描述不符', description: '实际功能与宣传严重不符' },
  { value: 'other', label: '其他问题', description: '上述未涵盖的问题' },
];

export interface ListingReportContext {
  listingId: string;
  displayName: string;
  reasonValue: string;
  reasons: ListingReportReason[];
  supportUrl?: string;
  platformReportEmail?: string;
}

export interface ListingReportOutcome {
  title: string;
  message: string;
  channelOpened: boolean;
}

export function openListingReportChannel(context: ListingReportContext): ListingReportOutcome {
  const reasonLabel =
    context.reasons.find((reason) => reason.value === context.reasonValue)?.label ??
    context.reasonValue;
  const subject = encodeURIComponent(`[应用举报] ${context.displayName}`);
  const body = encodeURIComponent(
    [
      `应用：${context.displayName}`,
      `Listing ID：${context.listingId}`,
      `举报原因：${reasonLabel}`,
      '',
      '请补充详细说明（可选）：',
    ].join('\n'),
  );

  const supportUrl = trim(context.supportUrl ?? '');
  if (supportUrl.startsWith('mailto:')) {
    const separator = supportUrl.includes('?') ? '&' : '?';
    const target = `${supportUrl}${separator}subject=${subject}&body=${body}`;
    openExternal(target);
    return {
      title: '已打开举报渠道',
      message: '已通过开发者支持邮箱发起举报，请按邮件指引完成提交。',
      channelOpened: true,
    };
  }

  if (supportUrl.startsWith('http://') || supportUrl.startsWith('https://')) {
    const separator = supportUrl.includes('?') ? '&' : '?';
    const target = `${supportUrl}${separator}subject=${subject}&body=${body}`;
    openExternal(target);
    return {
      title: '已打开举报渠道',
      message: '已跳转至开发者支持页面，请按页面指引完成举报。',
      channelOpened: true,
    };
  }

  const platformEmail = trim(context.platformReportEmail ?? '');
  if (platformEmail) {
    openExternal(`mailto:${encodeURIComponent(platformEmail)}?subject=${subject}&body=${body}`);
    return {
      title: '已打开平台举报邮箱',
      message: '该应用未配置开发者支持渠道，已为你打开平台举报邮箱。',
      channelOpened: true,
    };
  }

  return {
    title: '暂无法提交举报',
    message:
      '该应用未配置支持渠道，且平台举报邮箱未启用。请通过应用内「技术支持」链接或联系平台客服。',
    channelOpened: false,
  };
}

function openExternal(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
