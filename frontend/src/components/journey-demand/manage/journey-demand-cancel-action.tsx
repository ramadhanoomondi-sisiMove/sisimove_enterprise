'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Cancel Action
// -----------------------------------------------------------------------------
//
// Self-contained cancellation action for an authenticated Journey Demand.
//
// Architecture:
// - owns the cancellation mutation;
// - owns mutation loading/error state;
// - owns the cancellation confirmation state;
// - performs the cancellation API request through the mutation hook;
// - renders the cancellation confirmation dialog;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether cancellation is allowed;
// - parent/container supplies the publicId and request;
// - parent/container remains responsible for capability/visibility decisions;
// - parent/container may refresh the authoritative Journey Demand projection
//   through onSuccess.
//
// Confirmation flow:
//
//     Cancel demand
//          ↓
//     confirmation dialog
//          ↓
//     confirm
//          ↓
//     useCancelJourneyDemand()
//          ↓
//     onSuccess
//
// -----------------------------------------------------------------------------

import { useState } from 'react';

import { Button } from '@/components/ui';

import type { CancelJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/cancel-journey-demand.api';
import { useCancelJourneyDemand } from '@/features/journey-demand/hooks';

import { JourneyDemandCancelDialog } from './journey-demand-cancel-dialog';

export interface JourneyDemandCancelActionProps {
  readonly journeyDemandPublicId: string;
  readonly request: CancelJourneyDemandRequest;
  readonly onSuccess?: () => void | Promise<void>;
  readonly disabled?: boolean;
}

export function JourneyDemandCancelAction({
  journeyDemandPublicId,
  request,
  onSuccess,
  disabled = false,
}: JourneyDemandCancelActionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isLoading, error, cancelJourneyDemand } =
    useCancelJourneyDemand();

  const isDisabled = disabled || isLoading;

  const handleOpenDialog = (): void => {
    if (isDisabled) {
      return;
    }

    setIsDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    if (isLoading) {
      return;
    }

    setIsDialogOpen(false);
  };

  const handleConfirmCancel = async (): Promise<void> => {
    if (isDisabled) {
      return;
    }

    try {
      await cancelJourneyDemand(journeyDemandPublicId, request);

      setIsDialogOpen(false);

      await onSuccess?.();
    } catch {
      // The mutation hook owns and exposes the normalized error state.
      // Keep the dialog open so the user can see the error state and decide
      // whether to retry or close the confirmation workflow.
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="danger"
        size="md"
        onClick={handleOpenDialog}
        loading={isLoading}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        title={error?.message}
      >
        Cancel demand
      </Button>

      <JourneyDemandCancelDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmCancel}
        isCancelling={isLoading}
        disabled={disabled}
      />
    </>
  );
}
