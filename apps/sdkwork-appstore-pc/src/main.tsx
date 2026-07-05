import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
