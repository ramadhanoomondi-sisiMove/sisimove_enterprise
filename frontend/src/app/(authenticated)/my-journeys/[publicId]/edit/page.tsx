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
// - acknowledge successful publication;
// - provide clear next actions after publication;
// - refresh the Journey projection after editor changes.
//
// Non-responsibilities:
// - no Journey mutation logic;
// - no publish mutation logic;
// - no lifecycle transition implementation;
// - no aggregate reconstruction;
// - no public Journey querying.
//
// Publication flow:
//
//   Publish
//      ↓
//   Backend confirms publication
//      ↓
//   JourneyEditor refreshes the projection
//      ↓
//   This page acknowledges successful publication
//      ↓
//   User sees that the Journey is live and can receive bookings
//      ↓
//   User chooses the next destination.
//
// Navigation is therefore user-directed rather than automatic.
//
// -----------------------------------------------------------------------------
//
// Next actions after publication:
//
// - View My Journeys
// - View Published Journey
//
// -----------------------------------------------------------------------------
//

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { JourneyEditor } from "@/components/journey/manage";
import { useMyJourney } from "@/features/journey/hooks/queries/use-my-journey";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function EditMyJourneyPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const [published, setPublished] = useState(false);

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
  // Published Success
  // ---------------------------------------------------------------------------
  //
  // Publication has already succeeded on the backend.
  //
  // The user remains on the current management surface and is explicitly told
  // what changed before being offered the next destinations.
  //
  // ---------------------------------------------------------------------------

  return (
    <main className="page-shell">
      <div className="page-container py-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="space-y-6">
            {published && (
              <section
                aria-live="polite"
                aria-labelledby="journey-published-title"
                className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--success)]">
                      Journey published successfully
                    </p>

                    <h1
                      id="journey-published-title"
                      className="mt-1 text-lg font-semibold text-[var(--foreground)] sm:text-xl"
                    >
                      Your Journey is now live
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                      Your Journey is now available for travellers to
                      discover. It can receive bookings and be appreciated
                      by the SisiMove community.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        router.push(
                          AUTHENTICATED_ROUTES.MY_JOURNEYS,
                        );
                      }}
                      className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90"
                    >
                      View My Journeys
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        router.push(
                          `/journeys/${encodeURIComponent(
                            journey.publicId,
                          )}`,
                        );
                      }}
                      className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
                    >
                      View Published Journey
                    </button>
                  </div>
                </div>
              </section>
            )}

            <JourneyEditor
              journey={journey}
              onChanged={refetch}
              showPublishAction={!published}
              onPublished={() => {
                setPublished(true);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}