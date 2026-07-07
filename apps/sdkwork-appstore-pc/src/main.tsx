import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@sdkwork/appstore-pc-commons';
import App from './App';
import { loadEnvironmentFromConfig } from './bootstrap/environment';
import { bootstrapAppstoreAuthRuntime } from './bootstrap/iamRuntime';
import { bootstrapPublisherConsole } from './bootstrap/publisherConsole';
import './index.css';

loadEnvironmentFromConfig();
bootstrapAppstoreAuthRuntime();
bootstrapPublisherConsole();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
