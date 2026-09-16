// -----------------------------------------------------------------------------
// sisiMove — Public Traveller Profile Content
// -----------------------------------------------------------------------------
//
// Client-side content boundary for a public Traveller Profile page.
//
// The public Traveller Profile route is handle-based:
//
//   /travellers/:handle
//
// This component connects that route-level identifier to the public Traveller
// Profile feature hook and renders the resulting public read model.
//
// Architecture:
//
//   Public route
//       ↓
//   PublicTravellerContent
//       ↓
//   useTravellerProfile({ handle })
//       ↓
//   Public Traveller Profile API
//       ↓
//   PublicTraveller
//       ↓
//   Public Profile UI
//
// Responsibilities:
//
// - consume the public Traveller Profile by handle;
// - represent loading, error, and not-found states;
// - render the public Traveller Profile identity;
// - render the public biography when available;
// - render the public country;
// - render the resolved public avatar.
//
// This component deliberately does not:
//
// - call the backend directly;
// - know REST response DTOs;
// - construct API URLs;
// - construct Asset URLs;
// - access Traveller Profile domain entities;
// - access Prisma models;
// - resolve private Traveller Profile information;
// - invent journey statistics, trust information, preferences, or corridors.
//
// Trust, Journey, Journey Demand, and other marketplace information are
// intentionally not reconstructed here. Those concerns belong to their
// respective feature boundaries and should be composed explicitly when the
// public Traveller Profile read model is extended.
//
// The backend public read boundary remains authoritative for the information
// available to anonymous visitors.
//
// -----------------------------------------------------------------------------
// Asset boundary
// -----------------------------------------------------------------------------
//
// PublicTravellerContent does not render Next.js Image directly.
//
// Public Asset rendering is delegated to PublicAssetImage:
//
//   PublicTravellerContent
//       ↓
//   PublicAssetImage
//       ↓
//   Next/Image
//
// This keeps Asset URL validation and Asset → image adaptation in one shared
// presentation boundary.
//
// In particular, PublicAssetImage prevents an empty public Asset URL from
// reaching the `src` attribute of Next/Image.
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// Feature
// -----------------------------------------------------------------------------

import { useTravellerProfile } from '@/features/traveller-profile/hooks';

// -----------------------------------------------------------------------------
// Shared public Asset presentation
// -----------------------------------------------------------------------------

import { PublicAssetImage } from '@/components/landing/shared/assets';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PublicTravellerContentProps {
  /**
   * Public Traveller handle from the route.
   *
   * The route layer is responsible for decoding the URL parameter before
   * passing it to this component.
   */
  readonly handle: string;
}

// =============================================================================
// Component
// =============================================================================

export function PublicTravellerContent({
  handle,
}: PublicTravellerContentProps) {
  const {
    data: traveller,
    isLoading,
    isError,
    error,
  } = useTravellerProfile({
    handle,
  });

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="w-full min-w-0">
        <section
          aria-busy="true"
          aria-label="Loading traveller profile"
          className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="animate-pulse space-y-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div
                aria-hidden="true"
                className="h-24 w-24 shrink-0 rounded-full bg-[var(--background-muted)]"
              />

              <div className="min-w-0 space-y-3">
                <div
                  aria-hidden="true"
                  className="h-7 w-48 rounded bg-[var(--background-muted)]"
                />

                <div
                  aria-hidden="true"
                  className="h-4 w-24 rounded bg-[var(--background-muted)]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div
                aria-hidden="true"
                className="h-4 w-20 rounded bg-[var(--background-muted)]"
              />

              <div
                aria-hidden="true"
                className="h-20 w-full rounded-xl bg-[var(--background-muted)]"
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <div className="w-full min-w-0">
        <section
          role="alert"
          className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8"
        >
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            We could not load this traveller profile
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
            {error instanceof Error && error.message
              ? error.message
              : 'Something went wrong while loading this public traveller profile.'}
          </p>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Not Found
  // ---------------------------------------------------------------------------

  if (!traveller) {
    return (
      <div className="w-full min-w-0">
        <section className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            Traveller not found
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
            This traveller profile is not available publicly.
          </p>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Public Profile
  // ---------------------------------------------------------------------------

  return (
    <div className="w-full min-w-0">
      <section
        aria-labelledby="public-traveller-profile-title"
        className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8"
      >
        {/* ----------------------------------------------------------------- */}
        {/* Profile Header                                                    */}
        {/* ----------------------------------------------------------------- */}

        <header className="flex min-w-0 flex-col gap-6 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-center">
          {/* --------------------------------------------------------------- */}
          {/* Avatar                                                          */}
          {/* --------------------------------------------------------------- */}

          <div className="shrink-0">
            {traveller.avatar ? (
              <PublicAssetImage
                asset={traveller.avatar}
                alt={`${traveller.handle}'s profile photo`}
                fallbackAlt={`${traveller.handle}'s profile photo`}
                width={96}
                height={96}
                sizes="96px"
                className="h-24 w-24 rounded-full object-cover"
                priority
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--background-muted)] text-2xl font-semibold text-[var(--foreground-secondary)]"
              >
                {traveller.handle.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Identity                                                        */}
          {/* --------------------------------------------------------------- */}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              Traveller
            </p>

            <h1
              id="public-traveller-profile-title"
              className="mt-1 break-words text-2xl font-semibold tracking-tight text-[var(--foreground)]"
            >
              @{traveller.handle}
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
              {traveller.countryCode}
            </p>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* About                                                             */}
        {/* ----------------------------------------------------------------- */}

        <section
          aria-labelledby="public-traveller-about-title"
          className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <h2
            id="public-traveller-about-title"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            About
          </h2>

          {traveller.bio ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--foreground-muted)]">
              {traveller.bio}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
              This traveller has not added a bio yet.
            </p>
          )}
        </section>
      </section>
    </div>
  );
}

export default PublicTravellerContent;