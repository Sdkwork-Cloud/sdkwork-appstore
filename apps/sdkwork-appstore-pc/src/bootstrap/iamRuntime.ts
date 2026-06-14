export interface IamUser {
  userId: string;
  displayName: string;
  email?: string;
  organizationId?: string;
}

let currentUser: IamUser | null = null;

export function getCurrentUser(): IamUser | null {
  return currentUser;
}

export function setCurrentUser(user: IamUser): void {
  currentUser = user;
}

export function clearCurrentUser(): void {
  currentUser = null;
}

export function isAuthenticated(): boolean {
  return currentUser !== null;
}
