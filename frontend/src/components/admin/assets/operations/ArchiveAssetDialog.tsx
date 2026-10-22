
'use client';

import { Archive, FileText, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface ArchiveAssetDialogProps {
  readonly open: boolean;
  readonly asset: AssetModel;
  readonly isSubmitting?: boolean;
  readonly error?: string | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => void | Promise<void>;
}

export function ArchiveAssetDialog({
  open,
  asset,
  isSubmitting = false,
  error,
  onOpenChange,
  onConfirm,
}: ArchiveAssetDialogProps) {
  const alreadyArchived = asset.status === 'ARCHIVED';
  const unavailable = alreadyArchived || asset.status === 'DELETED';

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting && !nextOpen) {
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    if (isSubmitting || unavailable) {
      return;
    }

    void onConfirm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={alreadyArchived ? 'Asset already archived' : 'Archive asset?'}
      description={
        alreadyArchived
          ? 'This asset is already archived.'
          : 'Review this asset before confirming the archive operation.'
      }
      size="md"
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      showCloseButton={!isSubmitting}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isSubmitting}
            onClick={() => handleOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          {!unavailable && (
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={isSubmitting}
              disabled={isSubmitting}
              leadingIcon={
                <Archive aria-hidden="true" className="size-4" />
              }
              onClick={handleConfirm}
              className="w-full sm:w-auto"
            >
              Archive asset
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div
          className={cn(
            'flex items-start gap-3 rounded-xl border p-4',
            'border-[var(--border)] bg-[var(--background-muted)]',
          )}
        >
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl',
              'bg-[var(--background)] text-[var(--muted-foreground)]',
            )}
          >
            <FileText aria-hidden="true" className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="break-words text-sm font-semibold text-[var(--foreground)]">
              {asset.originalFilename?.trim() || 'Untitled asset'}
            </p>

            <p className="mt-1 break-all text-xs text-[var(--muted-foreground)]">
              Asset ID: {asset.publicId}
            </p>

            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Current status: {asset.status}
            </p>
          </div>
        </div>

        {unavailable ? (
          <div
            role="status"
            className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--muted-foreground)]"
          >
            {alreadyArchived
              ? 'No further archive action is required.'
              : 'A deleted asset cannot be archived from this dialog.'}
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <ShieldAlert
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]"
            />

            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Archiving changes the asset’s lifecycle state. Confirm that
              this is the intended asset before continuing. This dialog
              does not delete the asset or guarantee any particular change
              to its accessibility.
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--danger)] p-3 text-sm text-[var(--danger)]"
          >
            {error}
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default ArchiveAssetDialog;
