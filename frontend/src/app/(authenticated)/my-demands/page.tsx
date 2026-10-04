// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands Page
// -----------------------------------------------------------------------------
//
// Authenticated route entry point for the current member's Journey Demands.
//
// Physical-world intent:
// - present Journey Demands as real travel needs;
// - provide immediate context for the collection;
// - provide a clear path to create another travel need;
// - keep marketplace actions at the appropriate demand/card boundary;
// - keep data ownership inside the Journey Demand feature.
//
// Responsibilities:
// - establish the /my-demands route;
// - provide page-level title and contextual copy;
// - provide navigation to create a new Journey Demand;
// - compose the authenticated Journey Demand collection coordinator.
//
// Non-responsibilities:
// - data fetching;
// - loading state;
// - error state;
// - Journey Demand mapping;
// - lifecycle/business-state logic;
// - list rendering;
// - ownership or authorization decisions;
// - marketplace View/Share/Join actions.
//
// Marketplace actions such as View, Share, and Join Demand belong to the
// Journey Demand presentation/detail boundaries and are intentionally not
// duplicated at the page level.
//
// The authenticated route group owns the authentication boundary.
// The Journey Demand feature owns its query and collection orchestration.
//
// Route:
//
//   /my-demands
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { MyJourneyDemands } from '@/components/journey-demand/my-demands';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function MyJourneyDemandsPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        {/* ----------------------------------------------------------------- */}
        {/* Page introduction                                                  */}
        {/* ----------------------------------------------------------------- */}

        <header className="section-sm">
          <div className="surface-brand p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-2xl">
                <p className="mb-2 text-sm font-medium text-[var(--brand)]">
                  Your travel needs
                </p>

                <h1 className="text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
                  Where do you need to go?
                </h1>

                <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
                  Keep track of the trips you are looking for and connect your
                  travel needs with journeys that can take you there.
                </p>
              </div>

              <Link
                href="/my-demands/new"
                className={[
                  'inline-flex',
                  'min-h-10',
                  'shrink-0',
                  'items-center',
                  'justify-center',
                  'gap-2',
                  'rounded-[var(--radius-md)]',
                  'border',
                  'border-transparent',
                  'bg-[var(--brand)]',
                  'px-4',
                  'text-sm',
                  'font-medium',
                  'whitespace-nowrap',
                  'text-[var(--brand-foreground)]',
                  'transition-colors',
                  'duration-150',
                  'ease-out',
                  'hover:bg-[var(--brand-hover)]',
                  'active:bg-[var(--brand-hover)]',
                  'focus-visible:outline-2',
                  'focus-visible:outline-[var(--brand)]',
                  'focus-visible:outline-offset-2',
                ].join(' ')}
              >
                Create a travel need
              </Link>
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* Journey Demand collection                                          */}
        {/* ----------------------------------------------------------------- */}

        <MyJourneyDemands />
      </div>
    </main>
  );
}
