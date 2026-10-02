// -----------------------------------------------------------------------------
// sisiMove — Journey Management
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Compose the authenticated Journey management UI.
// - Render the Journey editor and lifecycle actions.
// - Coordinate refreshes after successful mutations.
// - Provide the current MyJourney projection to presentation/workflow
//   components.
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
//      └── JourneyEditor
//               │
//               └── successful mutation
//                        │
//                        ▼
//                    onRefresh()
//
// -----------------------------------------------------------------------------

"use client";

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
  className,
}: JourneyManagementProps) {
  // ===========================================================================
  // Refresh Coordination
  // ===========================================================================
  //
  // Individual mutation components remain responsible for their own API calls.
  // This component only coordinates the read-model refresh that follows a
  // successful mutation.
  //
  // ===========================================================================

  async function handleChanged(): Promise<void> {
    if (onRefresh === undefined) {
      return;
    }

    await onRefresh();
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div
      className={cn(
        "w-full",
        "space-y-5",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <JourneyEditorHeader
        journey={journey}
        onBack={onBack}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Lifecycle actions                                                   */}
      {/* ------------------------------------------------------------------- */}

      <JourneyActions
        journey={journey}
        showPublish
        onChanged={handleChanged}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Journey component editors                                           */}
      {/* ------------------------------------------------------------------- */}

      <JourneyEditor
        journey={journey}
        onChanged={handleChanged}
      />
    </div>
  );
}