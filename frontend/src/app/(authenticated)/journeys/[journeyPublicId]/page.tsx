'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Page
// -----------------------------------------------------------------------------
//
// Authenticated Journey detail surface.
//
// Route:
//
//     /journeys/[journeyPublicId]
//
// Responsibilities:
// - Read the Journey public identifier from the Next.js route.
// - Retrieve the Journey through the Journey discovery query.
// - Handle loading, error, and unavailable states.
// - Compose the Journey detail presentation components.
// - Provide navigation back to the authenticated marketplace.
//
// Non-responsibilities:
// - HTTP requests.
// - API URL construction.
// - Authentication token management.
// - Journey lifecycle mutations.
// - Traveller/Profile/Trust reconstruction.
// - Asset URL resolution.
// - Domain business rules.
// - Authorization decisions.
//
// Architectural boundary:
//
//     Next.js route
//          │
//          │ journeyPublicId
//          ▼
//     useJourney({ journeyPublicId })
//          │
//          ▼
//     Journey frontend model
//          │
//          ▼
//     JourneyDetailContainer
//          │
//          ├── JourneyDetailHeader
//          ├── JourneyDetailRoute
//          ├── JourneyDetailSchedule
//          ├── JourneyDetailVehicle
//          ├── JourneyDetailCapacity
//          ├── JourneyDetailPricing
//          ├── JourneyDetailPreferences
//          └── JourneyDetailAssets
//
// The page is an orchestration boundary. Detail components remain
// presentation-only and do not retrieve their own Journey data.
//
// -----------------------------------------------------------------------------
//
// UI contract:
// - Existing frozen sisiMove detail UI is preserved.
// - Existing shared UI primitives are used.
// - Existing frozen design tokens are used through those primitives.
// - ErrorState receives actions through its existing typed action API.
// - No button styling is duplicated in this page.
// - No new colors, spacing systems, visual treatments, or design tokens
//   are introduced here.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// -----------------------------------------------------------------------------
// Shared UI
// -----------------------------------------------------------------------------

import {
  Button,
  Card,
  ErrorState,
  Spinner,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Journey detail presentation
// -----------------------------------------------------------------------------
//
// `JourneyDetailOverview` is intentionally NOT imported because it is not part
// of the current detail component barrel.
//
// `JourneyDetailContainer` is the existing presentation composition component
// exposed by the detail barrel.
// -----------------------------------------------------------------------------

import {
  JourneyDetailContainer,
} from '@/components/journeys/detail';

// -----------------------------------------------------------------------------
// Journey feature
// -----------------------------------------------------------------------------

import { useJourney } from '@/features/journey/hooks/queries';

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

import { AUTHENTICATED_ROUTES } from '@/foundation/routing/authenticated-routes';

// =============================================================================
// Page
// =============================================================================

export default function JourneyDetailPage() {
  const params = useParams<{
    journeyPublicId: string;
  }>();

  const journeyPublicId = params.journeyPublicId;

  return (
    <JourneyDetailContent
      journeyPublicId={journeyPublicId}
    />
  );
}

// =============================================================================
// Journey detail content
// =============================================================================
//
// Kept as a separate component so the route-level orchestration remains easy
// to reason about while the React Query lifecycle is isolated here.
//
// =============================================================================

function JourneyDetailContent({
  journeyPublicId,
}: {
  journeyPublicId: string;
}) {
  const {
    data: journey,
    isLoading,
    isError,
    refetch,
  } = useJourney({
    journeyPublicId,
  });

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner
            size="lg"
            label="Loading journey"
          />
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <main className="page-container">
        <div className="mx-auto max-w-2xl py-12">
          <ErrorState
            title="Unable to load this journey"
            description="We could not retrieve the journey details. Please try again."
            retryAction={{
              label: 'Try again',
              variant: 'primary',
              onClick: () => void refetch(),
            }}
          />
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not found / unavailable
  // ---------------------------------------------------------------------------
  //
  // The public Journey detail API returns null when the requested Journey
  // cannot be resolved as a discoverable Journey.
  //
  // This page deliberately does not attempt to distinguish between:
  //
  // - never existed;
  // - no longer published;
  // - cancelled;
  // - expired;
  // - otherwise unavailable.
  //
  // Those distinctions belong to the backend read model and its response
  // contract, not to route-level inference.
  //
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <main className="page-container">
        <div className="mx-auto max-w-2xl py-12">
          <Card
            variant="outlined"
            padding="lg"
            className="text-center"
          >
            <div className="mx-auto max-w-md">
              <h1 className="text-xl font-semibold text-[var(--foreground)]">
                Journey not found
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
                This journey may no longer be available in the marketplace.
              </p>

              <div className="mt-6">
                <Link href={AUTHENTICATED_ROUTES.HOME}>
                  <Button
                    variant="primary"
                    leadingIcon={
                      <ArrowLeft
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    }
                  >
                    Back to journeys
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Journey detail
  // ---------------------------------------------------------------------------

  return (
    <main className="page-container">
      <div className="mx-auto max-w-4xl py-6 sm:py-8">
        {/* ----------------------------------------------------------------- */}
        {/* Back navigation                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div className="mb-5">
          <Link
            href={AUTHENTICATED_ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:text-[var(--brand)]"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>Back to journeys</span>
          </Link>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Journey detail composition                                         */}
        {/* ----------------------------------------------------------------- */}
           <JourneyDetailContainer journey={journey} />
      </div>
    </main>
  );
}