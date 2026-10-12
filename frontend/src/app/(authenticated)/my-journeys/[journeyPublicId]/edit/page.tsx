"use client";

import { useParams, useRouter } from "next/navigation";

import { JourneyEditor } from "@/components/journey/manage";
import { useMyJourney } from "@/features/journey/hooks/queries/use-my-journey";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

export default function EditMyJourneyPage() {
  const params = useParams<{ journeyPublicId: string }>();
  const router = useRouter();

  const journeyPublicId =
    typeof params.journeyPublicId === "string"
      ? params.journeyPublicId.trim()
      : "";

  const {
    journey,
    isLoading,
    error,
    refetch,
  } = useMyJourney(journeyPublicId);

  if (!journeyPublicId) {
    return (
      <main className="page-shell">
        <div className="page-container py-6 sm:py-8">
          <div className="mx-auto w-full max-w-5xl">
            <p role="alert" className="text-sm text-[var(--destructive)]">
              Journey public ID is required.
            </p>
          </div>
        </div>
      </main>
    );
  }

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

  if (error) {
    return (
      <main className="page-shell">
        <div className="page-container py-6 sm:py-8">
          <div className="mx-auto w-full max-w-5xl">
            <p role="alert" className="text-sm text-[var(--destructive)]">
              {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

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

  const publishedActions = (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={() => router.push(AUTHENTICATED_ROUTES.MY_JOURNEYS)}
        className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2"
      >
        View My Journeys
      </button>

      <button
        type="button"
        onClick={() =>
          router.push(
            `/journeys/${encodeURIComponent(journey.publicId)}`,
          )
        }
        className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-foreground)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2"
      >
        View Published Journey
      </button>
    </div>
  );

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