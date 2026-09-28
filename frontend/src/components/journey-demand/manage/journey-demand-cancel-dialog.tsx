'use client';

import { Button, Dialog } from '@/components/ui';
import { cn } from '@/foundation';

/**
 * Props for the Journey Demand cancellation confirmation dialog.
 *
 * The dialog does not perform cancellation itself. The parent owns the
 * mutation and supplies the confirmation callback and request state.
 */
export interface JourneyDemandCancelDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm?: () => void;
  readonly isCancelling?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

/**
 * Confirms that the owner wants to cancel a Journey Demand.
 *
 * This component deliberately does not:
 * - call the cancellation API;
 * - own mutation state;
 * - determine whether cancellation is permitted;
 * - inspect Journey Demand lifecycle state;
 * - update or refetch the Journey Demand.
 *
 * Those responsibilities remain with the owning management/container layer.
 */
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
            disabled={controlsDisabled || !onConfirm}
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