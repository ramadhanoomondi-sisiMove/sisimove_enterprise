// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Detail Route
// -----------------------------------------------------------------------------
//
// Authenticated Journey Demand detail route/container.
//
// Responsibilities:
// - receive the Journey Demand public ID from the route;
// - load the authenticated owner's Journey Demand;
// - present loading state;
// - present backend/API error state;
// - render the owner detail composition once data is available.
//
// Architecture rules:
// - Authentication is established by the authenticated route boundary.
// - Ownership is resolved by the backend through the authenticated API.
// - The frontend does not compare requesterPublicId values.
// - The frontend does not authorize ownership.
// - The frontend does not fetch through the public Journey Demand API.
// - The frontend does not convert MyJourneyDemand into PublicJourneyDemand.
// - The frontend does not recreate aggregate/domain behaviour.
//
// Data flow:
//
//     route param
//         ↓
//     useMyJourneyDemand(publicId)
//         ↓
//     MyJourneyDemand
//         ↓
//     MyJourneyDemandDetail
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { cn } from '@/foundation';

import { useMyJourneyDemand } from '@/features/journey-demand/hooks/queries/use-my-journey-demand';

import { MyJourneyDemandDetail } from '../manage';

// =============================================================================
// Props
// =============================================================================

export interface MyJourneyDemandDetailRouteProps {
  /**
   * Public identifier supplied by the authenticated dynamic route.
   */
  readonly journeyDemandPublicId: string;

  /**
   * Optional owner-management UI supplied by the route/container.
   *
   * The route does not determine which management actions are available.
   */
  readonly management?: ReactNode;

  /**
   * Additional owner-specific detail sections.
   */
  readonly sections?: Parameters<
    typeof MyJourneyDemandDetail
  >[0]['sections'];

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Authenticated Journey Demand detail route/container.
 */
export function MyJourneyDemandDetailRoute({
  journeyDemandPublicId,
  management,
  sections = [],
  className,
}: MyJourneyDemandDetailRouteProps) {
  const {
    demand,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemand(
    journeyDemandPublicId,
  );

  if (isLoading) {
    return (
      <MyJourneyDemandDetailLoading
        className={className}
      />
    );
  }

  if (error) {
    return (
      <MyJourneyDemandDetailError
        error={error}
        onRetry={refetch}
        className={className}
      />
    );
  }

  if (!demand) {
    return (
      <MyJourneyDemandDetailUnavailable
        className={className}
      />
    );
  }

  return (
    <MyJourneyDemandDetail
      demand={demand}
      sections={sections}
      management={management}
      className={className}
    />
  );
}

// =============================================================================
// Loading
// =============================================================================

interface MyJourneyDemandDetailLoadingProps {
  readonly className?: string;
}

/**
 * Loading presentation for the authenticated owner detail.
 *
 * This component contains no data access or business logic.
 */
function MyJourneyDemandDetailLoading({
  className,
}: MyJourneyDemandDetailLoadingProps) {
  return (
    <main
      className={cn(
        'page-container',
        className,
      )}
      aria-busy="true"
      aria-labelledby="my-journey-demand-loading-heading"
    >
      <section className="surface min-w-0 p-4 sm:p-5">
        <h1
          id="my-journey-demand-loading-heading"
          className="sr-only"
        >
          Loading Journey Demand
        </h1>

        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-background-subtle" />

          <div className="h-8 w-72 animate-pulse rounded bg-background-subtle" />

          <div className="h-20 w-full animate-pulse rounded bg-background-subtle" />

          <div className="h-20 w-full animate-pulse rounded bg-background-subtle" />
        </div>
      </section>
    </main>
  );
}

// =============================================================================
// Error
// =============================================================================

interface MyJourneyDemandDetailErrorProps {
  readonly error: Error;
  readonly onRetry: () => Promise<void>;
  readonly className?: string;
}

/**
 * Error presentation for a failed authenticated owner read.
 *
 * Backend/API errors remain errors. They are not converted into an empty
 * Journey Demand or a successful null state.
 */
function MyJourneyDemandDetailError({
  error,
  onRetry,
  className,
}: MyJourneyDemandDetailErrorProps) {
  return (
    <main
      className={cn(
        'page-container',
        className,
      )}
      aria-labelledby="my-journey-demand-error-heading"
    >
      <section className="surface min-w-0 p-4 sm:p-5">
        <div className="min-w-0">
          <h1
            id="my-journey-demand-error-heading"
            className="text-base font-semibold text-foreground"
          >
            Unable to load Journey Demand
          </h1>

          <p className="mt-1 text-sm text-foreground-muted">
            {error.message}
          </p>

          <button
            type="button"
            onClick={() => {
              void onRetry();
            }}
            className={cn(
              'mt-4 inline-flex items-center justify-center',
              'rounded-md border border-border',
              'px-3 py-2',
              'text-sm font-medium text-foreground',
              'transition-colors',
              'hover:bg-background-subtle',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-brand',
              'focus-visible:ring-offset-2',
            )}
          >
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}

// =============================================================================
// Unexpected unavailable state
// =============================================================================

interface MyJourneyDemandDetailUnavailableProps {
  readonly className?: string;
}

/**
 * Defensive presentation for the impossible/defensive state where loading has
 * completed without an error but no owner read model was returned.
 *
 * The API contract should normally either return MyJourneyDemand or throw.
 */
function MyJourneyDemandDetailUnavailable({
  className,
}: MyJourneyDemandDetailUnavailableProps) {
  return (
    <main
      className={cn(
        'page-container',
        className,
      )}
      aria-labelledby="my-journey-demand-unavailable-heading"
    >
      <section className="surface min-w-0 p-4 sm:p-5">
        <h1
          id="my-journey-demand-unavailable-heading"
          className="text-base font-semibold text-foreground"
        >
          Journey Demand unavailable
        </h1>

        <p className="mt-1 text-sm text-foreground-muted">
          This Journey Demand could not be loaded.
        </p>
      </section>
    </main>
  );
}

