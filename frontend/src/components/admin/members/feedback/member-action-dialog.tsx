
// -----------------------------------------------------------------------------
// sisiMove — Member Action Dialog
// -----------------------------------------------------------------------------
//
// Reusable confirmation dialog for member-management actions.
//
// Responsibilities:
// - Present a clear action title and explanation.
// - Provide configurable confirmation and cancellation actions.
// - Support destructive-action styling.
// - Delegate modal behavior and accessibility to the shared Dialog.
//
// Non-responsibilities:
// - Performing API mutations.
// - Deciding whether an action is authorized.
// - Managing dialog visibility outside the controlled props.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberActionDialogProps {
  /** Whether the dialog is visible. */
  readonly open: boolean;

  /** Controls dialog visibility. */
  readonly onOpenChange: (open: boolean) => void;

  /** Dialog heading. */
  readonly title: string;

  /** Explanation of the action being confirmed. */
  readonly description: string;

  /** Content displayed between the description and footer. */
  readonly children?: ReactNode;

  /** Label for the confirmation button. */
  readonly confirmLabel: string;

  /** Called when the user confirms the action. */
  readonly onConfirm: () => void;

  /** Label for the cancellation button. */
  readonly cancelLabel?: string;

  /** Whether the confirmation action is destructive. */
  readonly destructive?: boolean;

  /** Whether the action is currently being processed. */
  readonly loading?: boolean;

  /** Prevents confirmation when the action is invalid. */
  readonly confirmDisabled?: boolean;

  /** Optional wider dialog layout. */
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Whether clicking the backdrop closes the dialog. */
  readonly closeOnBackdropClick?: boolean;

  /** Additional classes for the dialog surface. */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Member Action Dialog
// -----------------------------------------------------------------------------

export function MemberActionDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  onConfirm,
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  confirmDisabled = false,
  size = 'md',
  closeOnBackdropClick = true,
  className,
}: MemberActionDialogProps): ReactNode {
  const handleConfirm = (): void => {
    if (loading || confirmDisabled) {
      return;
    }

    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size={size}
      closeOnBackdropClick={!loading && closeOnBackdropClick}
      closeOnEscape={!loading}
      showCloseButton={!loading}
      className={className}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant={destructive ? 'danger' : 'primary'}
            disabled={loading || confirmDisabled}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {loading ? 'Please wait…' : confirmLabel}
          </Button>
        </>
      }
    >
      {children ? (
        <div className="space-y-3 text-sm text-[var(--foreground-secondary)]">
          {children}
        </div>
      ) : null}
    </Dialog>
  );
}

export default MemberActionDialog;
