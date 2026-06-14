export interface HostAdapter {
  name: string;
  available: boolean;
}

export interface ClipboardAdapter {
  readText(): Promise<string>;
  writeText(text: string): Promise<void>;
}

export interface FileDialogAdapter {
  openFile(filters?: { name: string; extensions: string[] }[]): Promise<string | null>;
  saveFile(defaultName?: string): Promise<string | null>;
}

export interface NotificationAdapter {
  send(title: string, body: string): Promise<void>;
}

const clipboardAdapter: ClipboardAdapter = {
  readText: async () => navigator.clipboard.readText(),
  writeText: async (text: string) => navigator.clipboard.writeText(text),
};

const fileDialogAdapter: FileDialogAdapter = {
  openFile: async () => null,
  saveFile: async () => null,
};

const notificationAdapter: NotificationAdapter = {
  send: async (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  },
};

export function getClipboardAdapter(): ClipboardAdapter {
  return clipboardAdapter;
}

export function getFileDialogAdapter(): FileDialogAdapter {
  return fileDialogAdapter;
}

export function getNotificationAdapter(): NotificationAdapter {
  return notificationAdapter;
}

export function getAvailableHostAdapters(): HostAdapter[] {
  return [
    { name: 'clipboard', available: typeof navigator !== 'undefined' && 'clipboard' in navigator },
    { name: 'notification', available: typeof window !== 'undefined' && 'Notification' in window },
    { name: 'file-dialog', available: false },
  ];
}
