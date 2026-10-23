'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDownUp,
  ExternalLink,
  FileImage,
  FileText,
  ImageOff,
  Layers3,
  LoaderCircle,
  X,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import { usePublicAssets } from '@/features/assets/hooks';
import type { JourneyAsset } from '@/features/admin/journeys/models/journey.model';
import type { PublicAsset } from '@/features/assets/models';

interface JourneyAssetListProps {
  assets: readonly JourneyAsset[];
  linkedVehicleAssetPublicId?: string | null;
  className?: string;
  loading?: boolean;
}

function formatAssetType(type: string): string {
  return (
    type
      .trim()
      .replace(/[_-]+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase()) ||
    'Unspecified'
  );
}

function AssetTypeIcon({ type }: { type: string }) {
  const normalized = type.trim().toUpperCase();

  if (
    ['IMAGE', 'PHOTO', 'PICTURE', 'JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'SVG'].includes(
      normalized,
    )
  ) {
    return <FileImage className="h-5 w-5" aria-hidden="true" />;
  }

  if (
    ['DOCUMENT', 'PDF', 'FILE', 'ATTACHMENT'].includes(normalized)
  ) {
    return <FileText className="h-5 w-5" aria-hidden="true" />;
  }

  return <Layers3 className="h-5 w-5" aria-hidden="true" />;
}

function AssetSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex animate-pulse items-center gap-3 rounded-xl border border-[var(--border)] p-4"
        >
          <div className="h-11 w-11 shrink-0 rounded-lg bg-[var(--background-subtle)]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-[var(--background-subtle)]" />
            <div className="h-3 w-2/3 rounded bg-[var(--background-subtle)]" />
          </div>
          <div className="h-6 w-14 rounded-full bg-[var(--background-subtle)]" />
        </div>
      ))}
    </div>
  );
}

function isImageType(type: string): boolean {
  return [
    'IMAGE',
    'PHOTO',
    'PICTURE',
    'JPG',
    'JPEG',
    'PNG',
    'WEBP',
    'GIF',
    'SVG',
  ].includes(type.trim().toUpperCase());
}

function isVideoType(type: string): boolean {
  return ['VIDEO', 'MP4', 'WEBM', 'MOV'].includes(
    type.trim().toUpperCase(),
  );
}

function isAudioType(type: string): boolean {
  return ['AUDIO', 'MP3', 'WAV', 'OGG', 'M4A'].includes(
    type.trim().toUpperCase(),
  );
}

function AssetPreview({
  type,
  resolvedAsset,
}: {
  type: string;
  resolvedAsset: PublicAsset;
}) {
  if (isImageType(type)) {
    return (
      <Image
        src={resolvedAsset.url}
        alt={resolvedAsset.alt ?? 'Journey asset preview'}
        width={1200}
        height={900}
        unoptimized
        className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
      />
    );
  }

  if (isVideoType(type)) {
    return (
      <video
        src={resolvedAsset.url}
        controls
        playsInline
        className="max-h-[65vh] w-full rounded-lg bg-black"
      >
        Your browser does not support embedded video playback.
      </video>
    );
  }

  if (isAudioType(type)) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-subtle)] p-6">
        <FileText
          className="mx-auto mb-4 h-10 w-10 text-[var(--foreground-muted)]"
          aria-hidden="true"
        />
        <audio src={resolvedAsset.url} controls className="w-full">
          Your browser does not support embedded audio playback.
        </audio>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <iframe
        title={`Preview of ${formatAssetType(type)} asset`}
        src={resolvedAsset.url}
        className="h-[65vh] min-h-64 w-full rounded-lg border border-[var(--border)] bg-white"
      />
      <p className="text-xs text-[var(--foreground-muted)]">
        If this file type cannot be previewed in the browser, use
        “Open file” to view it separately.
      </p>
    </div>
  );
}

