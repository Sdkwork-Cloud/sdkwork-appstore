import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  applyDevTokens,
  fetchCurrentIamUser,
  isAuthenticated,
  signInWithPassword,
} from '@/bootstrap/iamRuntime';
import { formatApiError } from '@/hooks/useApi';
import { isAppStoreApiError } from '@sdkwork/appstore-app-sdk';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthTokenValue] = useState('');
  const [accessToken, setAccessTokenValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to={from} replace />;
  }

  async function handlePasswordLogin(event: FormEvent) {
    event.preventDefault();
    if (!account.trim() || !password.trim()) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signInWithPassword(account.trim(), password);
      await fetchCurrentIamUser();
      navigate(from, { replace: true });
    } catch (err) {
      setError(formatApiError(isAppStoreApiError(err) ? err : err instanceof Error ? err : new Error(String(err))));
    } finally {
      setSubmitting(false);
    }
  }

  function handleDevTokenSubmit(event: FormEvent) {
    event.preventDefault();
    if (!authToken.trim()) {
      return;
    }
    applyDevTokens(authToken, accessToken);
    void fetchCurrentIamUser();
    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-sm text-gray-500">
            Sign in with your SDKWork account to access your library and updates.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form className="space-y-3" onSubmit={handlePasswordLogin}>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            value={account}
            onChange={(event) => setAccount(event.target.value)}
            placeholder="Account or email"
            autoComplete="username"
          />
          <input
            type="password"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-blue-600 text-white py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {import.meta.env.DEV && (
          <form className="space-y-3 border-t border-gray-100 pt-4" onSubmit={handleDevTokenSubmit}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Development tokens</p>
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={authToken}
              onChange={(event) => setAuthTokenValue(event.target.value)}
              placeholder="Auth-Token"
              autoComplete="off"
            />
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={accessToken}
              onChange={(event) => setAccessTokenValue(event.target.value)}
              placeholder="Access-Token (optional)"
              autoComplete="off"
            />
            <button type="submit" className="w-full rounded-full border border-gray-200 py-2.5 text-sm font-medium">
              Continue with dev tokens
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
