'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Management
// -----------------------------------------------------------------------------
//
// Composition container for Journey Demand management actions.
//
// Architecture:
// - owns no server state;
// - owns no mutation hooks;
// - performs no API requests;
// - performs no authorization checks;
// - does not derive lifecycle capabilities;
// - does not manage confirmation state;
// - composes JourneyDemandActions;
// - passes action inputs through without interpreting them.
//
// JourneyDemandActions delegates each supported operation to its dedicated
// action component:
//
//     JourneyDemandPublishAction
//     JourneyDemandCancelAction
//     JourneyDemandMatchAction
//     JourneyDemandConvertAction
//     JourneyDemandFulfillAction
//
// Individual action components own their respective:
// - mutation hooks;
// - loading state;
// - error state;
// - API invocation;
// - mutation presentation;
// - confirmation workflow where required.
//
// The owning parent/container remains responsible for:
// - authorization;
// - authoritative capability decisions;
// - supplying the Journey Demand public ID;
// - supplying command request metadata;
// - supplying post-success projection refresh callbacks.
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

export interface JourneyDemandManagementProps
  extends JourneyDemandActionsProps {
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandManagement({
  title = 'Manage demand',
  description,
  className,
  ...actionsProps
}: JourneyDemandManagementProps) {
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
      className={cn('surface p-4 sm:p-5', className)}
      aria-labelledby="journey-demand-management-heading"
    >
      <div className="min-w-0">
        <h2
          id="journey-demand-management-heading"
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
