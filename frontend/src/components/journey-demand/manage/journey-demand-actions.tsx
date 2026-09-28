// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Actions
// -----------------------------------------------------------------------------
//
// Action composition for an authenticated Journey Demand.
//
// Architecture:
// - Owns no API requests.
// - Does not call mutation hooks.
// - Does not perform authorization checks.
// - Does not derive lifecycle transitions.
// - Does not decide whether a backend transition is allowed.
// - Composes the individual action components for supported operations.
//
// Individual action components own their presentation and receive callbacks
// from the parent/container:
//
// - Publish
// - Cancel
// - Match
// - Convert
// - Fulfill
//
// The parent/container remains responsible for authoritative capability
// decisions, mutation orchestration, success/error handling, and refreshing
// the Journey Demand projection.
// -----------------------------------------------------------------------------

'use client';

import { cn } from '@/foundation';

import { JourneyDemandCancelAction } from './journey-demand-cancel-action';
import { JourneyDemandConvertAction } from './journey-demand-convert-action';
import { JourneyDemandFulfillAction } from './journey-demand-fulfill-action';
import { JourneyDemandMatchAction } from './journey-demand-match-action';
import { JourneyDemandPublishAction } from './journey-demand-publish-action';

export interface JourneyDemandActionsProps {
  /**
   * Whether publishing is currently available to the parent/container.
   *
   * This is a capability supplied by the parent. The component does not
   * derive it from Journey Demand status.
   */
  readonly canPublish?: boolean;

  /**
   * Whether cancellation is currently available to the parent/container.
   */
  readonly canCancel?: boolean;

  /**
   * Whether matching is currently available to the parent/container.
   */
  readonly canMatch?: boolean;

  /**
   * Whether conversion is currently available to the parent/container.
   */
  readonly canConvert?: boolean;

  /**
   * Whether fulfilment is currently available to the parent/container.
   */
  readonly canFulfill?: boolean;

  readonly onPublish?: () => void;
  readonly onCancel?: () => void;
  readonly onMatch?: () => void;
  readonly onConvert?: () => void;
  readonly onFulfill?: () => void;

  readonly isPublishing?: boolean;
  readonly isCancelling?: boolean;
  readonly isMatching?: boolean;
  readonly isConverting?: boolean;
  readonly isFulfilling?: boolean;

  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandActions({
  canPublish = false,
  canCancel = false,
  canMatch = false,
  canConvert = false,
  canFulfill = false,
  onPublish,
  onCancel,
  onMatch,
  onConvert,
  onFulfill,
  isPublishing = false,
  isCancelling = false,
  isMatching = false,
  isConverting = false,
  isFulfilling = false,
  disabled = false,
  className,
}: JourneyDemandActionsProps) {
  const hasActions =
    canPublish ||
    canCancel ||
    canMatch ||
    canConvert ||
    canFulfill;

  if (!hasActions) {
    return null;
  }

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-actions-heading"
    >
      <h2
        id="journey-demand-actions-heading"
        className="sr-only"
      >
        Journey Demand actions
      </h2>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {canPublish ? (
          <JourneyDemandPublishAction
            onPublish={onPublish}
            isPublishing={isPublishing}
            disabled={disabled}
          />
        ) : null}

        {canMatch ? (
          <JourneyDemandMatchAction
            onMatch={onMatch}
            isMatching={isMatching}
            disabled={disabled}
          />
        ) : null}

        {canConvert ? (
          <JourneyDemandConvertAction
            onConvert={onConvert}
            isConverting={isConverting}
            disabled={disabled}
          />
        ) : null}

        {canFulfill ? (
          <JourneyDemandFulfillAction
            onFulfill={onFulfill}
            isFulfilling={isFulfilling}
            disabled={disabled}
          />
        ) : null}

        {canCancel ? (
          <JourneyDemandCancelAction
            onCancel={onCancel}
            isCancelling={isCancelling}
            disabled={disabled}
          />
        ) : null}
      </div>
    </section>
  );
}

