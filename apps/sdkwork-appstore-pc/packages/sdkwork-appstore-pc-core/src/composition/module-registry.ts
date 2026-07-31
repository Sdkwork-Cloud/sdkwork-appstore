export interface ModuleEntry {
  id: string;
  name: string;
  path: string;
}

const registeredModules: Map<string, ModuleEntry> = new Map();

export function registerModule(entry: ModuleEntry) {
  registeredModules.set(entry.id, entry);
}

export function getRegisteredModules(): ModuleEntry[] {
  return Array.from(registeredModules.values());
}
