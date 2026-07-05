import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { isAppStoreApiError } from '@sdkwork/appstore-app-sdk';
import { usePublisher, formatApiError, publisherService } from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner } from '@sdkwork/appstore-pc-commons';

export function PublisherNewAppPage() {
  const navigate = useNavigate();
  const { data: publisherData, loading: publisherLoading } = usePublisher();
  const [appKey, setAppKey] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [defaultLocale, setDefaultLocale] = useState('en-US');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publisher = publisherData;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!publisher) {
      setError('Create a publisher profile before registering an app.');
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
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!publisher) {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center">
        <p className="text-gray-600 mb-6">You need a publisher profile before creating an app.</p>
        <Link to="/publisher" className="text-blue-600 hover:underline">
          Back to publisher console
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <Link
        to="/publisher"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to console
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create App</h1>
      <p className="text-gray-600 mb-8">
        Registers an <code className="text-sm">appstore_app</code> record and a draft listing in one step.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-8">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
            Display name
          </label>
          <input
            id="displayName"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
            placeholder="My Awesome App"
          />
        </div>

        <div>
          <label htmlFor="appKey" className="block text-sm font-medium text-gray-700 mb-2">
            App key
          </label>
          <input
            id="appKey"
            required
            value={appKey}
            onChange={(e) => setAppKey(e.target.value.toLowerCase())}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm"
            placeholder="my-awesome-app"
          />
          <p className="mt-2 text-xs text-gray-500">Lower-kebab-case. Immutable after creation.</p>
        </div>

        <div>
          <label htmlFor="defaultLocale" className="block text-sm font-medium text-gray-700 mb-2">
            Default locale
          </label>
          <input
            id="defaultLocale"
            required
            value={defaultLocale}
            onChange={(e) => setDefaultLocale(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Creating…' : 'Create app & listing'}
        </button>
      </form>
    </div>
  );
}
