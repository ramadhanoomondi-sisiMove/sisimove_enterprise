// -----------------------------------------------------------------------------
// sisiMove — My Journeys Page
// -----------------------------------------------------------------------------
//
// Authenticated page composition for the user's own Journeys.
//
// Responsibility:
// - Load the authenticated user's Journeys through the Journey feature hook.
// - Select loading / error / empty / results presentation.
// - Establish the page-level content rail.
// - Provide page-level navigation callbacks to presentation components.
//
// This component does NOT:
// - call the API directly;
// - transform Journey API responses;
// - determine Journey ownership;
// - implement Journey domain rules;
// - implement verification rules;
// - contain Journey mutation logic.
//
// Data ownership:
//
//     features/journeys
//          ↓
//     useMyJourneys()
//          ↓
//     MyJourneysPage
//          ↓
//     presentation states
//          ├── MyJourneysLoadingState
//          ├── MyJourneysErrorState
//          ├── MyJourneysEmptyState
//          └── MyJourneysResults
//
// Navigation is intentionally kept at the page boundary so the presentation
// components remain reusable and domain-agnostic.
//
// -----------------------------------------------------------------------------
//
// Layout
// -----------------------------------------------------------------------------
//
// The authenticated shell may span the viewport, while the page content uses
// a focused content rail.
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
// The page owns the layout boundary. Presentation components remain responsible
// for their own internal visual structure.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import { useRouter } from 'next/navigation';

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
// Journey — Feature
// -----------------------------------------------------------------------------

import type { MyJourney } from '@/features/journeys/models';
import { useMyJourneys } from '@/features/journeys/hooks/use-my-journeys';

// =============================================================================
// Routes
// =============================================================================

const HOME_ROUTE = '/home';

const PUBLISH_JOURNEY_ROUTE = '/journeys/create';

// =============================================================================
// My Journeys Page
// =============================================================================

export function MyJourneysPage() {
  const router = useRouter();

  const {
    journeys,
    isLoading,
    error,
    refetch,
  } = useMyJourneys();

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  //
  // The page owns navigation. Child presentation components only emit
  // semantic user actions.
  //
  // ---------------------------------------------------------------------------

  const handleFindJourney = () => {
    router.push(HOME_ROUTE);
  };

  const handlePublishJourney = () => {
    router.push(PUBLISH_JOURNEY_ROUTE);
  };

  const handleViewJourney = (journey: MyJourney) => {
    router.push(
      `/journeys/${encodeURIComponent(journey.publicId)}`,
    );
  };

  // ---------------------------------------------------------------------------
  // Page
  // ---------------------------------------------------------------------------
  //
  // One shared content rail is used for every presentation state. This keeps
  // loading, error, empty, and results views aligned with the same page geometry.
  //
  // max-w-5xl is intentionally used for authenticated management content:
  // wide enough for journey cards, but narrow enough to avoid excessive
  // left/right whitespace on large displays.
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

            <MyJourneysHeader
              onPublishJourney={handlePublishJourney}
            />

            {/* -----------------------------------------------------------------
                Loading
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

export default MyJourneysPage;