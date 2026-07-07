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
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-sm border border-[var(--border-subtle)] p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">登录</h1>
          <p className="text-sm text-[var(--text-tertiary)]">
            使用 SDKWork 账号登录。会话采用 IAM 双令牌认证，与应用商店 SDK 共享。
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-[var(--danger)] bg-[var(--danger-subtle)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handlePasswordLogin}>
          <div className="block">
            <label
              htmlFor="login-account"
              className="text-sm font-medium text-[var(--text-secondary)]"
            >
              账号或邮箱
            </label>
            <input
              id="login-account"
              className="mt-1 w-full rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="block">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-[var(--text-secondary)]"
            >
              密码
            </label>
            <input
              id="login-password"
              type="password"
              className="mt-1 w-full rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[var(--accent)] text-[var(--text-inverse)] py-2.5 text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
          >
            {submitting ? '登录中…' : '登录'}
          </button>
        </form>

        {import.meta.env.DEV && (
          <form className="space-y-4 border-t border-[var(--border-subtle)] pt-6" onSubmit={handleDevTokenSubmit}>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">开发令牌录入</p>
            <div className="block">
              <label
                htmlFor="login-auth-token"
                className="text-sm font-medium text-[var(--text-secondary)]"
              >
                Auth-Token
              </label>
              <input
                id="login-auth-token"
                className="mt-1 w-full rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                value={authToken}
                onChange={(event) => setAuthTokenValue(event.target.value)}
                placeholder="粘贴 Auth-Token"
                autoComplete="off"
              />
            </div>
            <div className="block">
              <label
                htmlFor="login-access-token"
                className="text-sm font-medium text-[var(--text-secondary)]"
              >
                Access-Token（可选）
              </label>
              <input
                id="login-access-token"
                className="mt-1 w-full rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                value={accessToken}
                onChange={(event) => setAccessTokenValue(event.target.value)}
                placeholder="粘贴 Access-Token"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full border border-[var(--border-default)] py-2.5 text-sm font-medium hover:bg-[var(--bg-canvas)] transition-colors"
            >
              使用开发令牌继续
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
