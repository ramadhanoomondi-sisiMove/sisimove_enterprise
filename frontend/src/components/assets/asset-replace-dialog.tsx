// -----------------------------------------------------------------------------
// sisiMove — Asset Replace Dialog
// -----------------------------------------------------------------------------
//
// Reusable replacement workflow for an Asset.
//
// Responsibilities:
// - Confirm that the user wants to replace an existing Asset
// - Delegate the replacement upload to AssetUploadDialog
// - Return the newly uploaded Asset to the caller
// - Keep the existing Asset untouched
// - Remain independent of higher-level business workflows
//
// Important:
// - This component does NOT delete or archive the existing Asset.
// - The higher-level workflow decides what should happen to the old Asset
//   after the replacement has been successfully uploaded.
//
// Example higher-level workflows:
//
// Profile
// └── Replace profile photo
//      ├── upload replacement
//      └── update profile photo reference
//
// Verification
// └── Replace verification document
//      ├── upload replacement
//      └── create/update VerificationRequest
//
// Vehicle
// └── Replace vehicle photo
//      ├── upload replacement
//      └── update vehicle asset reference
//
// -----------------------------------------------------------------------------

'use client';

import {
  useState,
} from 'react';

import {
  Button,
  Dialog,
} from '@/components/ui';

import {
  AssetUploadDialog,
} from './asset-upload-dialog';

import {
  type Asset,
  type AssetUploadCategory,
  type AssetUploadType,
} from '@/features/assets';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface AssetReplaceDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly asset: Asset | null;

  /**
   * Asset category to use for the replacement upload.
   *
   * The caller supplies this explicitly because the authenticated Asset model
   * exposes category as a string while the upload boundary requires the
   * controlled AssetUploadCategory union.
   */
  readonly category: AssetUploadCategory;

  /**
   * Asset type to use for the replacement upload.
   */
  readonly type: AssetUploadType;

  /**
   * Optional file-picker restrictions passed to AssetUploadDialog.
   */
  readonly accept?: string;

  readonly maxSizeBytes?: number;

  /**
   * Called after the replacement Asset has been successfully uploaded.
   *
   * The existing Asset remains untouched. The caller decides whether to
   * archive, delete, retain, or otherwise transition the old Asset.
   */
  readonly onReplaced?: (
    previousAsset: Asset,
    replacementAsset: Asset,
  ) => void;
}

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

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AssetReplaceDialog({
  open,
  onOpenChange,
  asset,
  category,
  type,
  accept,
  maxSizeBytes,
  onReplaced,
}: AssetReplaceDialogProps) {
  const [uploadOpen, setUploadOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setUploadOpen(false);
    }

    onOpenChange(nextOpen);
  }

  function handleContinue() {
    if (!asset) {
      return;
    }

    setUploadOpen(true);
  }

  function handleUploadOpenChange(nextOpen: boolean) {
    setUploadOpen(nextOpen);

    if (!nextOpen) {
      onOpenChange(false);
    }
  }

  function handleUploaded(replacementAsset: Asset) {
    if (!asset) {
      return;
    }

    onReplaced?.(asset, replacementAsset);

    setUploadOpen(false);
    onOpenChange(false);
  }

  if (!asset) {
    return (
      <Dialog
        open={false}
        onOpenChange={onOpenChange}
        title="Replace asset"
      >
        {null}
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={open && !uploadOpen}
        onOpenChange={handleOpenChange}
        title="Replace asset"
        description="Upload a new file to replace this asset."
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleContinue}
            >
              Choose replacement
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border-subtle)]',
              'bg-[var(--background-subtle)]',
              'px-4',
              'py-4',
            ].join(' ')}
          >
            <p className="text-sm font-medium text-[var(--foreground)]">
              Replace this asset?
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              The new file will be uploaded first. The existing asset will
              remain available until the calling workflow decides what to do
              with it.
            </p>
          </div>

          <dl className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-[var(--foreground-secondary)]">
                Current file
              </dt>

              <dd className="max-w-[60%] truncate text-right text-sm font-medium text-[var(--foreground)]">
                {asset.originalFilename ?? 'Unnamed file'}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-[var(--foreground-secondary)]">
                Category
              </dt>

              <dd className="text-right text-sm font-medium text-[var(--foreground)]">
                {formatLabel(asset.category)}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-[var(--foreground-secondary)]">
                New file
              </dt>

              <dd className="text-right text-sm font-medium text-[var(--foreground)]">
                {formatLabel(type)}
              </dd>
            </div>
          </dl>
        </div>
      </Dialog>

      <AssetUploadDialog
        open={uploadOpen}
        onOpenChange={handleUploadOpenChange}
        category={category}
        type={type}
        title="Upload replacement"
        description="Choose the new file for this asset."
        accept={accept}
        maxSizeBytes={maxSizeBytes}
        onUploaded={handleUploaded}
      />
    </>
  );
}