export { default as ConsoleSettingsPage } from '../../../src/pages/ConsoleSettings';
export { ConsoleHeader } from '../../../src/components/console/ConsoleHeader';
export { PublishAppForm } from '../../../src/components/console/PublishAppForm';
export { ManagedAppsList } from '../../../src/components/console/ManagedAppsList';
export { ApiCredentialsCard } from '../../../src/components/console/ApiCredentialsCard';
export { SecurityPolicyCard } from '../../../src/components/console/SecurityPolicyCard';

export const consoleSettingsRoute = {
  path: '/console/settings',
  title: 'Console Settings',
  id: 'console-settings'
};
