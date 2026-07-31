export interface HostAdapter {
  isNative: boolean;
  platform: 'browser' | 'desktop' | 'tablet';
}

export const defaultHostAdapter: HostAdapter = {
  isNative: false,
  platform: 'browser'
};
