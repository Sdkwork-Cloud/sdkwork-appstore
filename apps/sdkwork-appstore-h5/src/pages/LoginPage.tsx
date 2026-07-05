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
      <div className="w-full max-w-md card p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">登录</h1>
          <p className="text-sm text-[var(--text-tertiary)]">
            使用 SDKWork 账户登录，同步库、收藏与应用更新。
          </p>
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              border: '1px solid var(--danger)',
              backgroundColor: 'var(--danger-subtle)',
              color: 'var(--danger)',
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <form className="space-y-3" onSubmit={handlePasswordLogin}>
          <label className="block">
            <span className="sr-only">账号或邮箱</span>
            <input
              className="w-full rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--text-primary)]"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              placeholder="账号或邮箱"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="sr-only">密码</span>
            <input
              type="password"
              className="w-full rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--text-primary)]"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="密码"
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[var(--accent)] text-white py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {submitting ? '登录中…' : '登录'}
          </button>
        </form>

        {import.meta.env.DEV && (
          <form
            className="space-y-3 border-t pt-4"
            style={{ borderColor: 'var(--border-subtle)' }}
            onSubmit={handleDevTokenSubmit}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
              开发环境 Token
            </p>
            <input
              className="w-full rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm bg-[var(--bg-surface)]"
              value={authToken}
              onChange={(event) => setAuthTokenValue(event.target.value)}
              placeholder="Auth-Token"
              autoComplete="off"
            />
            <input
              className="w-full rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm bg-[var(--bg-surface)]"
              value={accessToken}
              onChange={(event) => setAccessTokenValue(event.target.value)}
              placeholder="Access-Token（可选）"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-full rounded-full border border-[var(--border-default)] py-2.5 text-sm font-medium text-[var(--text-primary)]"
            >
              使用开发 Token 继续
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
