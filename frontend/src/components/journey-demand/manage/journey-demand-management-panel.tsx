'use client';

import { useState } from 'react';

import { cn } from '@/foundation';

import {
  JourneyDemandActions,
  type JourneyDemandActionsProps,
} from './journey-demand-actions';
import { JourneyDemandCancelDialog } from './journey-demand-cancel-dialog';

/**
 * Props for the Journey Demand management panel.
 *
 * The panel coordinates presentation of management actions and the
 * cancellation confirmation dialog.
 *
 * The owning container remains responsible for:
 * - authorization;
 * - capability decisions;
 * - mutation hooks;
 * - server requests;
 * - mutation success/error handling;
 * - refetching or updating Journey Demand data.
 */
export interface JourneyDemandManagementPanelProps
  extends JourneyDemandActionsProps {
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

/**
 * Presents the management controls for a Journey Demand.
 *
 * The panel owns only local UI state for opening/closing the cancellation
 * confirmation dialog. It does not own the cancellation mutation itself.
 */
export function JourneyDemandManagementPanel({
  title = 'Manage demand',
  description = 'Manage the available actions for this travel need.',
  className,
  canCancel = false,
  onCancel,
  isCancelling = false,
  disabled = false,
  ...actionsProps
}: JourneyDemandManagementPanelProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const hasActions =
    canCancel ||
    actionsProps.canPublish ||
    actionsProps.canMatch ||
    actionsProps.canConvert ||
    actionsProps.canFulfill;

  if (!hasActions) {
    return null;
  }

  const handleCancelRequest = () => {
    if (!canCancel || !onCancel || disabled || isCancelling) {
      return;
    }

    setIsCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!onCancel || disabled || isCancelling) {
      return;
    }

    onCancel();
  };

  const handleCancelDialogClose = () => {
    if (isCancelling) {
      return;
    }

    setIsCancelDialogOpen(false);
  };

  return (
    <>
      <section
        className={cn('surface min-w-0 p-4 sm:p-5', className)}
        aria-labelledby="journey-demand-management-panel-heading"
      >
        <div className="min-w-0">
          <h2
            id="journey-demand-management-panel-heading"
            className="text-base font-semibold text-foreground"
          >
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-sm text-foreground-muted">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <JourneyDemandActions
            {...actionsProps}
            canCancel={canCancel}
            onCancel={handleCancelRequest}
            isCancelling={isCancelling}
            disabled={disabled}
          />
        </div>
      </section>

      <JourneyDemandCancelDialog
        open={isCancelDialogOpen}
        onClose={handleCancelDialogClose}
        onConfirm={handleCancelConfirm}
        isCancelling={isCancelling}
        disabled={disabled}
      />
    </>
  );
}
