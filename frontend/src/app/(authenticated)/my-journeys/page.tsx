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
//     MyJourneyResponse[]
//          │
//          ▼
//     MyJourney[]
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
// Data fetching remains inside the Journey feature layer.
// Presentation remains inside the authenticated component boundary.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import { useRouter } from 'next/navigation';

// -----------------------------------------------------------------------------
// Journey — Feature
// -----------------------------------------------------------------------------

import {
  useMyJourneys,
} from '@/features/journeys';

import type {
  MyJourney,
} from '@/features/journeys';

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

// =============================================================================
// Routes
// =============================================================================
//
// Keep route ownership at the page boundary.
//
// The authenticated marketplace is:
//
//     /home
//
// The Journey creation flow is:
//
//     /journeys/create
//
// Individual Journey management is:
//
//     /my-journeys/[publicId]
//
// -----------------------------------------------------------------------------

const HOME_ROUTE = '/home';

const CREATE_JOURNEY_ROUTE = '/journeys/create';

// =============================================================================
// Page
// =============================================================================

export default function MyJourneysPage() {
  const router = useRouter();

  const {
    journeys,
    isLoading,
    error,
    refetch,
  } = useMyJourneys();

  // ---------------------------------------------------------------------------
  // Find Journey
  // ---------------------------------------------------------------------------
  //
  // Returning to /home keeps marketplace discovery separate from Journey
  // management.
  //
  // ---------------------------------------------------------------------------

  const handleFindJourney = () => {
    router.push(HOME_ROUTE);
  };

  // ---------------------------------------------------------------------------
  // Create / Publish Journey
  // ---------------------------------------------------------------------------
  //
  // The actual Journey creation flow owns its verification and authorization
  // requirements. This page only navigates to that flow.
  //
  // ---------------------------------------------------------------------------

  const handlePublishJourney = () => {
    router.push(CREATE_JOURNEY_ROUTE);
  };

  // ---------------------------------------------------------------------------
  // View / Manage Journey
  // ---------------------------------------------------------------------------
  //
  // My Journeys is an owner-facing collection, therefore an individual Journey
  // resolves to its authenticated management route rather than the public
  // marketplace Journey detail route.
  //
  // ---------------------------------------------------------------------------

  const handleViewJourney = (journey: MyJourney) => {
    router.push(
      `/my-journeys/${encodeURIComponent(journey.publicId)}`,
    );
  };

  // ---------------------------------------------------------------------------
  // Page layout
  // ---------------------------------------------------------------------------
  //
  // The page owns one focused content rail for every presentation state.
  //
  // This prevents loading, error, empty, and results states from developing
  // different horizontal geometry and keeps the authenticated experience
  // visually consistent with the rest of the application.
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
                onRetry={refetch}
              />
            )}

            {/* -----------------------------------------------------------------
                Empty
                ----------------------------------------------------------------- */}

            {!isLoading && !error && journeys.length === 0 && (
              <MyJourneysEmptyState
                onFindJourney={handleFindJourney}
                onPublishJourney={handlePublishJourney}
              />
            )}

            {/* -----------------------------------------------------------------
                Results
                ----------------------------------------------------------------- */}

            {!isLoading && !error && journeys.length > 0 && (
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