export interface IamUser {
  userId: string;
  displayName?: string;
  organizationId?: string;
}

let currentUser: IamUser | null = null;

export function getCurrentUser(): IamUser | null {
  return currentUser;
}

export function setCurrentUser(user: IamUser | null): void {
  currentUser = user;
}

export function clearCurrentUser(): void {
  currentUser = null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth-token');
}
