'use client';

import { Button, Dialog } from '@/components/ui';
import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Cancel Dialog
// -----------------------------------------------------------------------------
//
// Presentational cancellation confirmation dialog.
//
// Architecture:
// - owns no API requests;
// - owns no mutation state;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether cancellation is permitted;
// - does not update or refetch the Journey Demand.
//
// The owning JourneyDemandCancelAction supplies:
// - whether the dialog is open;
// - the close callback;
// - the confirmation callback;
// - the mutation loading state;
// - the disabled state.
//
// The dialog is intentionally unaware of where the confirmation callback
// performs its work.
// -----------------------------------------------------------------------------

export interface JourneyDemandCancelDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void | Promise<void>;
  readonly isCancelling?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandCancelDialog({
  open,
  onClose,
  onConfirm,
  isCancelling = false,
  disabled = false,
  className,
}: JourneyDemandCancelDialogProps) {
  const controlsDisabled = disabled || isCancelling;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !controlsDisabled) {
          onClose();
        }
      }}
      title="Cancel travel need"
      description="Confirm that you want to cancel this travel need."
      closeOnBackdropClick={!controlsDisabled}
      closeOnEscape={!controlsDisabled}
      className={cn(className)}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={controlsDisabled}
          >
            Keep demand
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            loading={isCancelling}
            disabled={controlsDisabled}
          >
            Cancel demand
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-foreground-secondary">
        Are you sure you want to cancel this travel need? This action will
        request cancellation and may affect people who have joined it.
      </p>
    </Dialog>
  );
}
