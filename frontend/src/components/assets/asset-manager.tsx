// -----------------------------------------------------------------------------
// sisiMove — Asset Manager
// -----------------------------------------------------------------------------
//
// Collection-level management UI for the authenticated user's Assets.
//
// Responsibilities:
// - Load and present the authenticated user's Assets
// - Provide the entry point for uploading Assets
// - Open Asset preview and management dialogs
// - Coordinate replacement and deletion dialogs
// - Keep Asset management interactions inside the Assets capability
//
// This component does NOT:
// - Own higher-level business meaning
// - Create VerificationRequests
// - Modify Profile, Vehicle, Journey, or other domain state
// - Construct private Asset URLs
// - Implement Asset API operations directly
//
// Higher-level features may reuse the individual Asset dialogs directly when
// an Asset operation is part of another workflow.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Skeleton,
} from '@/components/ui';

import {
  useAsset,
  type Asset,
  type AssetUploadCategory,
  type AssetUploadType,
} from '@/features/assets';

import { AssetDeleteDialog } from './asset-delete-dialog';
import { AssetPreviewDialog } from './asset-preview-dialog';
import { AssetReplaceDialog } from './asset-replace-dialog';
import { AssetUploadDialog } from './asset-upload-dialog';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AssetUploadConfiguration {
  readonly type: AssetUploadType;
  readonly category: AssetUploadCategory;
  readonly accept: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_UPLOAD: AssetUploadConfiguration = {
  type: 'IMAGE',
  category: 'OTHER',
  accept: 'image/*,application/pdf',
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(' ');
}

function getAssetDescription(asset: Asset): string {
  return [
    formatLabel(asset.category),
    asset.mimeType,
  ].join(' · ');
}

/**
 * Converts the hook's Error value into the string representation required by
 * the presentation layer.
 *
 * null means that no error is currently recorded.
 */
function getErrorMessage(
  error: Error | null,
): string | null {
  if (error === null) {
    return null;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * The authenticated Asset read model intentionally exposes type/category as
 * strings rather than coupling the read model to the upload command unions.
 *
 * These helpers establish the typed boundary required when an existing Asset
 * is used as the basis for a replacement upload.
 */
function toAssetUploadType(
  value: string,
): AssetUploadType {
  switch (value) {
    case 'IMAGE':
      return 'IMAGE';

    case 'VIDEO':
      return 'VIDEO';

    case 'AUDIO':
      return 'AUDIO';

    case 'DOCUMENT':
      return 'DOCUMENT';

    case 'OTHER':
      return 'OTHER';

    default:
      return DEFAULT_UPLOAD.type;
  }
}

function toAssetUploadCategory(
  value: string,
): AssetUploadCategory {
  switch (value) {
    case 'PROFILE_PHOTO':
      return 'PROFILE_PHOTO';

    case 'COVER_PHOTO':
      return 'COVER_PHOTO';

    case 'AVATAR':
      return 'AVATAR';

    case 'GOVERNMENT_ID':
      return 'GOVERNMENT_ID';

    case 'DRIVER_LICENSE':
      return 'DRIVER_LICENSE';

    case 'PASSPORT':
      return 'PASSPORT';

    case 'SELFIE':
      return 'SELFIE';

    case 'VEHICLE_PHOTO':
      return 'VEHICLE_PHOTO';

    case 'CHAT_ATTACHMENT':
      return 'CHAT_ATTACHMENT';

    case 'OTHER':
      return 'OTHER';

    default:
      return DEFAULT_UPLOAD.category;
  }
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function AssetManagerSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton
            className="h-6 w-40"
            radius="sm"
          />

          <Skeleton
            className="h-4 w-72"
            radius="sm"
          />
        </div>

        <Skeleton
          className="h-10 w-28"
          radius="md"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            padding="md"
          >
            <div className="flex flex-col gap-4">
              <Skeleton
                className="h-28 w-full"
                radius="lg"
              />

              <div className="flex flex-col gap-2">
                <Skeleton
                  className="h-4 w-3/4"
                  radius="sm"
                />

                <Skeleton
                  className="h-3.5 w-1/2"
                  radius="sm"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AssetManager() {
  const {
    assets,
    isLoading,
    error,
    loadAssets,
  } = useAsset();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [deleteAsset, setDeleteAsset] = useState<Asset | null>(null);
  const [replaceAsset, setReplaceAsset] = useState<Asset | null>(null);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  const sortedAssets = useMemo(
    () =>
      [...assets].sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      ),
    [assets],
  );

  const errorMessage = getErrorMessage(error);

  function handleUploaded(asset: Asset) {
    setUploadOpen(false);
    setPreviewAsset(asset);
  }

  function handlePreview(asset: Asset) {
    setPreviewAsset(asset);
  }

  function handleReplace(asset: Asset) {
    setPreviewAsset(null);
    setReplaceAsset(asset);
  }

  function handleDelete(asset: Asset) {
    setPreviewAsset(null);
    setDeleteAsset(asset);
  }

  function handleReplaced(
    _previousAsset: Asset,
    replacementAsset: Asset,
  ) {
    setReplaceAsset(null);
    setPreviewAsset(replacementAsset);
  }

  function handleDeleted(asset: Asset) {
    setDeleteAsset(null);

    if (previewAsset?.publicId === asset.publicId) {
      setPreviewAsset(null);
    }
  }

  if (isLoading && assets.length === 0) {
    return <AssetManagerSkeleton />;
  }

  if (errorMessage && assets.length === 0) {
    return (
      <ErrorState
        title="Unable to load your assets"
        description={errorMessage}
        retryAction={{
          label: 'Try again',
          onClick: () => {
            void loadAssets();
          },
        }}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Your assets
            </h1>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Manage the files you use across your sisiMove account.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setUploadOpen(true)}
          >
            Upload asset
          </Button>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Asset collection                                                  */}
        {/* ----------------------------------------------------------------- */}

        {sortedAssets.length === 0 ? (
          <EmptyState
            title="No assets yet"
            description="Upload photos or documents when you need them for your sisiMove account and workflows."
            primaryAction={{
              label: 'Upload asset',
              onClick: () => setUploadOpen(true),
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedAssets.map((asset) => (
              <Card
                key={asset.publicId}
                padding="md"
                interactive
                onClick={() => handlePreview(asset)}
              >
                <div className="flex flex-col gap-4">
                  {/* ------------------------------------------------------- */}
                  {/* Metadata placeholder                                    */}
                  {/* ------------------------------------------------------- */}

                  <div
                    className={[
                      'flex',
                      'min-h-28',
                      'items-center',
                      'justify-center',
                      'rounded-[var(--radius-lg)]',
                      'border',
                      'border-[var(--border-subtle)]',
                      'bg-[var(--background-subtle)]',
                      'px-4',
                      'text-center',
                    ].join(' ')}
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {formatLabel(asset.type)}
                      </p>

                      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                        {formatLabel(asset.category)}
                      </p>
                    </div>
                  </div>

                  {/* ------------------------------------------------------- */}
                  {/* Asset information                                       */}
                  {/* ------------------------------------------------------- */}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">
                      {asset.originalFilename ?? 'Unnamed file'}
                    </p>

                    <p className="mt-1 truncate text-xs text-[var(--foreground-secondary)]">
                      {getAssetDescription(asset)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Collection error                                                  */}
        {/* ----------------------------------------------------------------- */}

        {errorMessage && assets.length > 0 && (
          <p
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            {errorMessage}
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Upload Dialog                                                       */}
      {/* ------------------------------------------------------------------- */}

      <AssetUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        category={DEFAULT_UPLOAD.category}
        type={DEFAULT_UPLOAD.type}
        accept={DEFAULT_UPLOAD.accept}
        title="Upload asset"
        description="Choose a file to add to your sisiMove assets."
        onUploaded={handleUploaded}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Preview Dialog                                                      */}
      {/* ------------------------------------------------------------------- */}

      <AssetPreviewDialog
        open={previewAsset !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewAsset(null);
          }
        }}
        asset={previewAsset}
        onReplace={handleReplace}
        onDelete={handleDelete}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Replace Dialog                                                      */}
      {/* ------------------------------------------------------------------- */}

      <AssetReplaceDialog
        open={replaceAsset !== null}
        onOpenChange={(open) => {
          if (!open) {
            setReplaceAsset(null);
          }
        }}
        asset={replaceAsset}
        category={
          replaceAsset
            ? toAssetUploadCategory(replaceAsset.category)
            : DEFAULT_UPLOAD.category
        }
        type={
          replaceAsset
            ? toAssetUploadType(replaceAsset.type)
            : DEFAULT_UPLOAD.type
        }
        onReplaced={handleReplaced}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Delete Dialog                                                       */}
      {/* ------------------------------------------------------------------- */}

      <AssetDeleteDialog
        open={deleteAsset !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteAsset(null);
          }
        }}
        asset={deleteAsset}
        onDeleted={handleDeleted}
      />
    </>
  );
}