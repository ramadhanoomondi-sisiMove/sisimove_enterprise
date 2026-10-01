// -----------------------------------------------------------------------------
// sisiMove — Edit My Journey Page
// -----------------------------------------------------------------------------
//
// Authenticated Journey editing surface.
//
// The Journey is loaded from the authenticated provider's MyJourney collection.
// `useMyJourney()` selects the requested Journey by publicId.
//
// This works for DRAFT Journeys because My Journeys is not a public marketplace
// query and does not require the Journey to be published.
// -----------------------------------------------------------------------------

"use client";

import { useParams } from "next/navigation";

import { JourneyEditor } from "@/components/journey/manage";
import { useMyJourney } from "@/features/journey/hooks/queries/use-my-journey";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function EditMyJourneyPage() {
  const params = useParams<{ publicId: string }>();

  const publicId = params.publicId;

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
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-sm text-[var(--muted-foreground)]">
          Loading Journey...
        </p>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-sm text-[var(--destructive)]">
          {error.message}
        </p>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not found
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-sm text-[var(--muted-foreground)]">
          Journey not found.
        </p>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Editor
  // ---------------------------------------------------------------------------

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <JourneyEditor
        journey={journey}
        onChanged={refetch}
      />
    </main>
  );
}