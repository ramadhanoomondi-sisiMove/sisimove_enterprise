// -----------------------------------------------------------------------------
// sisiMove — My Journeys Page
// -----------------------------------------------------------------------------
//
// Authenticated Traveller Journey Management
//
// Route:
//
//     /my-journeys
//
// This route is intentionally separate from the marketplace.
//
//     /home
//         → discover Journeys and Journey Demands
//
//     /my-journeys
//         → manage the authenticated traveller's Journey activity
//
// -----------------------------------------------------------------------------
//
// Architecture
// -----------------------------------------------------------------------------
//
//     MyJourneysPage
//          │
//          ▼
//     useMyJourneys()
//          │
//          ▼
//     getMyJourneys()
//          │
//          ▼
//     GET /journeys/me
//          │
//          ▼
//     MyJourneyApiResponse[]
//          │
//          ▼
//     mapMyJourneys()
//          │
//          ▼
//     MyJourney[]
//          │
//          ▼
//     MyJourneysResults
//
// The backend remains responsible for:
//
// - authentication
// - authorization
// - Journey ownership
// - lifecycle state
// - domain rules
//
// The page is responsible for:
//
// - selecting the appropriate presentation state;
// - owning the page-level content rail;
// - handling page-level navigation;
// - passing user interaction callbacks to presentation components.
//
// Data fetching and transport mapping remain inside the Journey feature layer.
// Presentation remains inside the authenticated component boundary.
//
// -----------------------------------------------------------------------------
//
// Important frontend contract
// -----------------------------------------------------------------------------
//
// `useMyJourneys()` is a standard TanStack Query hook.
//
// It returns the normal query result:
//
//     {
//       data,
//       isLoading,
//       error,
//       refetch,
//       ...
//     }
//
// The query data is:
//
//     MyJourney[]
//
// `MyJourney` is the authenticated Journey management read model. It is
// intentionally distinct from the broader `Journey` model used by discovery
// and public Journey surfaces.
//
// The page therefore derives:
//
//     const journeys: MyJourney[] = data ?? [];
//
// The page does not transform Journey data itself. That responsibility belongs
// to `mapMyJourneys()` inside the Journey feature layer.
//
// The page also adapts React Query's `refetch()` return value to the simpler
// callback contract required by `MyJourneysErrorState`.
//
// -----------------------------------------------------------------------------
//
// Navigation
// -----------------------------------------------------------------------------
//
// Journey detail navigation uses the canonical authenticated route:
//
//     /journeys/:journeyPublicId
//
// Route construction remains centralized in AUTHENTICATED_ROUTES.
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import {
  useRouter,
} from 'next/navigation';

// -----------------------------------------------------------------------------
// Journey — Feature
// -----------------------------------------------------------------------------

import {
  useMyJourneys,
} from '@/features/journey/hooks/queries';

import type {
  MyJourney,
} from '@/features/journeys/models';

// -----------------------------------------------------------------------------
// Authenticated Presentation
// -----------------------------------------------------------------------------

import {
  MyJourneysEmptyState,
  MyJourneysErrorState,
  MyJourneysHeader,
  MyJourneysLoadingState,
  MyJourneysResults,
} from '@/components/authenticated/my-journeys';

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing/authenticated-routes';

// =============================================================================
// Page
// =============================================================================

export default function MyJourneysPage() {
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useMyJourneys();

  // ---------------------------------------------------------------------------
  // Query data
  // ---------------------------------------------------------------------------
  //
  // `useMyJourneys()` returns the authenticated management read model:
  //
  //     MyJourney[]
  //
  // An empty array is used while data is unavailable so presentation
  // components always receive a collection rather than `undefined`.
  //
  // ---------------------------------------------------------------------------

  const journeys: MyJourney[] = data ?? [];

  // ---------------------------------------------------------------------------
  // Find Journey
  // ---------------------------------------------------------------------------
  //
  // Returning to /home keeps marketplace discovery separate from Journey
  // management.
  //
  // ---------------------------------------------------------------------------

  const handleFindJourney = () => {
    router.push(
      AUTHENTICATED_ROUTES.HOME,
    );
  };

  // ---------------------------------------------------------------------------
  // Create / Publish Journey
  // ---------------------------------------------------------------------------
  //
  // The actual Journey creation flow owns its verification and authorization
  // requirements. This page only enters that workflow.
  //
  // The creation entry route creates the initial Journey DRAFT and then
  // redirects the user into the Journey creation workspace.
  //
  // ---------------------------------------------------------------------------

  const handlePublishJourney = () => {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_START,
    );
  };

  // ---------------------------------------------------------------------------
  // View / Manage Journey
  // ---------------------------------------------------------------------------
  //
  // My Journeys is an authenticated Journey management collection.
  //
  // The collection provides MyJourney read models, so the callback accepts the
  // same MyJourney type consumed by MyJourneysResults and MyJourneyCard.
  //
  // Navigation itself remains owned by this page.
  //
  // The current canonical Journey detail route is:
  //
  //     /journeys/:journeyPublicId
  //
  // Route construction is delegated to AUTHENTICATED_ROUTES rather than
  // hard-coding the URL.
  //
  // ---------------------------------------------------------------------------

  const handleViewJourney = (journey: MyJourney) => {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY(
        journey.publicId,
      ),
    );
  };

  // ---------------------------------------------------------------------------
  // Retry
  // ---------------------------------------------------------------------------
  //
  // React Query's `refetch()` returns a QueryObserverResult.
  //
  // MyJourneysErrorState intentionally exposes a simpler presentation
  // callback:
  //
  //     () => void | Promise<void>
  //
  // Therefore the page adapts the query operation instead of passing `refetch`
  // directly to the presentation component.
  //
  // ---------------------------------------------------------------------------

  const handleRetry = async () => {
    await refetch();
  };

  // ---------------------------------------------------------------------------
  // Page layout
  // ---------------------------------------------------------------------------
  //
  // The page owns one focused content rail for every presentation state.
  //
  // This keeps loading, error, empty, and results states aligned horizontally
  // and prevents individual presentation states from developing different
  // page geometry.
  //
  // The header remains inside the same rail as the collection content.
  //
  // ---------------------------------------------------------------------------

  return (
    <main className="w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="space-y-6 sm:space-y-8">

            {/* -----------------------------------------------------------------
                Page Header
                ----------------------------------------------------------------- */}

            <MyJourneysHeader
              onPublishJourney={handlePublishJourney}
            />

            {/* -----------------------------------------------------------------
                Loading
                -----------------------------------------------------------------
                
                Keep the header visible while the Journey collection loads so
                the page retains its context and primary action.
                ----------------------------------------------------------------- */}

            {isLoading && (
              <MyJourneysLoadingState />
            )}

            {/* -----------------------------------------------------------------
                Error
                ----------------------------------------------------------------- */}

            {!isLoading && error && (
              <MyJourneysErrorState
                onRetry={handleRetry}
              />
            )}

            {/* -----------------------------------------------------------------
                Empty
                ----------------------------------------------------------------- */}

            {!isLoading &&
              !error &&
              journeys.length === 0 && (
                <MyJourneysEmptyState
                  onFindJourney={handleFindJourney}
                  onPublishJourney={handlePublishJourney}
                />
              )}

            {/* -----------------------------------------------------------------
                Results
                ----------------------------------------------------------------- */}

            {!isLoading &&
              !error &&
              journeys.length > 0 && (
                <MyJourneysResults
                  journeys={journeys}
                  onViewJourney={handleViewJourney}
                />
              )}

          </div>
        </div>
      </div>
    </main>
  );
}