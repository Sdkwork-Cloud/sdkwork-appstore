import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { isAppStoreApiError } from '@sdkwork/appstore-app-sdk';
import {
  usePublisher,
  formatApiError,
  publisherService,
} from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner } from '@sdkwork/appstore-pc-commons';

export function PublisherNewAppPage() {
  const navigate = useNavigate();
  const { data: publisherData, loading: publisherLoading } = usePublisher();
  const [appKey, setAppKey] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [defaultLocale, setDefaultLocale] = useState('zh-CN');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publisher = publisherData;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!publisher) {
      setError('请先创建发布者资料后再注册应用。');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await publisherService.bootstrapApp({
        appKey: appKey.trim(),
        displayName: displayName.trim(),
        defaultLocale: defaultLocale.trim(),
        appType: 'APP_REACT',
      });
      const listingId = (result.listing as { id?: string })?.id;
      if (listingId) {
        navigate(`/publisher/apps/${listingId}`);
        return;
      }
      navigate('/publisher');
    } catch (submitError) {
      setError(
        formatApiError(
          isAppStoreApiError(submitError)
            ? submitError
            : submitError instanceof Error
              ? submitError
              : new Error(String(submitError)),
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (publisherLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!publisher) {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center">
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent)',
          }}
        >
          <Sparkles className="w-7 h-7" />
        </div>
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          尚未创建发布者资料
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          注册应用前，请先完成发布者资料创建。
        </p>
        <Link to="/publisher" className="btn-primary text-sm inline-flex">
          返回开发者控制台
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <Link
        to="/publisher"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        返回开发者控制台
      </Link>

      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        创建应用
      </h1>
      <p
        className="text-sm mb-8"
        style={{ color: 'var(--text-secondary)' }}
      >
        一步完成 <code style={{ color: 'var(--accent)' }}>appstore_app</code> 记录与草稿应用的注册。
      </p>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            应用名称
          </label>
          <input
            id="displayName"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input-field"
            placeholder="例如 SDKWork 应用商店"
          />
        </div>

        <div>
          <label
            htmlFor="appKey"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            应用标识（App Key）
          </label>
          <input
            id="appKey"
            required
            value={appKey}
            onChange={(e) => setAppKey(e.target.value.toLowerCase())}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="input-field font-mono"
            placeholder="my-awesome-app"
          />
          <p
            className="mt-2 text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            小写字母、数字与短横线组合（kebab-case）。创建后不可修改。
          </p>
        </div>

        <div>
          <label
            htmlFor="defaultLocale"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            默认语言区域
          </label>
          <input
            id="defaultLocale"
            required
            value={defaultLocale}
            onChange={(e) => setDefaultLocale(e.target.value)}
            className="input-field"
            placeholder="例如 zh-CN、en-US"
          />
          <p
            className="mt-2 text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            应用的默认语言，后续可在管理页添加更多语言。
          </p>
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              backgroundColor: 'var(--danger-subtle)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center"
        >
          {submitting ? '创建中…' : '创建应用与商店条目'}
        </button>
      </form>
    </div>
  );
}
