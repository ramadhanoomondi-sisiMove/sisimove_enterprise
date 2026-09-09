// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Page
// -----------------------------------------------------------------------------
//
// Public page container for a Traveller Profile.
//
// Responsibilities:
// - Receive the public traveller handle.
// - Load the public Traveller Profile.
// - Load the public Trust profile independently.
// - Manage profile loading and error states.
// - Manage non-blocking Trust loading and error states.
// - Compose Traveller Profile and Trust presentation.
//
// Non-responsibilities:
// - No API transport implementation.
// - No response mapping.
// - No business rules.
// - No authentication logic.
// - No authorization logic.
// - No direct persistence access.
// - No Trust calculation or decision logic.
//
// Architectural boundary:
//
// Traveller Profile
//      ↓
// useTravellerProfile()
//      ↓
// TravellerProfile
//      ↓
// TravellerProfileContent
//
// Trust
//      ↓
// useTrustProfile()
//      ↓
// TrustProfile
//      ↓
// TravellerProfileTrust
//
// This page is only the composition boundary.
//
// Trust remains independent from Traveller Profile. A Trust failure must
// never make an otherwise available public Traveller Profile unavailable.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useEffect,
} from 'react';

// -----------------------------------------------------------------------------
// Features
// -----------------------------------------------------------------------------

import {
  useTravellerProfile,
} from '@/features/traveller-profile';

import {
  useTrustProfile,
} from '@/features/trust';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Container } from '@/components/ui';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import {
  TravellerProfileTrust,
} from '@/components/landing/trust';

