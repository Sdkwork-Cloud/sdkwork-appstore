export interface ConsoleUser {
  id: string;
  name: string;
  role: string;
}

export interface ConsoleContext {
  activeTenantId: string;
  permissions: readonly string[];
  user: ConsoleUser;
}

export function createConsoleContext(context: ConsoleContext): ConsoleContext {
  return {
    ...context,
    permissions: [...context.permissions],
  };
}
