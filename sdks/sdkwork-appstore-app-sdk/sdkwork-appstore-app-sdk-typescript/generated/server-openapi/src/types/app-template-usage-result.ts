export interface AppTemplateUsageResult {
  templateId: string;
  usageType: string;
  starCount: number;
  forkCount: number;
  cloneCount: number;
  isStarred?: boolean;
  isEnabled?: boolean;
}
