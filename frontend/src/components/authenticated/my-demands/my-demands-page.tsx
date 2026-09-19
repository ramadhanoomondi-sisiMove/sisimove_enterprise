// -----------------------------------------------------------------------------
// sisiMove — My Demands Page
// -----------------------------------------------------------------------------
//
// Authenticated Traveller Journey-Demand Management
//
// Route:
//
//     /my-demands
//
// This route is intentionally separate from the marketplace.
//
//     /home
//         → discover Journeys and Journey Demands
//
//     /my-demands
//         → manage the authenticated traveller's Journey Demand activity
//
// -----------------------------------------------------------------------------
//
// Architecture
// -----------------------------------------------------------------------------
//
//     MyDemandsPage
//          │
//          ▼
//     useMyJourneyDemands()
//          │
//          ▼
//     getMyJourneyDemands()
//          │
//          ▼
//     GET /journey-demands/me
//          │
//          ▼
//     MyJourneyDemandResponse[]
//          │
//          ▼
//     MyJourneyDemand[]
//
// The backend remains responsible for:
//
// - authentication
// - authorization
// - Journey Demand ownership
// - lifecycle state
// - domain rules
//
// The page is responsible for:
//
// - selecting the appropriate presentation state;
// - handling page-level navigation;
// - establishing the page content layout;
// - passing user interaction callbacks to presentation components.
//
// Data fetching remains inside the Journey Demand feature layer.
// Presentation remains inside the authenticated component boundary.
//
// -----------------------------------------------------------------------------
//
// Layout
// -----------------------------------------------------------------------------
//
// The authenticated shell may span the viewport, but the page content uses a
// focused content rail.
//
// Mobile:
//     - full available width;
//     - compact horizontal padding;
//     - comfortable vertical spacing.
//
// Tablet/Desktop:
//     - centered content;
//     - constrained maximum width;
//     - consistent horizontal margins;
//     - no excessive left/right spreading.
//
// The page owns this layout boundary. Individual presentation components should
// remain responsible only for their own internal presentation.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import { useRouter } from 'next/navigation';

// -----------------------------------------------------------------------------
// Journey Demand — Feature
// -----------------------------------------------------------------------------

import { useMyJourneyDemands } from '@/features/journey-demands/hooks';

import type {
  MyJourneyDemand,
} from '@/features/journey-demands/models';

// -----------------------------------------------------------------------------
// Authenticated Presentation
// -----------------------------------------------------------------------------

import {
  MyDemandsEmptyState,
  MyDemandsErrorState,
  MyDemandsHeader,
  MyDemandsLoadingState,
  MyDemandsResults,
} from '@/components/authenticated/my-demands';

// =============================================================================
// Routes
// =============================================================================
//
// Keep navigation at the page boundary.
//
// The authenticated marketplace is:
//
//     /home
//
// The authenticated Journey Demand creation flow is:
//
//     /journey-demands/create
//
// Individual owned Demand management is:
//
//     /my-demands/[publicId]
//
// -----------------------------------------------------------------------------

const HOME_ROUTE = '/home';

const CREATE_DEMAND_ROUTE = '/journey-demands/create';

// =============================================================================
// Page
// =============================================================================

export function MyDemandsPage() {
  const router = useRouter();

  const {
    demands,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemands();

  // ---------------------------------------------------------------------------
  // Find Journey
  // ---------------------------------------------------------------------------
  //
  // Returning to /home keeps marketplace discovery separate from Journey
  // Demand management.
  //
  // ---------------------------------------------------------------------------

  const handleFindJourney = () => {
    router.push(HOME_ROUTE);
  };

  // ---------------------------------------------------------------------------
  // Create Journey Demand
  // ---------------------------------------------------------------------------
  //
  // The creation flow owns its verification and authorization requirements.
  // This page only navigates to that flow.
  //
  // ---------------------------------------------------------------------------

  const handleCreateDemand = () => {
    router.push(CREATE_DEMAND_ROUTE);
  };

  // ---------------------------------------------------------------------------
  // View / Manage Demand
  // ---------------------------------------------------------------------------
  //
  // My Demands is an owner-facing collection. An individual Demand therefore
  // resolves to its authenticated management route rather than the public
  // marketplace Demand route.
  //
  // ---------------------------------------------------------------------------

  const handleViewDemand = (demand: MyJourneyDemand) => {
    router.push(
      `/my-demands/${encodeURIComponent(demand.publicId)}`,
    );
  };

  // ---------------------------------------------------------------------------
  // Page Content
  // ---------------------------------------------------------------------------
  //
  // The page establishes one consistent content rail for every presentation
  // state. This prevents loading, error, empty, and result views from adopting
  // different horizontal layouts.
  //
  // max-w-5xl keeps management content readable on large screens while
  // allowing the page to remain effectively full-width on mobile.
  //
  // ---------------------------------------------------------------------------

  return (
    <main className="w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="space-y-6 sm:space-y-8">

            {/* -----------------------------------------------------------------
                Header
                ----------------------------------------------------------------- */}

            <MyDemandsHeader
              onCreateDemand={handleCreateDemand}
            />

            {/* -----------------------------------------------------------------
                Loading
                ----------------------------------------------------------------- */}

            {isLoading && (
              <MyDemandsLoadingState />
            )}

            {/* -----------------------------------------------------------------
                Error
                ----------------------------------------------------------------- */}

            {!isLoading && error && (
              <MyDemandsErrorState
                onRetry={refetch}
              />
            )}

            {/* -----------------------------------------------------------------
                Empty
                ----------------------------------------------------------------- */}

            {!isLoading && !error && demands.length === 0 && (
              <MyDemandsEmptyState
                onFindJourney={handleFindJourney}
                onCreateDemand={handleCreateDemand}
              />
            )}

            {/* -----------------------------------------------------------------
                Results
                ----------------------------------------------------------------- */}

            {!isLoading && !error && demands.length > 0 && (
              <MyDemandsResults
                demands={demands}
                onViewDemand={handleViewDemand}
              />
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

export default MyDemandsPage;