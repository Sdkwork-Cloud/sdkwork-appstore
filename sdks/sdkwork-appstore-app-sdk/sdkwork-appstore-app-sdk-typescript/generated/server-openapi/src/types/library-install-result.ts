import type { InstallEvent } from './install-event';
import type { UserLibraryItem } from './user-library-item';

export interface LibraryInstallResult {
  libraryItem: UserLibraryItem;
  installEvent: InstallEvent;
}