import {
  TravellerProfileContent,
} from './traveller-profile-content';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerProfilePageProps {
  /**
   * Public social handle of the traveller.
   */
  handle: string;
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function TravellerProfileLoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading traveller profile"
      className="py-12 sm:py-16"
    >
      <Container size="lg">
        <div className="animate-pulse space-y-6">
          {/* --------------------------------------------------------------- */}
          {/* Profile Header Skeleton                                         */}
          {/* --------------------------------------------------------------- */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div
                aria-hidden="true"
                className="h-24 w-24 shrink-0 rounded-full bg-neutral-200"
              />

              <div className="flex-1 space-y-3">
                <div
                  aria-hidden="true"
                  className="h-8 w-52 rounded bg-neutral-200"
                />

                <div
                  aria-hidden="true"
                  className="h-4 w-32 rounded bg-neutral-200"
                />

                <div
                  aria-hidden="true"
                  className="h-4 w-full max-w-2xl rounded bg-neutral-200"
                />

                <div
                  aria-hidden="true"
                  className="h-4 w-5/6 max-w-xl rounded bg-neutral-200"
                />
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Corridor Skeleton                                               */}
          {/* --------------------------------------------------------------- */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="h-5 w-36 rounded bg-neutral-200"
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div
                aria-hidden="true"
                className="h-16 rounded-xl bg-neutral-200"
              />

              <div
                aria-hidden="true"
                className="h-16 rounded-xl bg-neutral-200"
              />
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Preferences Skeleton                                            */}
          {/* --------------------------------------------------------------- */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="h-5 w-40 rounded bg-neutral-200"
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div
                aria-hidden="true"
                className="h-16 rounded-xl bg-neutral-200"
              />

              <div
                aria-hidden="true"
                className="h-16 rounded-xl bg-neutral-200"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Profile Error State
// -----------------------------------------------------------------------------

interface TravellerProfileErrorStateProps {
  onRetry: () => void;
}

function TravellerProfileErrorState({
  onRetry,
}: TravellerProfileErrorStateProps) {
  return (
    <section
      aria-labelledby="traveller-profile-error-title"
      className="py-12 sm:py-16"
    >
      <Container size="lg">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6"
        >
          <h1
            id="traveller-profile-error-title"
            className="text-lg font-semibold text-red-900"
          >
            We couldn&apos;t load this traveller profile.
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-800">
            Something went wrong while loading the public profile.
            Please try again.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </Container>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Empty State
// -----------------------------------------------------------------------------

function TravellerProfileEmptyState() {
  return (
    <section
      aria-labelledby="traveller-profile-empty-title"
      className="py-12 sm:py-16"
    >
      <Container size="lg">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h1
            id="traveller-profile-empty-title"
            className="text-xl font-semibold text-neutral-950"
          >
            Traveller profile not found
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
            This traveller profile may no longer be public or the
            handle may not exist.
          </p>
        </div>
      </Container>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Trust Loading State
// -----------------------------------------------------------------------------

function TravellerProfileTrustLoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading traveller trust information"
      className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
    >
      <div className="animate-pulse">
        <div
          aria-hidden="true"
          className="h-6 w-20 rounded bg-neutral-200"
        />

        <div
          aria-hidden="true"
          className="mt-2 h-4 w-72 max-w-full rounded bg-neutral-200"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            aria-hidden="true"
            className="h-24 rounded-xl bg-neutral-200"
          />

          <div
            aria-hidden="true"
            className="h-24 rounded-xl bg-neutral-200"
          />

          <div
            aria-hidden="true"
            className="h-24 rounded-xl bg-neutral-200"
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Trust Error State
// -----------------------------------------------------------------------------

interface TravellerProfileTrustErrorStateProps {
  onRetry: () => void;
}

function TravellerProfileTrustErrorState({
  onRetry,
}: TravellerProfileTrustErrorStateProps) {
  return (
    <section
      aria-labelledby="traveller-profile-trust-error-title"
      className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8"
    >
      <h2
        id="traveller-profile-trust-error-title"
        className="text-lg font-semibold text-neutral-950"
      >
        Trust information is temporarily unavailable
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        We couldn&apos;t load the latest Trust information for this
        traveller.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
      >
        Try again
      </button>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Trust Refreshing Indicator
// -----------------------------------------------------------------------------

function TravellerProfileTrustRefreshingState() {
  return (
    <p
      role="status"
      aria-live="polite"
      className="text-center text-xs text-neutral-500"
    >
      Updating Trust information…
    </p>
  );
}

// -----------------------------------------------------------------------------
// Profile Refresh Error
// -----------------------------------------------------------------------------

interface TravellerProfileRefreshErrorProps {
  onRetry: () => void;
}

function TravellerProfileRefreshError({
  onRetry,
}: TravellerProfileRefreshErrorProps) {
  return (
    <Container size="lg">
      <div
        role="status"
        aria-live="polite"
        className="pb-6"
      >
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-700">
            We couldn&apos;t refresh the latest profile information.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 text-sm font-medium text-neutral-900 underline underline-offset-2 transition hover:no-underline focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    </Container>
  );
}

// -----------------------------------------------------------------------------
// Profile Refreshing Indicator
// -----------------------------------------------------------------------------

function TravellerProfileRefreshingState() {
  return (
    <Container size="lg">
      <p
        role="status"
        aria-live="polite"
        className="pb-6 text-center text-xs text-neutral-500"
      >
        Updating profile information…
      </p>
    </Container>
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export function TravellerProfilePage({
  handle,
}: TravellerProfilePageProps) {
  const normalizedHandle = handle.trim();

  // ---------------------------------------------------------------------------
  // Traveller Profile
  // ---------------------------------------------------------------------------

  const {
    data,
    isLoading,
    isRefreshing,
    error,
    load,
    refresh,
  } = useTravellerProfile(
    normalizedHandle,
  );

  // ---------------------------------------------------------------------------
  // Trust
  // ---------------------------------------------------------------------------

  const {
    data: trustProfile,
    loading: trustLoading,
    refreshing: trustRefreshing,
    error: trustError,
    load: loadTrust,
    refresh: refreshTrust,
  } = useTrustProfile(
    normalizedHandle,
  );

  // ---------------------------------------------------------------------------
  // Load Traveller Profile
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!normalizedHandle) {
      return;
    }

    void load(normalizedHandle);
  }, [
    normalizedHandle,
    load,
  ]);

  // ---------------------------------------------------------------------------
  // Load Trust Profile
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!normalizedHandle) {
      return;
    }

    void loadTrust(normalizedHandle);
  }, [
    normalizedHandle,
    loadTrust,
  ]);

  // ---------------------------------------------------------------------------
  // Invalid Handle
  // ---------------------------------------------------------------------------

  if (!normalizedHandle) {
    return (
      <TravellerProfileEmptyState />
    );
  }

  // ---------------------------------------------------------------------------
  // Initial Profile Loading
  // ---------------------------------------------------------------------------

  if (
    isLoading &&
    !data
  ) {
    return (
      <TravellerProfileLoadingState />
    );
  }

  // ---------------------------------------------------------------------------
  // Initial Profile Error
  // ---------------------------------------------------------------------------

  if (
    error &&
    !data
  ) {
    return (
      <TravellerProfileErrorState
        onRetry={() => {
          void load(normalizedHandle);
        }}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Profile Unavailable
  // ---------------------------------------------------------------------------

  if (!data) {
    return (
      <TravellerProfileEmptyState />
    );
  }

  // ---------------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------------

  return (
    <div>
      <section className="py-10 sm:py-14">
        <Container size="lg">
          <div className="space-y-6">
            {/* ---------------------------------------------------------------- */}
            {/* Traveller Profile                                                */}
            {/* ---------------------------------------------------------------- */}

            <TravellerProfileContent
              profile={data}
            />

            {/* ---------------------------------------------------------------- */}
            {/* Trust                                                            */}
            {/* ---------------------------------------------------------------- */}

            {trustLoading && !trustProfile ? (
              <TravellerProfileTrustLoadingState />
            ) : null}

            {trustError && !trustProfile ? (
              <TravellerProfileTrustErrorState
                onRetry={() => {
                  void loadTrust(normalizedHandle);
                }}
              />
            ) : null}

            {trustProfile ? (
              <section
                aria-busy={trustRefreshing}
                aria-label="Traveller trust"
              >
                <TravellerProfileTrust
                  profile={trustProfile}
                />

                {trustRefreshing ? (
                  <div className="mt-3">
                    <TravellerProfileTrustRefreshingState />
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Profile Refresh Error                                                 */}
      {/* --------------------------------------------------------------------- */}

      {error ? (
        <TravellerProfileRefreshError
          onRetry={() => {
            void refresh();
          }}
        />
      ) : null}

      {/* --------------------------------------------------------------------- */}
      {/* Profile Refreshing                                                    */}
      {/* --------------------------------------------------------------------- */}

      {isRefreshing ? (
        <TravellerProfileRefreshingState />
      ) : null}
    </div>
  );
}