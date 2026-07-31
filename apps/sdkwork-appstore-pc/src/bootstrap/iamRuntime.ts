import { TokenManager } from '@sdkwork/appstore-pc-core';

export function initializeIamRuntime() {
  TokenManager.setToken('guest_token');
  return {
    isAuthenticated: true,
    user: { id: 'guest', name: 'Guest User' }
  };
}
