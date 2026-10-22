
'use client';

import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { AssetModel } from '@/features/admin/assets/models';
import { AssetVisibility } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface ChangeAssetVisibilityDialogProps {
  readonly open: boolean;
  readonly asset: AssetModel;
  readonly isSubmitting?: boolean;
  readonly error?: string | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (
    visibility: AssetVisibility,
  ) => void | Promise<void>;
}

export function ChangeAssetVisibilityDialog({
  open,
  asset,
  isSubmitting = false,
  error,
  onOpenChange,
  onConfirm,
}: ChangeAssetVisibilityDialogProps) {
  const currentVisibility = asset.visibility;

  const nextVisibility =
    currentVisibility === AssetVisibility.PUBLIC
      ? AssetVisibility.PRIVATE
      : AssetVisibility.PUBLIC;

  const makingPublic = nextVisibility === AssetVisibility.PUBLIC;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting && !nextOpen) {
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    if (isSubmitting || nextVisibility === currentVisibility) {
      return;
    }

    void onConfirm(nextVisibility);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={makingPublic ? 'Make asset public?' : 'Make asset private?'}
      description="Review the visibility change before confirming."
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

          <Button
            type="button"
            variant="primary"
            size="md"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {makingPublic ? 'Make public' : 'Make private'}
          </Button>
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
            {makingPublic ? (
              <Eye aria-hidden="true" className="size-5" />
            ) : (
              <EyeOff aria-hidden="true" className="size-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {asset.originalFilename?.trim() || 'Untitled asset'}
            </p>

            <p className="mt-1 break-all text-xs text-[var(--muted-foreground)]">
              Asset ID: {asset.publicId}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[var(--muted-foreground)]">
                Current:
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-1 font-medium text-[var(--foreground)]">
                {currentVisibility}
              </span>

              <span
                aria-hidden="true"
                className="text-[var(--muted-foreground)]"
              >
                →
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-1 font-medium text-[var(--foreground)]">
                {nextVisibility}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]"
          />

          <p className="text-sm leading-6 text-[var(--muted-foreground)]">
            {makingPublic
              ? 'The asset will be marked as public. Actual access still depends on the application’s serving rules and authorization controls.'
              : 'The asset will be marked as private. Ensure the application enforces the appropriate access checks when serving it.'}
          </p>
        </div>

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

export default ChangeAssetVisibilityDialog;
