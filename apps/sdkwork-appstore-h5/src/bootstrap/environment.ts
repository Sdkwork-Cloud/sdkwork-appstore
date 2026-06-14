export interface RuntimeEnvironment {
  name: 'development' | 'test' | 'staging' | 'production';
  appstoreAppApiBaseUrl: string;
  appbaseBaseUrl: string;
}

const defaultEnvironment: RuntimeEnvironment = {
  name: 'development',
  appstoreAppApiBaseUrl: 'http://127.0.0.1:18090',
  appbaseBaseUrl: 'http://127.0.0.1:18080',
};

let currentEnvironment: RuntimeEnvironment = defaultEnvironment;

export function getEnvironment(): RuntimeEnvironment {
  return currentEnvironment;
}

export function setEnvironment(env: Partial<RuntimeEnvironment>): void {
  currentEnvironment = { ...currentEnvironment, ...env };
}

export function loadEnvironmentFromConfig(): RuntimeEnvironment {
  try {
    const configEl = document.getElementById('runtime-env');
    if (configEl) {
      const config = JSON.parse(configEl.textContent || '{}');
      setEnvironment(config);
    }
  } catch {
    // Use default environment
  }
  return currentEnvironment;
}
