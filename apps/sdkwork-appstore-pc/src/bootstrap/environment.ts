export interface RuntimeEnvironment {
  name: 'development' | 'test' | 'staging' | 'production';
  appstoreAppApiBaseUrl: string;
  appstoreOpenApiBaseUrl: string;
  appbaseBaseUrl: string;
  driveAppApiBaseUrl: string;
  commentsAppApiBaseUrl: string;
  features: {
    enablePublisherConsole: boolean;
    enableWishlist: boolean;
    enableLibrary: boolean;
  };
}

const defaultEnvironment: RuntimeEnvironment = {
  name: 'development',
  appstoreAppApiBaseUrl: 'http://127.0.0.1:18090',
  appstoreOpenApiBaseUrl: 'http://127.0.0.1:18092',
  appbaseBaseUrl: 'http://127.0.0.1:18080',
  driveAppApiBaseUrl: 'http://127.0.0.1:18080',
  commentsAppApiBaseUrl: 'http://127.0.0.1:18080',
  features: {
    enablePublisherConsole: true,
    enableWishlist: true,
    enableLibrary: true,
  },
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
