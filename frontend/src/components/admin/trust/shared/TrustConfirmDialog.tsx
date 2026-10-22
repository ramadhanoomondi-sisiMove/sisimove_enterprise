
/**
 * sisiMove — Trust Confirm Dialog
 *
 * Confirmation dialog for Trust administration actions.
 *
 * Responsibilities:
 * - Clearly communicate the action requiring confirmation.
 * - Distinguish ordinary and destructive actions.
 * - Provide cancel and confirm controls.
 * - Prevent duplicate confirmation while an operation is pending.
 * - Reuse the shared Dialog primitive.
 *
 * Non-responsibilities:
 * - Executing Trust mutations.
 * - Enforcing permissions.
 * - Deciding whether an operation is valid.
 */

'use client';

import type { ReactNode } from 'react';

import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustConfirmDialogTone = 'default' | 'danger';

export interface TrustConfirmDialogProps {
  /**
   * Controls whether the dialog is visible.
   */
  open: boolean;

  /**
   * Called when the dialog requests to open or close.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Dialog heading.
   */
  title: string;

  /**
   * Supporting explanation of the action.
   */
  description?: string;

  /**
   * Optional additional context displayed before the action buttons.
   */
  children?: ReactNode;

  /**
   * Label for the confirmation button.
   */
  confirmLabel?: string;

  /**
   * Label for the cancel button.
   */
  cancelLabel?: string;

  /**
   * Visual tone. Use danger for irreversible or destructive actions.
   */
  tone?: TrustConfirmDialogTone;

  /**
   * Indicates that the confirmation operation is in progress.
   */
  isPending?: boolean;

  /**
   * Called when the user confirms the action.
   *
   * The caller owns the mutation and its error handling.
   */
  onConfirm: () => void | Promise<void>;

  /**
   * Prevent closing through the close button or backdrop.
   * Escape behavior is also disabled while pending.
   */
  preventCloseWhilePending?: boolean;

  /**
   * Additional classes applied to the dialog surface.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  isPending = false,
  onConfirm,
  preventCloseWhilePending = true,
  className,
}: TrustConfirmDialogProps) {
  const blockClose = preventCloseWhilePending && isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (blockClose && !nextOpen) {
      return;
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      size="md"
      closeOnBackdropClick={!blockClose}
      closeOnEscape={!blockClose}
      showCloseButton={!blockClose}
      className={className}
      footer={
        <>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
            className={cn(
              'inline-flex min-h-10 items-center justify-center',
              'rounded-[var(--radius-md)] border',
              'border-[var(--border)] bg-[var(--surface)]',
              'px-4 text-sm font-medium',
              'text-[var(--foreground)] transition-colors',
              'hover:bg-[var(--background-muted)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isPending) {
                void onConfirm();
              }
            }}
            disabled={isPending}
            className={cn(
              'inline-flex min-h-10 items-center justify-center gap-2',
              'rounded-[var(--radius-md)] px-4',
              'text-sm font-medium transition-colors',
              'focus-visible:outline-2',
              'focus-visible:outline-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-60',
              tone === 'danger'
                ? [
                    'bg-[var(--danger)]',
                    'text-white',
                    'hover:opacity-90',
                    'focus-visible:outline-[var(--danger)]',
                  ].join(' ')
                : [
                    'bg-[var(--brand)]',
                    'text-[var(--brand-foreground)]',
                    'hover:bg-[var(--brand-hover)]',
                    'focus-visible:outline-[var(--brand)]',
                  ].join(' '),
            )}
          >
            {isPending && (
              <span
                aria-hidden="true"
                className={[
                  'h-4 w-4 animate-spin rounded-full border-2',
                  'border-current border-r-transparent',
                ].join(' ')}
              />
            )}

            <span>
              {isPending ? 'Processing…' : confirmLabel}
            </span>
          </button>
        </>
      }
    >
      {children}
    </Dialog>
  );
}

export default TrustConfirmDialog;
