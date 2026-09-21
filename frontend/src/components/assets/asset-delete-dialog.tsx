// -----------------------------------------------------------------------------
// sisiMove — Asset Delete Dialog
// -----------------------------------------------------------------------------
//
// Reusable confirmation dialog for deleting an Asset.
//
// Responsibilities:
// - Present a clear destructive-action confirmation
// - Prevent accidental deletion
// - Execute the Asset deletion operation
// - Return the deleted Asset to the caller
// - Remain independent of higher-level business workflows
//
// Higher-level features such as Verification, Profile, Vehicle, or Journey
// decide what deletion means for their workflow. This dialog only handles
// deletion of the Asset itself.
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
  useAsset,
  type Asset,
} from '@/features/assets';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface AssetDeleteDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly asset: Asset | null;

  /**
   * Called after the Asset has been successfully deleted.
   */
  readonly onDeleted?: (asset: Asset) => void;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toDeleteError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The asset could not be deleted. Please try again.';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AssetDeleteDialog({
  open,
  onOpenChange,
  asset,
  onDeleted,
}: AssetDeleteDialogProps) {
  const {
    remove,
    clearError,
  } = useAsset();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !isDeleting) {
      setDeleteError(null);
      clearError();
    }

    onOpenChange(nextOpen);
  }

  async function handleDelete() {
    if (!asset || isDeleting) {
      return;
    }

    setDeleteError(null);
    clearError();
    setIsDeleting(true);

    try {
      const deletedAsset = await remove(asset.publicId);

      onDeleted?.(deletedAsset);

      setIsDeleting(false);
      handleOpenChange(false);
    } catch (error) {
      setDeleteError(toDeleteError(error));
      setIsDeleting(false);
    }
  }

  if (!asset) {
    return (
      <Dialog
        open={false}
        onOpenChange={onOpenChange}
        title="Delete asset"
      >
        {null}
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Delete asset"
      description="This action cannot be undone."
      size="sm"
      closeOnBackdropClick={!isDeleting}
      closeOnEscape={!isDeleting}
      showCloseButton={!isDeleting}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            loading={isDeleting}
            onClick={handleDelete}
          >
            Delete asset
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--danger)]/20',
            'bg-[var(--danger-soft)]',
            'px-4',
            'py-4',
          ].join(' ')}
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Delete this asset?
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {asset.originalFilename
              ? `"${asset.originalFilename}" will be deleted.`
              : 'This asset will be deleted.'}
          </p>
        </div>

        <dl className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-sm text-[var(--foreground-secondary)]">
              Category
            </dt>

            <dd className="text-right text-sm font-medium text-[var(--foreground)]">
              {asset.category
                .toLowerCase()
                .split('_')
                .map(
                  (part) =>
                    part.charAt(0).toUpperCase() +
                    part.slice(1),
                )
                .join(' ')}
            </dd>
          </div>

          <div className="flex items-start justify-between gap-4">
            <dt className="text-sm text-[var(--foreground-secondary)]">
              File
            </dt>

            <dd className="max-w-[60%] truncate text-right text-sm font-medium text-[var(--foreground)]">
              {asset.originalFilename ?? 'Unnamed file'}
            </dd>
          </div>
        </dl>

        {deleteError && (
          <div
            role="alert"
            className={[
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--danger)]/20',
              'bg-[var(--danger-soft)]',
              'px-3',
              'py-2.5',
              'text-sm',
              'text-[var(--danger)]',
            ].join(' ')}
          >
            {deleteError}
          </div>
        )}
      </div>
    </Dialog>
  );
}