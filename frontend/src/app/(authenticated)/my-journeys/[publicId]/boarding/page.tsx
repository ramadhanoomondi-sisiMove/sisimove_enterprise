// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Page
// -----------------------------------------------------------------------------
//
// Authenticated operational surface for boarding a Journey.
//
// Responsibilities:
// - Resolve the Journey public identifier from the route.
// - Load the Journey Boarding aggregate for that Journey.
// - Resolve the authenticated member identity from the existing auth boundary.
// - Determine provider/passenger presentation context.
// - Compose the Journey Boarding feature components.
//
// This page intentionally does NOT:
// - implement boarding business rules,
// - perform boarding mutations directly,
// - construct API URLs,
// - create or orchestrate the JourneyBoarding aggregate,
// - duplicate participant/lifecycle logic,
// - enforce backend permissions.
//
// Backend authorization and aggregate lifecycle rules remain authoritative.
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { use } from 'react';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  Card,
  Container,
  ErrorState,
  Skeleton,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Authentication / Identity
// -----------------------------------------------------------------------------
//
// Identity is deliberately separate from authentication/session state.
//
// This hook answers:
//
//     "Who is the authenticated Identity?"
//
// The page uses the Identity public identifier only to establish the
// presentation context required by JourneyBoardingActions.
// -----------------------------------------------------------------------------

import { useCurrentIdentity } from '@/features/identity';

// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import {
  JourneyBoardingActions,
  JourneyBoardingActivity,
  JourneyBoardingParticipants,
  JourneyBoardingProgress,
  JourneyBoardingProvider,
  JourneyBoardingSummary,
} from '@/components/journey-boarding';

import { useJourneyBoardingByJourney } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Routing
// -----------------------------------------------------------------------------

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface JourneyBoardingPageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

function JourneyBoardingPageLoading() {
  return (
    <div className="page-shell">
      <Container className="page-container">
        <div className="section-sm">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        <div className="section">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-48 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-32 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-28 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-72 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-56 w-full rounded-[var(--radius-lg)]" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Error
// -----------------------------------------------------------------------------

function JourneyBoardingPageError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="page-shell">
      <Container className="page-container">
        <div className="section">
          <ErrorState
            title="Unable to load boarding"
            description={message}
          />

          <div className="mt-4">
            <Link
              href={AUTHENTICATED_ROUTES.MY_JOURNEYS}
              className={[
                'inline-flex min-h-9 items-center justify-center',
                'rounded-[var(--radius-md)]',
                'border border-[var(--border)]',
                'bg-[var(--background)]',
                'px-3 text-sm font-medium',
                'text-[var(--foreground)]',
                'transition-colors',
                'hover:bg-[var(--background-subtle)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
              ].join(' ')}
            >
              Back to my journeys
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function JourneyBoardingPage({
  params,
}: JourneyBoardingPageProps) {
  const { journeyPublicId } = use(params);

  // ---------------------------------------------------------------------------
  // Journey Boarding
  // ---------------------------------------------------------------------------
  //
  // The hook accepts structured parameters because the query boundary owns
  // its complete request contract.
  //
  // The page does not know the HTTP endpoint.
  // ---------------------------------------------------------------------------

  const boardingQuery = useJourneyBoardingByJourney({
    journeyPublicId,
  });

  // ---------------------------------------------------------------------------
  // Current authenticated Identity
  // ---------------------------------------------------------------------------
  //
  // Identity resolution remains inside the Identity feature.
  //
  // This page only consumes the resulting public identifier when deciding
  // whether the authenticated member is the provider for this boarding.
  // ---------------------------------------------------------------------------

  const identityQuery = useCurrentIdentity();

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (
    boardingQuery.isPending ||
    identityQuery.isPending
  ) {
    return <JourneyBoardingPageLoading />;
  }

  // ---------------------------------------------------------------------------
  // Boarding error
  // ---------------------------------------------------------------------------

  if (boardingQuery.isError) {
    return (
      <JourneyBoardingPageError
        message={
          boardingQuery.error instanceof Error
            ? boardingQuery.error.message
            : 'We could not load the boarding information for this journey.'
        }
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Identity error
  // ---------------------------------------------------------------------------

  if (identityQuery.isError) {
    return (
      <JourneyBoardingPageError
        message={
          identityQuery.error instanceof Error
            ? identityQuery.error.message
            : 'We could not resolve the authenticated identity.'
        }
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Data guards
  // ---------------------------------------------------------------------------

  const boarding = boardingQuery.data;
  const identity = identityQuery.data;

  if (boarding === undefined) {
    return (
      <JourneyBoardingPageError
        message="No boarding record was found for this journey."
      />
    );
  }

  // `useCurrentIdentity()` deliberately returns `Identity | null`.
  //
  // A null Identity means that the identity boundary did not resolve an
  // authenticated Identity. The authenticated route itself remains
  // responsible for authentication/session enforcement.
  if (identity === null) {
    return (
      <JourneyBoardingPageError
        message="Your authenticated identity could not be resolved."
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Provider / passenger presentation context
  // ---------------------------------------------------------------------------
  //
  // Journey Boarding stores the provider as an opaque public identifier.
  //
  // We compare that identifier with the authenticated Identity's public
  // identifier. We intentionally do not infer provider status from an
  // application role such as MEMBER or DRIVER.
  //
  // The result is presentation context only.
  //
  // Backend authorization and aggregate lifecycle rules remain authoritative
  // for every mutation.
  // ---------------------------------------------------------------------------

  const isProvider =
    boarding.providerPublicId === identity.publicId;

  return (
    <div className="page-shell">
      <Container className="page-container">
        {/* ----------------------------------------------------------------- */}
        {/* Page heading                                                       */}
        {/* ----------------------------------------------------------------- */}

        <div className="section-sm">
          <div className="flex flex-col gap-1">
            <Link
              href={AUTHENTICATED_ROUTES.JOURNEY(journeyPublicId)}
              className={[
                'w-fit text-sm font-medium',
                'text-[var(--brand)]',
                'hover:text-[var(--brand-hover)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
              ].join(' ')}
            >
              ← Back to journey
            </Link>

            <div className="mt-2">
              <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                Journey boarding
              </h1>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Operational boarding for journey{' '}
                <span className="font-mono text-xs text-[var(--foreground-muted)]">
                  {journeyPublicId}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Operational dashboard                                              */}
        {/* ----------------------------------------------------------------- */}

        <div className="section">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* ------------------------------------------------------------- */}
            {/* Main operational column                                        */}
            {/* ------------------------------------------------------------- */}

            <div className="flex min-w-0 flex-col gap-4">
              <JourneyBoardingSummary
                boarding={boarding}
              />

              <JourneyBoardingProgress
                boarding={boarding}
              />

              {isProvider && (
                <JourneyBoardingProvider
                  boarding={boarding}
                />
              )}

              <JourneyBoardingParticipants
                boarding={boarding}
              />

              <JourneyBoardingActivity
                boarding={boarding}
              />
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Action column                                                   */}
            {/* ------------------------------------------------------------- */}

            <aside className="flex min-w-0 flex-col gap-4">
              <JourneyBoardingActions
                boarding={boarding}
                isProvider={isProvider}
                currentMemberPublicId={identity.publicId}
              />

              {!isProvider && (
                <Card
                  variant="muted"
                  padding="md"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-semibold text-[var(--foreground)]">
                      Boarding
                    </h2>

                    <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
                      Your available boarding action will appear here when
                      applicable.
                    </p>
                  </div>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}