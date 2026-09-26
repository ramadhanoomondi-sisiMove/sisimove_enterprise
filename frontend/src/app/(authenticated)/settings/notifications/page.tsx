'use client';

// -----------------------------------------------------------------------------
// sisiMove — Notification Settings Page
// -----------------------------------------------------------------------------
//
// Authenticated route for the member's notification preferences.
//
// Responsibilities:
// - load the current authenticated Identity;
// - provide the Identity public ID to the notification-preferences feature;
// - compose the notification-preferences presentation.
//
// Non-responsibilities:
// - loading notification preferences;
// - updating notification preferences;
// - maintaining preference state;
// - deciding notification preference rules.
//
// The NotificationPreferences component owns its notification-preference query
// and mutation.
//
// Authentication and Identity remain separate concerns:
//
//     Authentication -> "Is this client authenticated?"
//     Identity       -> "Who is the authenticated Identity?"
// -----------------------------------------------------------------------------

import { NotificationPreferences } from '@/components/notification';

import { useCurrentIdentity } from '@/features/identity/hooks';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function NotificationSettingsPage() {
  const {
    data: identity,
    isLoading,
    isError,
  } = useCurrentIdentity();

  // ---------------------------------------------------------------------------
  // Identity Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="page-container py-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <header className="mb-5">
            <div className="h-7 w-48 animate-pulse rounded bg-[var(--background-subtle)]" />

            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-[var(--background-subtle)]" />
          </header>

          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'p-6',
            ].join(' ')}
          >
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-[var(--background-subtle)]" />
                    <div className="h-3 w-56 animate-pulse rounded bg-[var(--background-subtle)]" />
                  </div>

                  <div className="h-6 w-11 shrink-0 animate-pulse rounded-full bg-[var(--background-subtle)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Identity Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <main className="page-container py-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'p-6',
              'text-center',
            ].join(' ')}
          >
            <h1 className="text-base font-semibold text-[var(--foreground)]">
              Unable to load notification settings
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              We could not load your account information.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Identity Unavailable
  // ---------------------------------------------------------------------------

  if (!identity) {
    return (
      <main className="page-container py-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'p-6',
              'text-center',
            ].join(' ')}
          >
            <h1 className="text-base font-semibold text-[var(--foreground)]">
              Account information unavailable
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              We could not determine the current account identity.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Notification Preferences
  // ---------------------------------------------------------------------------

  return (
    <main className="page-container py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Notification settings
          </h1>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            Choose which types of activity can send notifications to you.
          </p>
        </header>

        <NotificationPreferences
          memberPublicId={identity.publicId}
        />
      </div>
    </main>
  );
}

