
'use client';

import { useState } from 'react';

import type {
  AdminAssessBookingCommissionModel,
  AdminCancelBookingCommissionModel,
} from '@/features/admin/commissions/models';

import {
  BookingCommissionAction,
  BookingCommissionActionsMenu,
} from './BookingCommissionActionsMenu';

import { BookingCommissionAssessDialog } from './BookingCommissionAssessDialog';
import { BookingCommissionCancelDialog } from './BookingCommissionCancelDialog';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ActiveDialog = 'assess' | 'cancel' | null;

export interface BookingCommissionOperationsPanelProps {
  readonly commissionPublicId: string;
  readonly availableActions: readonly BookingCommissionAction[];
  readonly isAssessing?: boolean;
  readonly isCancelling?: boolean;
  readonly onAssess: (
    payload: AdminAssessBookingCommissionModel,
  ) => Promise<void>;
  readonly onCancel: (
    payload: AdminCancelBookingCommissionModel,
  ) => Promise<void>;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionOperationsPanel({
  commissionPublicId,
  availableActions,
  isAssessing = false,
  isCancelling = false,
  onAssess,
  onCancel,
}: BookingCommissionOperationsPanelProps) {
  const [activeDialog, setActiveDialog] =
    useState<ActiveDialog>(null);

  const isMutating = isAssessing || isCancelling;

  // ---------------------------------------------------------------------------
  // Dialog Control
  // ---------------------------------------------------------------------------

  const handleClose = () => {
    if (isMutating) {
      return;
    }

    setActiveDialog(null);
  };

  const handleAction = (action: BookingCommissionAction) => {
    if (isMutating) {
      return;
    }

    setActiveDialog(action);
  };

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const handleAssess = async (
    payload: AdminAssessBookingCommissionModel,
  ) => {
    await onAssess(payload);
    setActiveDialog(null);
  };

  const handleCancel = async (
    payload: AdminCancelBookingCommissionModel,
  ) => {
    await onCancel(payload);
    setActiveDialog(null);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <>
      <BookingCommissionActionsMenu
        availableActions={availableActions}
        onAction={handleAction}
        disabled={isMutating}
      />

      <BookingCommissionAssessDialog
        open={activeDialog === 'assess'}
        loading={isAssessing}
        commissionPublicId={commissionPublicId}
        onClose={handleClose}
        onSubmit={handleAssess}
      />

      <BookingCommissionCancelDialog
        open={activeDialog === 'cancel'}
        loading={isCancelling}
        commissionPublicId={commissionPublicId}
        onClose={handleClose}
        onSubmit={handleCancel}
      />
    </>
  );
}
