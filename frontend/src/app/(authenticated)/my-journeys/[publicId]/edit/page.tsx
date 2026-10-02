// -----------------------------------------------------------------------------
// Path: src/app/(authenticated)/my-journeys/[publicId]/edit/page.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Edit My Journey Page
//
// Authenticated Journey editing and management surface.
//
// The Journey is loaded from the authenticated provider's MyJourney collection.
// `useMyJourney()` selects the requested Journey by publicId.
//
// This works for DRAFT Journeys because My Journeys is not a public marketplace
// query and does not require the Journey to be published.
//
// Route:
//   /my-journeys/[publicId]/edit
//
// Responsibilities:
// - read the Journey publicId from the route;
// - load the authenticated MyJourney projection;
// - render loading/error/not-found states;
// - compose the JourneyEditor;
// - enable Journey management actions;
// - provide explicit next actions after successful publication;
// - refresh the Journey projection after editor changes.
//
// Non-responsibilities:
// - no Journey mutation logic;
// - no publish mutation logic;
// - no lifecycle transition implementation;
// - no aggregate reconstruction;
// - no public Journey querying;
// - no publication success state;
// - no SuccessModal ownership;
// - no automatic navigation after publication.
//
// Publication flow:
//
//   Publish
//      ↓
//   Backend confirms publication
//      ↓
//   JourneyEditor acknowledges success
//      ↓
//   SuccessModal opens
//      ↓
//   User chooses the next destination
//
// The JourneyEditor refreshes the Journey projection independently after
// successful publication. The acknowledgement itself is owned by the editor
// so the success dialog is not dependent on the query refresh completing.
//
// Navigation is therefore user-directed rather than automatic.
//
// The JourneyEditor owns the publication acknowledgement because it also owns
// the component-change success lifecycle. This page supplies only the
// navigation actions that are appropriate after publication.
//
// -----------------------------------------------------------------------------
//
// Next actions after publication:
//
// - View My Journeys
// - View Published Journey
// - Done / close the success dialog
//
// -----------------------------------------------------------------------------

"use client";

import { useParams, useRouter } from "next/navigation";

import { JourneyEditor } from "@/components/journey/manage";
import { useMyJourney } from "@/features/journey/hooks/queries/use-my-journey";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

// =============================================================================
// Page
// =============================================================================

export default function EditMyJourneyPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId = params.publicId;

  // ---------------------------------------------------------------------------
  // Journey Query
  // ---------------------------------------------------------------------------

  const {
    journey,
    isLoading,
    error,
    refetch,
  } = useMyJourney(publicId);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="page-shell">
        <div className="page-container py-6 sm:py-8">
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-sm text-[var(--foreground-muted)]">
              Loading Journey...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <main className="page-shell">
        <div className="page-container py-6 sm:py-8">
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-sm text-[var(--destructive)]">
              {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not Found
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <main className="page-shell">
        <div className="page-container py-6 sm:py-8">
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-sm text-[var(--foreground-muted)]">
              Journey not found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Publication Next Actions
  //
  // These actions are intentionally supplied to JourneyEditor as presentation
  // content. JourneyEditor owns the success acknowledgement; this page owns
  // navigation because navigation is a page concern.
  // ---------------------------------------------------------------------------

  const publishedActions = (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={() => {
          router.push(AUTHENTICATED_ROUTES.MY_JOURNEYS);
        }}
        className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2"
      >
        View My Journeys
      </button>

      <button
        type="button"
        onClick={() => {
          router.push(
            `/journeys/${encodeURIComponent(journey.publicId)}`,
          );
        }}
        className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-foreground)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2"
      >
        View Published Journey
      </button>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="page-shell">
      <div className="page-container py-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <JourneyEditor
            journey={journey}
            onChanged={refetch}
            showPublishAction
            publishedActions={publishedActions}
          />
        </div>
      </div>
    </main>
  );
}