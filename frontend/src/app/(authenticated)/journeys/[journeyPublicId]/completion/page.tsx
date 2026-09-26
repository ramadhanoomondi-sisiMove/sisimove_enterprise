// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Page
// -----------------------------------------------------------------------------
//
// Authenticated operational surface for Journey Completion.
//
// Route:
//
//     /journeys/[journeyPublicId]/completion
//
// Responsibilities:
// - Resolve the Journey public identifier from the route.
// - Load the Journey Completion aggregate for that Journey.
// - Load the authenticated Identity.
// - Load the settlement associated with the resolved Completion.
// - Determine provider presentation context.
// - Compose the Journey Completion feature components.
//
// This page intentionally does NOT:
// - implement completion business rules;
// - perform completion mutations directly;
// - perform settlement mutations directly;
// - construct API URLs;
// - create or orchestrate the JourneyCompletion aggregate;
// - create or orchestrate the JourneySettlement aggregate;
// - duplicate confirmation/dispute/settlement lifecycle logic;
// - enforce backend permissions.
//
// Backend authorization and aggregate lifecycle rules remain authoritative.
//
// The route is intentionally Journey-contextual:
//
//     /journeys/[journeyPublicId]/completion
//
// The Journey Completion public identifier is obtained from the resolved
// aggregate and is used internally by individual completion action components
// and by the settlement query.
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

import { useCurrentIdentity } from '@/features/identity';

// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import {
  JourneyCompletionActions,
  JourneyCompletionCard,
  JourneyCompletionConfirmations,
  JourneyCompletionDisputes,
  JourneyCompletionSettlement,
} from '@/components/journey-completion';

import {
  useJourneyCompletionByJourney,
  useJourneySettlementByCompletion,
} from '@/features/journey-completion/hooks/queries';

// -----------------------------------------------------------------------------
// Routing
// -----------------------------------------------------------------------------

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface JourneyCompletionPageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

function JourneyCompletionPageLoading() {
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
              <Skeleton className="h-52 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-32 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-72 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-56 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-48 w-full rounded-[var(--radius-lg)]" />
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

function JourneyCompletionPageError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="page-shell">
      <Container className="page-container">
        <div className="section">
          <ErrorState
            title="Unable to load completion"
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

export default function JourneyCompletionPage({
  params,
}: JourneyCompletionPageProps) {
  const { journeyPublicId } = use(params);

  // ---------------------------------------------------------------------------
  // Journey Completion
  // ---------------------------------------------------------------------------
  //
  // Completion is resolved through the Journey public identifier.
  //
  // The page does not know the HTTP endpoint. The feature query boundary owns
  // that contract.
  // ---------------------------------------------------------------------------

  const completionQuery = useJourneyCompletionByJourney(
    journeyPublicId,
  );

  // ---------------------------------------------------------------------------
  // Current authenticated Identity
  // ---------------------------------------------------------------------------
  //
  // Identity resolution remains inside the Identity feature.
  //
  // The page uses the Identity public identifier only for presentation
  // context. Backend authorization remains authoritative.
  // ---------------------------------------------------------------------------

  const identityQuery = useCurrentIdentity();

  // ---------------------------------------------------------------------------
  // Settlement
  // ---------------------------------------------------------------------------
  //
  // Settlement is a separate backend resource.
  //
  // It is resolved only after the Journey Completion has supplied its own
  // public identifier.
  //
  // The settlement query is observational. This page does not perform or
  // orchestrate settlement lifecycle operations.
  // ---------------------------------------------------------------------------

  const settlementQuery = useJourneySettlementByCompletion(
    completionQuery.data?.publicId,
  );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (
    completionQuery.isPending ||
    identityQuery.isPending ||
    settlementQuery.isPending
  ) {
    return <JourneyCompletionPageLoading />;
  }

  // ---------------------------------------------------------------------------
  // Completion error
  // ---------------------------------------------------------------------------

  if (completionQuery.isError) {
    return (
      <JourneyCompletionPageError
        message={
          completionQuery.error instanceof Error
            ? completionQuery.error.message
            : 'We could not load the completion information for this journey.'
        }
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Identity error
  // ---------------------------------------------------------------------------

  if (identityQuery.isError) {
    return (
      <JourneyCompletionPageError
        message={
          identityQuery.error instanceof Error
            ? identityQuery.error.message
            : 'We could not resolve the authenticated identity.'
        }
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Settlement error
  // ---------------------------------------------------------------------------

  if (settlementQuery.isError) {
    return (
      <JourneyCompletionPageError
        message={
          settlementQuery.error instanceof Error
            ? settlementQuery.error.message
            : 'We could not load the settlement information for this journey.'
        }
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Data guards
  // ---------------------------------------------------------------------------

  const completion = completionQuery.data;
  const identity = identityQuery.data;
  const settlement = settlementQuery.data;

  if (completion === undefined || completion === null) {
    return (
      <JourneyCompletionPageError
        message="No completion record was found for this journey."
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
      <JourneyCompletionPageError
        message="Your authenticated identity could not be resolved."
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Provider presentation context
  // ---------------------------------------------------------------------------
  //
  // Journey Completion stores the provider as an opaque public identifier.
  //
  // Compare that identifier with the authenticated Identity's public
  // identifier. Do not infer provider status from an application role.
  //
  // This is presentation context only. It is not an authorization decision.
  // ---------------------------------------------------------------------------

  const isProvider =
    completion.providerPublicId === identity.publicId;

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
                Journey completion
              </h1>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Completion for journey{' '}
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
              <JourneyCompletionCard
                completion={completion}
                showProgress
                showSettlement={false}
              />

              <JourneyCompletionConfirmations
                confirmations={completion.confirmations}
              />

              <JourneyCompletionDisputes
                disputes={completion.disputes}
              />

              {settlement !== null && (
                <JourneyCompletionSettlement
                  settlement={settlement}
                />
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Action column                                                   */}
            {/* ------------------------------------------------------------- */}

            <aside className="flex min-w-0 flex-col gap-4">
              <JourneyCompletionActions
                completion={completion}
              />

              {!isProvider && (
                <Card
                  variant="muted"
                  padding="md"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-semibold text-[var(--foreground)]">
                      Completion
                    </h2>

                    <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
                      Your available completion action will appear here when
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