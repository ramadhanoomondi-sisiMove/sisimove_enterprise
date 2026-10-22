
'use client';

import { useState } from 'react';
import { AlertTriangle, FileText, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface DeleteAssetDialogProps {
  readonly open: boolean;
  readonly asset: AssetModel;
  readonly isSubmitting?: boolean;
  readonly error?: string | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => void | Promise<void>;
}

export function DeleteAssetDialog({
  open,
  asset,
  isSubmitting = false,
  error,
  onOpenChange,
  onConfirm,
}: DeleteAssetDialogProps) {
  const [confirmation, setConfirmation] = useState('');

  const alreadyDeleted = asset.status === 'DELETED';
  const canDelete = !alreadyDeleted && confirmation === 'DELETE';

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting && !nextOpen) {
      return;
    }

    if (!nextOpen) {
      setConfirmation('');
    }

    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    if (isSubmitting || !canDelete) {
      return;
    }

    void onConfirm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={alreadyDeleted ? 'Asset already deleted' : 'Delete asset?'}
      description={
        alreadyDeleted
          ? 'This asset is already marked as deleted.'
          : 'Confirm the asset identifier before proceeding.'
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

          {!alreadyDeleted && (
            <Button
              type="button"
              variant="danger"
              size="md"
              loading={isSubmitting}
              disabled={isSubmitting || !canDelete}
              leadingIcon={<Trash2 aria-hidden="true" className="size-4" />}
              onClick={handleConfirm}
              className="w-full sm:w-auto"
            >
              Delete asset
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div
          className={cn(
            'flex items-start gap-3 rounded-xl border p-4',
            'border-[var(--danger)] bg-[var(--background-muted)]',
          )}
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-[var(--danger)]">
            <FileText aria-hidden="true" className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="break-words text-sm font-semibold text-[var(--foreground)]">
              {asset.originalFilename?.trim() || 'Untitled asset'}
            </p>

            <p className="mt-1 break-all font-mono text-xs text-[var(--muted-foreground)]">
              {asset.publicId}
            </p>

            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Current status: {asset.status}
            </p>
          </div>
        </div>

        {alreadyDeleted ? (
          <p
            role="status"
            className="text-sm text-[var(--muted-foreground)]"
          >
            No further deletion action is available from this dialog.
          </p>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
              />

              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                Deletion may affect the availability of this asset.
                Confirm that you have selected the correct asset before
                proceeding. The final deletion behavior is determined by
                the backend.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="delete-asset-confirmation"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Type <span className="font-mono">DELETE</span> to confirm
              </label>

              <input
                id="delete-asset-confirmation"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                disabled={isSubmitting}
                placeholder="Type DELETE"
                className={cn(
                  'min-h-10 w-full rounded-[var(--radius-md)] border',
                  'border-[var(--border-strong)] bg-[var(--background)]',
                  'px-3 py-2 text-sm text-[var(--foreground)]',
                  'placeholder:text-[var(--muted-foreground)]',
                  'focus-visible:outline-2 focus-visible:outline-[var(--brand)]',
                  'focus-visible:outline-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              />
            </div>
          </>
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

export default DeleteAssetDialog;
