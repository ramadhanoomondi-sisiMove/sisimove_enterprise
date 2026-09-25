import { Spinner } from '@/components/ui';

// -----------------------------------------------------------------------------
// sisiMove — My Journeys Loading
// -----------------------------------------------------------------------------
//
// Next.js route-level loading boundary for:
//
//     /my-journeys
//
// Responsibilities:
// - Provide immediate route-transition feedback.
// - Preserve the authenticated page's content geometry.
// - Remain independent from Journey data fetching.
//
// The page itself owns the full My Journeys loading presentation through
// MyJourneysLoadingState. This route-level fallback exists for the period
// before the page component is ready.
//
// -----------------------------------------------------------------------------

export default function MyJourneysLoading() {
  return (
    <main className="w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center py-16">
          <Spinner
            size="lg"
            label="Loading your journeys"
          />
        </div>
      </div>
    </main>
  );
}