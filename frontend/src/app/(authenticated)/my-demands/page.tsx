// -----------------------------------------------------------------------------
// sisiMove — My Demands Page
// -----------------------------------------------------------------------------
//
// Authenticated Journey Demand management page.
//
// Route:
//     /my-demands
//
// Data boundary:
//
//     MyDemandsPage
//          ↓
//     useMyJourneyDemands()
//          ↓
//     GET /journey-demands/me
//
// This page represents the authenticated requester's own Journey Demands.
//
// Layout principle:
//     The authenticated shell may span the viewport, but page content should
//     remain within a focused, readable content rail. This creates a modern
//     mobile-first application layout without forcing individual child
//     components to manage page-level horizontal spacing.
//
// Page responsibilities:
//     - consume the authenticated Journey Demand hook;
//     - represent loading state;
//     - represent request errors;
//     - represent the empty collection state;
//     - render the user's Journey Demands;
//     - coordinate navigation to marketplace / creation / detail routes.
//
// The page does not:
//     - fetch data directly;
//     - provide requesterPublicId;
//     - perform authorization;
//     - access domain entities;
//     - contain Journey Demand business logic;
//     - format Journey Demand data;
//     - render Journey Demand cards directly.
//
// -----------------------------------------------------------------------------

'use client';

import { useRouter } from 'next/navigation';

import {
  MyDemandsEmptyState,
  MyDemandsErrorState,
  MyDemandsHeader,
  MyDemandsLoadingState,
  MyDemandsResults,
} from '@/components/authenticated/my-demands';

import type { MyJourneyDemand } from '@/features/journey-demands/models';
import { useMyJourneyDemands } from '@/features/journey-demands/hooks';

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

const HOME_ROUTE = '/home';
const CREATE_DEMAND_ROUTE = '/journey-demands/create';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function MyDemandsPage() {
  const router = useRouter();

  const {
    demands,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemands();

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /**
   * Return the user to the authenticated marketplace.
   */
  const handleFindJourney = () => {
    router.push(HOME_ROUTE);
  };

  /**
   * Start creation of a new Journey Demand.
   */
  const handleCreateDemand = () => {
    router.push(CREATE_DEMAND_ROUTE);
  };

  /**
   * Open the authenticated management view for a Journey Demand.
   *
   * This is intentionally different from the public Journey Demand route.
   * The authenticated route represents the requester's own demand and its
   * management lifecycle.
   */
  const handleViewDemand = (demand: MyJourneyDemand) => {
    router.push(
      `/my-demands/${encodeURIComponent(demand.publicId)}`,
    );
  };

  // ---------------------------------------------------------------------------
  // Page content
  // ---------------------------------------------------------------------------
  //
  // The page uses a centered content rail rather than allowing its children
  // to stretch from the far left edge to the far right edge of large screens.
  //
  // Mobile:
  //     full width with compact horizontal padding.
  //
  // Tablet/Desktop:
  //     centered rail with a readable maximum width.
  //
  // This keeps the page visually dense enough for an application while
  // preventing excessive horizontal whitespace between unrelated content.
  // ---------------------------------------------------------------------------

  const content = (
    <div className="mx-auto w-full max-w-5xl">
      <div className="space-y-6 sm:space-y-8">
        <MyDemandsHeader
          onCreateDemand={handleCreateDemand}
        />

        {isLoading ? (
          <MyDemandsLoadingState />
        ) : error ? (
          <MyDemandsErrorState
            onRetry={refetch}
          />
        ) : demands.length === 0 ? (
          <MyDemandsEmptyState
            onFindJourney={handleFindJourney}
            onCreateDemand={handleCreateDemand}
          />
        ) : (
          <MyDemandsResults
            demands={demands}
            onViewDemand={handleViewDemand}
          />
        )}
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Page shell
  // ---------------------------------------------------------------------------

  return (
    <main className="w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {content}
      </div>
    </main>
  );
}