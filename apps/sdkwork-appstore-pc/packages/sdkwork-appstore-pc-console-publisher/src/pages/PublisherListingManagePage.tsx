import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, ImagePlus, PackagePlus, Send, Upload } from 'lucide-react';
import {
  formatApiError,
  useListing,
  useListingMedia,
  useListingReleases,
  usePublisher,
  publisherService,
  resolveOrganizationId,
  getPublisherUploads,
} from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner, readString } from '@sdkwork/appstore-pc-commons';

const MEDIA_ROLES = [
  { value: 'ICON', label: 'Icon' },
  { value: 'SCREENSHOT', label: 'Screenshot' },
  { value: 'FEATURE_GRAPHIC', label: 'Feature Graphic' },
] as const;

export function PublisherListingManagePage() {
  const { listingId = '' } = useParams();
  const {
    data: listing,
    loading: listingLoading,
    error: listingError,
    execute: refreshListing,
  } = useListing(listingId);
  const {
    data: mediaData,
    loading: mediaLoading,
    error: mediaError,
    execute: refreshMedia,
  } = useListingMedia(listingId);
  const {
    data: releasesData,
    loading: releasesLoading,
    error: releasesError,
    execute: refreshReleases,
  } = useListingReleases(listingId);
  const { data: publisher } = usePublisher();

  const organizationId = useMemo(() => resolveOrganizationId(publisher), [publisher]);

  const listingRow = (listing ?? {}) as Record<string, unknown>;
  const displayName =
    readString(listingRow, 'displayName', 'display_name') ||
    readString(listingRow, 'listingSlug', 'listing_slug') ||
    listingId;
  const listingStatus = readString(listingRow, 'listingStatus', 'listing_status') || 'draft';
  const reviewStatus = readString(listingRow, 'reviewStatus', 'review_status') || '—';

  const mediaItems = mediaData?.items ?? [];
  const releaseItems = releasesData?.items ?? [];

  const [mediaRole, setMediaRole] = useState<(typeof MEDIA_ROLES)[number]['value']>('ICON');
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaMessage, setMediaMessage] = useState<string | null>(null);

  const [channelCode, setChannelCode] = useState('stable');
  const [versionName, setVersionName] = useState('1.0.0');
  const [versionCode, setVersionCode] = useState('100');
  const [creatingRelease, setCreatingRelease] = useState(false);
  const [releaseMessage, setReleaseMessage] = useState<string | null>(null);

  const [selectedReleaseId, setSelectedReleaseId] = useState('');
  const [artifactUploading, setArtifactUploading] = useState(false);
  const [artifactMessage, setArtifactMessage] = useState<string | null>(null);
  const [platform, setPlatform] = useState('WINDOWS');
  const [architecture, setArchitecture] = useState('X64');
  const [packageFormat, setPackageFormat] = useState('ZIP');

  const [locale, setLocale] = useState('en-US');
  const [localizationDisplayName, setLocalizationDisplayName] = useState('');
  const [localizationSubtitle, setLocalizationSubtitle] = useState('');
  const [localizationShortDescription, setLocalizationShortDescription] = useState('');
  const [localizationFullDescription, setLocalizationFullDescription] = useState('');
  const [savingLocalization, setSavingLocalization] = useState(false);
  const [localizationMessage, setLocalizationMessage] = useState<string | null>(null);
  const [localizationSeeded, setLocalizationSeeded] = useState(false);

  const [submissionType, setSubmissionType] = useState<'INITIAL' | 'METADATA' | 'RELEASE'>('INITIAL');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!listing || localizationSeeded) {
      return;
    }
    const row = listing as Record<string, unknown>;
    const defaultLocale = readString(row, 'defaultLocale', 'default_locale');
    if (defaultLocale) {
      setLocale(defaultLocale);
    }
    const name = readString(row, 'displayName', 'display_name');
    if (name) {
      setLocalizationDisplayName(name);
    }
    setLocalizationSeeded(true);
  }, [listing, localizationSeeded]);

  const loading = listingLoading || mediaLoading || releasesLoading;
  const error = listingError ?? mediaError ?? releasesError;

  async function handleMediaUpload(file: File) {
    if (!organizationId) {
      setMediaMessage('Organization context is required for Drive uploads. Sign in via IAM or create a publisher profile.');
      return;
    }
    setMediaUploading(true);
    setMediaMessage(null);
    try {
      await getPublisherUploads().uploadListingMedia({
        file,
        organizationId,
        listingId,
        mediaRole,
      });
      setMediaMessage(`${mediaRole} uploaded and attached.`);
      await refreshMedia();
    } catch (err) {
      setMediaMessage(formatApiError(err as Error));
    } finally {
      setMediaUploading(false);
    }
  }

  async function handleCreateRelease() {
    setCreatingRelease(true);
    setReleaseMessage(null);
    try {
      const created = (await publisherService.createRelease(listingId, {
        listingId,
        channelCode: channelCode.trim(),
        versionName: versionName.trim(),
        versionCode: versionCode.trim(),
      })) as Record<string, unknown>;
      const releaseId = readString(created, 'id');
      if (releaseId) {
        setSelectedReleaseId(releaseId);
      }
      setReleaseMessage('Release created. Upload an artifact below.');
      await refreshReleases();
    } catch (err) {
      setReleaseMessage(formatApiError(err as Error));
    } finally {
      setCreatingRelease(false);
    }
  }

  async function handleArtifactUpload(file: File) {
    if (!selectedReleaseId) {
      setArtifactMessage('Select or create a release first.');
      return;
    }
    if (!organizationId) {
      setArtifactMessage('Organization context is required for Drive uploads.');
      return;
    }
    setArtifactUploading(true);
    setArtifactMessage(null);
    try {
      await getPublisherUploads().uploadReleaseArtifact({
        file,
        organizationId,
        releaseId: selectedReleaseId,
        platform,
        architecture,
        packageFormat,
      });
      setArtifactMessage('Artifact uploaded and attached to release.');
      await refreshReleases();
    } catch (err) {
      setArtifactMessage(formatApiError(err as Error));
    } finally {
      setArtifactUploading(false);
    }
  }

  async function handleSaveLocalization() {
    if (!localizationDisplayName.trim() || !localizationShortDescription.trim() || !localizationFullDescription.trim()) {
      setLocalizationMessage('Display name, short description, and full description are required.');
      return;
    }
    setSavingLocalization(true);
    setLocalizationMessage(null);
    try {
      await publisherService.upsertLocalization(listingId, locale.trim(), {
        locale: locale.trim(),
        displayName: localizationDisplayName.trim(),
        shortDescription: localizationShortDescription.trim(),
        fullDescription: localizationFullDescription.trim(),
        ...(localizationSubtitle.trim() ? { subtitle: localizationSubtitle.trim() } : {}),
      });
      setLocalizationMessage('Store listing copy saved.');
      await refreshListing();
    } catch (err) {
      setLocalizationMessage(formatApiError(err as Error));
    } finally {
      setSavingLocalization(false);
    }
  }

  async function handleSubmitForReview() {
    if (submissionType === 'RELEASE' && !selectedReleaseId) {
      setSubmissionMessage('Select a release before submitting a release review.');
      return;
    }
    setSubmittingReview(true);
    setSubmissionMessage(null);
    try {
      const result = await publisherService.createSubmission(listingId, {
        submissionType,
        ...(submissionType === 'RELEASE' ? { releaseId: selectedReleaseId } : {}),
      });
      const status = result.status ?? 'submitted';
      setSubmissionMessage(`Submission accepted (${status}). Moderation will review your listing.`);
      await refreshListing();
    } catch (err) {
      setSubmissionMessage(formatApiError(err as Error));
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/publisher"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developer Console
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{displayName}</h1>
        <p className="text-gray-500 mt-2">
          Listing {listingId} · status {listingStatus} · review {reviewStatus}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {formatApiError(error)}
        </div>
      )}

      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Store Listing Copy</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Localized display name and descriptions shown on the storefront.
        </p>

        <div className="grid gap-3 mb-4">
          <input
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            placeholder="Locale (en-US)"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            value={localizationDisplayName}
            onChange={(e) => setLocalizationDisplayName(e.target.value)}
            placeholder="Display name"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            value={localizationSubtitle}
            onChange={(e) => setLocalizationSubtitle(e.target.value)}
            placeholder="Subtitle (optional)"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <textarea
            value={localizationShortDescription}
            onChange={(e) => setLocalizationShortDescription(e.target.value)}
            placeholder="Short description"
            rows={2}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y"
          />
          <textarea
            value={localizationFullDescription}
            onChange={(e) => setLocalizationFullDescription(e.target.value)}
            placeholder="Full description"
            rows={5}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y"
          />
        </div>

        <button
          type="button"
          onClick={() => void handleSaveLocalization()}
          disabled={savingLocalization}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-60"
        >
          {savingLocalization ? 'Saving…' : 'Save localization'}
        </button>
        {localizationMessage && (
          <p className={`text-sm mt-4 ${localizationMessage.includes('saved') ? 'text-green-700' : 'text-red-600'}`}>
            {localizationMessage}
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ImagePlus className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Listing Media</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Upload via sdkwork-drive, then attach the Drive reference to this listing.
        </p>

        <div className="flex flex-wrap items-end gap-4 mb-4">
          <label className="text-sm">
            <span className="block text-gray-600 mb-1">Media role</span>
            <select
              value={mediaRole}
              onChange={(e) => setMediaRole(e.target.value as (typeof MEDIA_ROLES)[number]['value'])}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              {MEDIA_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-600">
            <Upload className="w-4 h-4" />
            {mediaUploading ? 'Uploading…' : 'Upload file'}
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              disabled={mediaUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void handleMediaUpload(file);
                }
                e.target.value = '';
              }}
            />
          </label>
        </div>

        {mediaMessage && (
          <p className={`text-sm mb-4 ${mediaMessage.includes('uploaded') ? 'text-green-700' : 'text-red-600'}`}>
            {mediaMessage}
          </p>
        )}

        {mediaItems.length === 0 ? (
          <p className="text-sm text-gray-500">No media attached yet.</p>
        ) : (
          <ul className="space-y-2">
            {mediaItems.map((item, index) => {
              const row = (item ?? {}) as Record<string, unknown>;
              return (
                <li
                  key={readString(row, 'id') || String(index)}
                  className="flex justify-between text-sm border border-gray-100 rounded-lg px-3 py-2"
                >
                  <span>{readString(row, 'mediaRole', 'media_role') || 'MEDIA'}</span>
                  <span className="text-gray-400 truncate max-w-xs">
                    {readString(row, 'mediaResourceId', 'media_resource_id')}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <PackagePlus className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold">Releases & Artifacts</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <input
            value={channelCode}
            onChange={(e) => setChannelCode(e.target.value)}
            placeholder="Channel (stable)"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            placeholder="Version name"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            value={versionCode}
            onChange={(e) => setVersionCode(e.target.value)}
            placeholder="Version code"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => void handleCreateRelease()}
          disabled={creatingRelease}
          className="mb-6 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 disabled:opacity-60"
        >
          {creatingRelease ? 'Creating…' : 'Create release'}
        </button>
        {releaseMessage && (
          <p className={`text-sm mb-4 ${releaseMessage.includes('created') ? 'text-green-700' : 'text-red-600'}`}>
            {releaseMessage}
          </p>
        )}

        {releaseItems.length === 0 ? (
          <p className="text-sm text-gray-500 mb-6">No releases yet.</p>
        ) : (
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">Select release</label>
            <select
              value={selectedReleaseId}
              onChange={(e) => setSelectedReleaseId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Choose a release…</option>
              {releaseItems.map((item, index) => {
                const row = (item ?? {}) as Record<string, unknown>;
                const id = readString(row, 'id') || String(index);
                const label = `${readString(row, 'versionName', 'version_name') || id} (${readString(row, 'channelCode', 'channel_code') || 'channel'})`;
                return (
                  <option key={id} value={id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-4">
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Platform"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
            placeholder="Architecture"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            value={packageFormat}
            onChange={(e) => setPackageFormat(e.target.value)}
            placeholder="Package format"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-600">
          <Upload className="w-4 h-4" />
          {artifactUploading ? 'Uploading artifact…' : 'Upload release artifact'}
          <input
            type="file"
            className="hidden"
            disabled={artifactUploading || !selectedReleaseId}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                void handleArtifactUpload(file);
              }
              e.target.value = '';
            }}
          />
        </label>
        {artifactMessage && (
          <p className={`text-sm mt-4 ${artifactMessage.includes('uploaded') ? 'text-green-700' : 'text-red-600'}`}>
            {artifactMessage}
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold">Submit for Review</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Send the listing to moderation. Use INITIAL for first review, METADATA after copy changes, RELEASE when a build is ready.
        </p>

        <div className="flex flex-wrap items-end gap-4 mb-4">
          <label className="text-sm">
            <span className="block text-gray-600 mb-1">Submission type</span>
            <select
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value as 'INITIAL' | 'METADATA' | 'RELEASE')}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="INITIAL">Initial listing review</option>
              <option value="METADATA">Metadata update</option>
              <option value="RELEASE">Release build</option>
            </select>
          </label>
          {submissionType === 'RELEASE' && releaseItems.length > 0 && (
            <label className="text-sm flex-1 min-w-[12rem]">
              <span className="block text-gray-600 mb-1">Release</span>
              <select
                value={selectedReleaseId}
                onChange={(e) => setSelectedReleaseId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">Choose a release…</option>
                {releaseItems.map((item, index) => {
                  const row = (item ?? {}) as Record<string, unknown>;
                  const id = readString(row, 'id') || String(index);
                  const label = `${readString(row, 'versionName', 'version_name') || id} (${readString(row, 'channelCode', 'channel_code') || 'channel'})`;
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>
          )}
        </div>

        <button
          type="button"
          onClick={() => void handleSubmitForReview()}
          disabled={submittingReview}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60"
        >
          {submittingReview ? 'Submitting…' : 'Submit for review'}
        </button>
        {submissionMessage && (
          <p className={`text-sm mt-4 ${submissionMessage.includes('accepted') ? 'text-green-700' : 'text-red-600'}`}>
            {submissionMessage}
          </p>
        )}
      </section>
    </div>
  );
}
