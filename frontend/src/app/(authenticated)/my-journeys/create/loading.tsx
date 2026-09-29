// -----------------------------------------------------------------------------
// sisiMove — Create Journey Loading
// -----------------------------------------------------------------------------
//
// Next.js route-level loading boundary for:
//
//     /journeys/create
//
// The actual Journey creation entry page owns the workflow state. This file
// provides immediate feedback while Next.js is loading the route segment.
//
// -----------------------------------------------------------------------------

import { Spinner } from '@/components/ui';

// =============================================================================
// Loading
// =============================================================================

export default function CreateJourneyLoading() {
  return (
    <main className="w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto flex min-h-[24rem] w-full max-w-3xl items-center justify-center">
          <Spinner
            size="lg"
            label="Starting your journey"
          />
        </div>
      </div>
    </main>
  );
}