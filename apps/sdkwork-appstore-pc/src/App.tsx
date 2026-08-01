/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@sdkwork/appstore-pc-shell';
import { DiscoverPage } from '@sdkwork/appstore-pc-discover';
import { AppsPage } from '@sdkwork/appstore-pc-apps';
import { GamesPage } from '@sdkwork/appstore-pc-games';
import { AIHubPage } from '@sdkwork/appstore-pc-ai-hub';
import { ChartsPage } from '@sdkwork/appstore-pc-charts';
import { SearchPage } from '@sdkwork/appstore-pc-search';
import { UpdatesPage } from '@sdkwork/appstore-pc-updates';
import { AppDetailPage } from '@sdkwork/appstore-pc-app-detail';
import { ConsoleSettingsPage } from '@sdkwork/appstore-pc-console-settings';
import { AdminMonitorPage } from '@sdkwork/appstore-pc-admin-monitor';
import { PluginsPage } from './pages/Plugins';
import { SkillsPage } from './pages/Skills';
import { McpPage } from './pages/Mcp';
import { TemplatesPage } from './pages/Templates';
import { TemplateDetailPage } from './pages/TemplateDetail';
import { ThemeProvider } from './providers/ThemeProvider';
import { InstallProvider } from './providers/InstallProvider';
import { createAppstorePcRuntime } from './bootstrap/runtime';
import { AuthGate } from './AuthGate';
import { AdminPermissionGate } from './AdminPermissionGate';

const runtime = createAppstorePcRuntime();

export default function App() {
  return (
    <ThemeProvider>
      <InstallProvider>
        <Router>
          <AuthGate runtime={runtime}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<DiscoverPage />} />
                <Route path="apps" element={<AppsPage />} />
                <Route path="games" element={<GamesPage />} />
                <Route path="ai-hub" element={<AIHubPage />} />
                <Route path="plugins" element={<PluginsPage />} />
                <Route path="skills" element={<SkillsPage />} />
                <Route path="mcp" element={<McpPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="template/:id" element={<TemplateDetailPage />} />
                <Route path="templates/:id" element={<TemplateDetailPage />} />
                <Route path="charts" element={<ChartsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="updates" element={<UpdatesPage />} />
                <Route path="app/:id" element={<AppDetailPage />} />
                <Route path="console/settings" element={<ConsoleSettingsPage />} />
                <Route path="console" element={<Navigate to="/console/settings" replace />} />
                <Route
                  path="admin/monitor"
                  element={
                    <AdminPermissionGate runtime={runtime}>
                      <AdminMonitorPage />
                    </AdminPermissionGate>
                  }
                />
                <Route path="admin" element={<Navigate to="/admin/monitor" replace />} />
              </Route>
            </Routes>
          </AuthGate>
        </Router>
      </InstallProvider>
    </ThemeProvider>
  );
}
