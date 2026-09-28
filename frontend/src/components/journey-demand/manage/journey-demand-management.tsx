'use client';

import { cn } from '@/foundation';

import {
  JourneyDemandActions,
  type JourneyDemandActionsProps,
} from './journey-demand-actions';

/**
 * Props for the Journey Demand management action area.
 *
 * Management is intentionally a presentation/composition concern here.
 * The parent/container remains responsible for:
 * - loading the Journey Demand;
 * - determining available capabilities;
 * - invoking mutation hooks;
 * - handling authorization;
 * - handling mutation success/error state;
 * - refetching or updating the parent view.
 */
export interface JourneyDemandManagementProps
  extends JourneyDemandActionsProps {
  readonly title?: string;
  readonly description?: string;
}

/**
 * Composes the Journey Demand management actions with an optional heading
 * and supporting description.
 *
 * This component does not infer actions from Journey Demand status. The
 * backend/application boundary or owning container supplies the explicit
 * capability props.
 */
export function JourneyDemandManagement({
  title = 'Manage demand',
  description,
  className,
  ...actionsProps
}: JourneyDemandManagementProps) {
  const hasAction =
    actionsProps.canPublish ||
    actionsProps.canCancel ||
    actionsProps.canMatch ||
    actionsProps.canConvert ||
    actionsProps.canFulfill;

  if (!hasAction) {
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