interface AssetPreviewTarget {
  publicId: string;
  type: string;
  journeyAssetPublicId?: string;
  label: string;
}

function AssetPreviewDialog({
  target,
  resolvedAsset,
  loading,
  error,
  onClose,
}: {
  target: AssetPreviewTarget;
  resolvedAsset: PublicAsset | undefined;
  loading: boolean;
  error: Error | null;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="journey-asset-preview-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-4 sm:p-5">
          <div className="min-w-0">
            <h3
              id="journey-asset-preview-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              {target.label} preview
            </h3>

            <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">
              {target.publicId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset preview"
            className="rounded-lg p-2 text-[var(--foreground-muted)] transition hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-sm text-[var(--foreground-muted)]">
              <LoaderCircle
                className="h-7 w-7 animate-spin"
                aria-hidden="true"
              />
              Resolving asset preview…
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5 text-sm">
              <p className="font-semibold text-[var(--foreground)]">
                Unable to load this asset
              </p>
              <p className="mt-2 break-words text-[var(--foreground-muted)]">
                {error.message}
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Check that the asset exists and is accessible through the
                Asset API.
              </p>
            </div>
          ) : resolvedAsset ? (
            <AssetPreview
              type={target.type}
              resolvedAsset={resolvedAsset}
            />
          ) : (
            <p className="py-12 text-center text-sm text-[var(--foreground-muted)]">
              No preview is available for this asset.
            </p>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] p-4">
          <div className="min-w-0 text-xs text-[var(--foreground-muted)]">
            {target.journeyAssetPublicId ? (
              <>
                Journey asset ID:{' '}
                <span className="break-all font-mono">
                  {target.journeyAssetPublicId}
                </span>
              </>
            ) : (
              <>Linked vehicle asset</>
            )}
          </div>

          {resolvedAsset && (
            <a
              href={resolvedAsset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open file
            </a>
          )}
        </footer>
      </section>
    </div>
  );
}

export function JourneyAssetList({
  assets,
  linkedVehicleAssetPublicId = null,
  className,
  loading = false,
}: JourneyAssetListProps) {
  const [selectedTarget, setSelectedTarget] =
    useState<AssetPreviewTarget | null>(null);

  const sortedAssets = useMemo(
    () => [...assets].sort((left, right) => left.sortOrder - right.sortOrder),
    [assets],
  );

  const normalizedVehicleAssetId = linkedVehicleAssetPublicId?.trim() || null;

  const attachedAssetIds = useMemo(
    () => new Set(sortedAssets.map((asset) => asset.assetPublicId)),
    [sortedAssets],
  );

  // Avoid displaying the same linked asset twice if it is also attached
  // directly to the Journey.
  const showVehicleAsset =
    normalizedVehicleAssetId !== null &&
    !attachedAssetIds.has(normalizedVehicleAssetId);

  const assetReferences = useMemo(() => {
    const references = sortedAssets.map((asset) => ({
      publicId: asset.assetPublicId,
      alt: `${formatAssetType(asset.type)} asset`,
    }));

    if (
      normalizedVehicleAssetId &&
      !sortedAssets.some(
        (asset) => asset.assetPublicId === normalizedVehicleAssetId,
      )
    ) {
      references.push({
        publicId: normalizedVehicleAssetId,
        alt: 'Journey vehicle asset',
      });
    }

    return references;
  }, [sortedAssets, normalizedVehicleAssetId]);

  const publicAssetsQuery = usePublicAssets(assetReferences);

  const resolvedAssetById = useMemo(
    () =>
      new Map(
        publicAssetsQuery.assets.map((asset) => [asset.publicId, asset]),
      ),
    [publicAssetsQuery.assets],
  );

  const selectedResolvedAsset = selectedTarget
    ? resolvedAssetById.get(selectedTarget.publicId)
    : undefined;

  const selectedAssetLoading =
    selectedTarget !== null &&
    publicAssetsQuery.isLoading &&
    !selectedResolvedAsset;

  const selectedAssetError =
    selectedTarget &&
    publicAssetsQuery.error &&
    !selectedResolvedAsset
      ? publicAssetsQuery.error
      : null;

  if (loading) {
    return (
      <div
        className={cn('space-y-3', className)}
        aria-label="Loading journey assets"
        aria-busy="true"
      >
        <AssetSkeleton />
      </div>
    );
  }

  if (sortedAssets.length === 0 && !normalizedVehicleAssetId) {
    return (
      <div
        className={cn(
          'flex flex-col items-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-5 py-10 text-center',
          className,
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
          <ImageOff className="h-6 w-6" aria-hidden="true" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
          No journey assets
        </h3>

        <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--foreground-muted)]">
          No asset records or linked vehicle asset are available for this
          journey.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('space-y-3', className)}>
        {sortedAssets.map((asset, index) => (
          <article
            key={asset.publicId}
            className="flex min-w-0 flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
                <AssetTypeIcon type={asset.type} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">
                    {formatAssetType(asset.type)}
                  </h4>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-2 py-0.5 text-xs text-[var(--foreground-secondary)]">
                    Position {asset.sortOrder}
                  </span>
                </div>

                <dl className="mt-2 grid min-w-0 grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  <div className="min-w-0">
                    <dt className="text-xs text-[var(--foreground-muted)]">
                      Journey asset ID
                    </dt>
                    <dd className="mt-0.5 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                      {asset.publicId}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-xs text-[var(--foreground-muted)]">
                      Linked asset ID
                    </dt>
                    <dd className="mt-0.5 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                      {asset.assetPublicId}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
              <div className="flex items-center gap-2 rounded-lg bg-[var(--background-subtle)] px-3 py-2 text-xs text-[var(--foreground-secondary)]">
                <ArrowDownUp className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Order {index + 1}</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTarget({
                    publicId: asset.assetPublicId,
                    type: asset.type,
                    journeyAssetPublicId: asset.publicId,
                    label: formatAssetType(asset.type),
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                aria-label={`View ${formatAssetType(asset.type)} asset ${asset.assetPublicId}`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                View asset
              </button>
            </div>
          </article>
        ))}

        {showVehicleAsset && normalizedVehicleAssetId && (
          <article className="flex min-w-0 flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
                <FileImage className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">
                    Vehicle asset
                  </h4>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-2 py-0.5 text-xs text-[var(--foreground-secondary)]">
                    Linked reference
                  </span>
                </div>

                <p className="mt-2 text-xs text-[var(--foreground-muted)]">
                  Asset public ID
                </p>

                <p className="mt-0.5 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                  {normalizedVehicleAssetId}
                </p>

                {resolvedAssetById.has(normalizedVehicleAssetId) && (
                  <div className="mt-3">
                    {isImageType('IMAGE') ? (
                      <Image
                        src={resolvedAssetById.get(normalizedVehicleAssetId)!.url}
                        alt={
                          resolvedAssetById.get(normalizedVehicleAssetId)!.alt ??
                          'Journey vehicle asset'
                        }
                        width={640}
                        height={360}
                        unoptimized
                        className="max-h-48 w-auto max-w-full rounded-lg object-contain"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() =>
                  setSelectedTarget({
                    publicId: normalizedVehicleAssetId,
                    type: 'IMAGE',
                    label: 'Vehicle asset',
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                aria-label={`View vehicle asset ${normalizedVehicleAssetId}`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                View asset
              </button>
            </div>
          </article>
        )}
      </div>

      {selectedTarget && (
        <AssetPreviewDialog
          target={selectedTarget}
          resolvedAsset={selectedResolvedAsset}
          loading={selectedAssetLoading}
          error={selectedAssetError}
          onClose={() => setSelectedTarget(null)}
        />
      )}
    </>
  );
}

export default JourneyAssetList;
