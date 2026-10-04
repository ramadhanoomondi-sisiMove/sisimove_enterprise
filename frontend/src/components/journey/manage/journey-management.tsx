// -----------------------------------------------------------------------------
// sisiMove — Journey Management
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Compose the authenticated Journey management UI.
// - Render the Journey editor and lifecycle actions.
// - Coordinate refreshes after successful mutations.
// - Own management-level success acknowledgement for lifecycle actions.
// - Provide the current MyJourney projection to presentation/workflow
//   components.
// - Render caller-provided acknowledgement actions.
//
// Non-responsibilities:
// - No Journey query.
// - No Journey API mutation implementation.
// - No backend aggregate/entity reconstruction.
// - No lifecycle rules.
// - No authorization decisions.
// - No route construction or navigation.
//
// Data flow:
//
//   JourneyManagementPanel
//          │
//          │ MyJourney
//          ▼
//   JourneyManagement
//      ├── EditorHeader
//      ├── LifecycleActions
//      │       └── successful publication
//      │                │
//      │                ├── open SuccessModal
//      │                └── refresh projection
//      │
//      └── JourneyEditor
//               │
//               └── successful mutation
//                        │
//                        ▼
//                    onRefresh()
//
// Publication acknowledgement is intentionally owned here because
// JourneyActions can publish a Journey independently of JourneyEditor.
//
// Navigation is intentionally NOT owned here. The owning route/page may
// provide navigation actions through `publicationSuccessActions`.
//
// The success modal must not wait for the read-model refresh. Publication has
// already succeeded at the backend boundary when the acknowledgement callback
// is invoked.
//
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { SuccessModal } from "@/components/ui/success-modal";
import { cn } from "@/foundation/utils/cn";

import type { MyJourney } from "@/features/journey/models";

import { JourneyActions } from "./journey-actions";
import { JourneyEditor } from "./journey-editor";
import { JourneyEditorHeader } from "./journey-editor-header";

// =============================================================================
// Props
// =============================================================================

export interface JourneyManagementProps {
  /**
   * Current authenticated Journey projection.
   *
   * This is the read model returned by the authenticated Journey API.
   */
  readonly journey: MyJourney;

  /**
   * Refreshes the authenticated Journey projection after a successful
   * mutation.
   *
   * The management layer does not fabricate updated Journey state locally.
   */
  readonly onRefresh?: () => void | Promise<void>;

  /**
   * Optional callback for leaving the management view.
   *
   * Navigation remains owned by the route/page composition layer.
   */
  readonly onBack?: () => void;

  /**
   * Optional actions rendered in the publication success acknowledgement.
   *
   * The owning route/page provides these actions so that route construction
   * and navigation remain outside the management component.
   */
  readonly publicationSuccessActions?: ReactNode;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyManagement({
  journey,
  onRefresh,
  onBack,
  publicationSuccessActions,
  className,
}: JourneyManagementProps) {
  // ===========================================================================
  // Success acknowledgement
  // ===========================================================================

  const [publicationSucceeded, setPublicationSucceeded] =
    useState(false);

  // ===========================================================================
  // Refresh Coordination
  // ===========================================================================

  async function handleChanged(): Promise<void> {
    if (onRefresh === undefined) {
      return;
    }

    await onRefresh();
  }

  // ===========================================================================
  // Publication Success
  // ===========================================================================

  async function handlePublished(): Promise<void> {
    setPublicationSucceeded(true);

    const refreshResult = onRefresh?.();

    if (refreshResult !== undefined) {
      void Promise.resolve(refreshResult).catch(() => undefined);
    }
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <>
      <div
        className={cn(
          "w-full",
          "space-y-5",
          className,
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <JourneyEditorHeader
          journey={journey}
          onBack={onBack}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Lifecycle actions                                                 */}
        {/* ----------------------------------------------------------------- */}

        <JourneyActions
          journey={journey}
          showPublish
          showCancel={journey.status === "DRAFT"}
          onChanged={handleChanged}
          onPublished={handlePublished}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Journey component editors                                         */}
        {/* ----------------------------------------------------------------- */}

        <JourneyEditor
          journey={journey}
          onChanged={handleChanged}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Publication success                                                 */}
      {/* ------------------------------------------------------------------- */}

      <SuccessModal
        open={publicationSucceeded}
        title="Your Journey is now live"
        description="Your Journey has been published successfully and is now available for travellers to discover and book."
        onClose={() => setPublicationSucceeded(false)}
        actions={publicationSuccessActions}
      >
        <p className="text-sm leading-6 text-[var(--foreground-muted)]">
          Your Journey is now published. You can view it as a traveller or
          continue managing your Journey.
        </p>
      </SuccessModal>
    </>
  );
}