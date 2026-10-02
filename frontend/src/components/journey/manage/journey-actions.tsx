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
// Lifecycle callback contract:
//
//   lifecycle mutation succeeds
//              ↓
//   individual action notifies this component's parent callback
//              ↓
//   parent refreshes projection / updates presentation
//
// Publication uses a dedicated callback because publication acknowledgement
// is intentionally independent from the normal projection-refresh callback:
//
//   publication succeeds
//              ↓
//   onPublished()
//              ├── acknowledge publication immediately
//              └── refresh projection independently
//
// This component does not interpret or transform callback failures.
//
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation/utils/cn";

import type { MyJourney } from "@/features/journey/models";

import { JourneyCancelAction } from "./journey-cancel-action";
import { JourneyCompleteAction } from "./journey-complete-action";
import { JourneyExpireAction } from "./journey-expire-action";
import { JourneyPublishAction } from "./journey-publish-action";
import { JourneyStartAction } from "./journey-start-action";

// =============================================================================
// Props
// =============================================================================

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
   * Called after a successful non-publication lifecycle mutation.
   *
   * The usual implementation is to refresh the authoritative Journey
   * projection and update the owning management surface.
   *
   * This component only forwards the callback. It does not own refresh,
   * success acknowledgement, navigation, or presentation state.
   */
  readonly onChanged?: () => void | Promise<void>;

  /**
   * Called after the Journey has been successfully published.
   *
   * Publication has a dedicated callback because the management surface may
   * need to acknowledge publication immediately without waiting for the
   * authoritative projection refresh.
   *
   * This component only forwards the callback. It does not own the success
   * acknowledgement or refresh behavior.
   */
  readonly onPublished?: () => void | Promise<void>;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyActions({
  journey,
  showPublish = false,
  showStart = false,
  showComplete = false,
  showCancel = false,
  showExpire = false,
  disabled = false,
  onChanged,
  onPublished,
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

  const journeyPublicId = journey.publicId;

  // ===========================================================================
  // Render
  // ===========================================================================

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
        {/* ----------------------------------------------------------------- */}
        {/* Publish                                                           */}
        {/* ----------------------------------------------------------------- */}

        {showPublish && (
          <JourneyPublishAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onPublished={onPublished}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Start                                                             */}
        {/* ----------------------------------------------------------------- */}

        {showStart && (
          <JourneyStartAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onStarted={onChanged}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Complete                                                          */}
        {/* ----------------------------------------------------------------- */}

        {showComplete && (
          <JourneyCompleteAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onCompleted={onChanged}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Cancel                                                            */}
        {/* ----------------------------------------------------------------- */}

        {showCancel && (
          <JourneyCancelAction
            journeyPublicId={journeyPublicId}
            disabled={disabled}
            onCancelled={onChanged}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Expire                                                            */}
        {/* ----------------------------------------------------------------- */}

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