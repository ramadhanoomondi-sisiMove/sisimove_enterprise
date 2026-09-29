// -----------------------------------------------------------------------------
// sisiMove — Journey Management Actions
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - compose the available Journey lifecycle actions;
// - receive the Journey projection from the management parent;
// - allow the parent to control which lifecycle actions are available;
// - forward refresh/success callbacks to individual lifecycle actions.
//
// Non-responsibilities:
// - no lifecycle mutation handling;
// - no navigation;
// - no authorization decisions;
// - no verification checks;
// - no Journey eligibility calculation;
// - no status inference;
// - no generic action handling.
//
// Individual lifecycle components own their own mutations:
//
//   JourneyPublishAction
//   JourneyStartAction
//   JourneyCompleteAction
//   JourneyCancelAction
//   JourneyExpireAction
//
// The parent management surface decides which actions are appropriate for
// the current Journey. This component therefore does not derive visibility
// from JourneyStatus.
//
// IMPORTANT:
// This component is intentionally separate from:
//
//   components/shared/journey-actions.tsx
//
// The shared component presents View/Book actions for marketplace/detail
// presentation. This component presents authenticated Journey lifecycle
// management actions.
//
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation/utils/cn";

import type { MyJourney } from "@/features/journey/models";

import { JourneyPublishAction } from "./journey-publish-action";
import { JourneyStartAction } from "./journey-start-action";
import { JourneyCompleteAction } from "./journey-complete-action";
import { JourneyCancelAction } from "./journey-cancel-action";
import { JourneyExpireAction } from "./journey-expire-action";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyActionsProps {
  /**
   * Authenticated Journey projection being managed.
   */
  readonly journey: MyJourney;

  /**
   * Whether the publish action should be displayed.
   *
   * The parent owns the lifecycle/permission decision.
   */
  readonly showPublish?: boolean;

  /**
   * Whether the start action should be displayed.
   *
   * The parent owns the lifecycle/permission decision.
   */
  readonly showStart?: boolean;

  /**
   * Whether the complete action should be displayed.
   *
   * The parent owns the lifecycle/permission decision.
   */
  readonly showComplete?: boolean;

  /**
   * Whether the cancel action should be displayed.
   *
   * The parent owns the lifecycle/permission decision.
   */
  readonly showCancel?: boolean;

  /**
   * Whether the expire action should be displayed.
   *
   * The parent owns the lifecycle/permission decision.
   */
  readonly showExpire?: boolean;

  /**
   * Allows the parent management surface to disable all lifecycle actions.
   */
  readonly disabled?: boolean;

  /**
   * Called after any lifecycle action succeeds.
   *
   * The usual implementation is to refetch the My Journey projection.
   */
  readonly onChanged?: () => void | Promise<void>;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyActions({
  journey,
  showPublish = false,
  showStart = false,
  showComplete = false,
  showCancel = false,
  showExpire = false,
  disabled = false,
  onChanged,
  className,
}: JourneyActionsProps) {
  const hasActions =
    showPublish ||
    showStart ||
    showComplete ||
    showCancel ||
    showExpire;

  if (!hasActions) {
    return null;
  }

  const journeyPublicId =
    journey.publicId;

  return (
    <section
      aria-label="Journey management actions"
      className={cn(
        "space-y-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex",
          "flex-col",
          "gap-2",
          "sm:flex-row",
          "sm:flex-wrap",
          "sm:items-center",
        )}
      >
        {showPublish && (
          <JourneyPublishAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onPublished={onChanged}
          />
        )}

        {showStart && (
          <JourneyStartAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onStarted={onChanged}
          />
        )}

        {showComplete && (
          <JourneyCompleteAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onCompleted={onChanged}
          />
        )}

        {showCancel && (
          <JourneyCancelAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onCancelled={onChanged}
          />
        )}

        {showExpire && (
          <JourneyExpireAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onExpired={onChanged}
          />
        )}
      </div>
    </section>
  );
}

