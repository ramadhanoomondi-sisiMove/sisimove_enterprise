'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Management Panel
// -----------------------------------------------------------------------------
//
// Composition container for Journey Demand management actions.
//
// Responsibilities:
// - render the management section;
// - compose JourneyDemandActions;
// - pass the owning container's action contract through unchanged.
//
// Architecture:
// - owns no server state;
// - owns no mutation hooks;
// - performs no API requests;
// - performs no authorization checks;
// - does not determine lifecycle capabilities;
// - does not manage cancellation confirmation state;
// - does not construct command requests;
// - does not execute lifecycle commands.
//
// Individual action components own their respective mutations:
//
//     JourneyDemandPublishAction
//     JourneyDemandCancelAction
//     JourneyDemandMatchAction
//     JourneyDemandConvertAction
//     JourneyDemandFulfillAction
//
// The owning container remains responsible for:
// - authorization;
// - capability decisions;
// - supplying the Journey Demand public ID;
// - supplying command requests;
// - refreshing the authoritative Journey Demand projection.
//
// -----------------------------------------------------------------------------

import { cn } from '@/foundation';

import {
  JourneyDemandActions,
  type JourneyDemandActionsProps,
} from './journey-demand-actions';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandManagementPanelProps
  extends JourneyDemandActionsProps {
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandManagementPanel({
  title = 'Manage demand',
  description = 'Manage the available actions for this travel need.',
  className,
  ...actionsProps
}: JourneyDemandManagementPanelProps) {
  const hasActions =
    actionsProps.canPublish ||
    actionsProps.canCancel ||
    actionsProps.canMatch ||
    actionsProps.canConvert ||
    actionsProps.canFulfill;

  if (!hasActions) {
    return null;
  }

  return (
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
        <JourneyDemandActions {...actionsProps} />
      </div>
    </section>
  );
}
