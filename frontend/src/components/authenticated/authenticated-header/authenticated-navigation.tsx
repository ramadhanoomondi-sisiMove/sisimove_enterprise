'use client';

// -----------------------------------------------------------------------------
// Path: src/components/navigation/authenticated-navigation.tsx
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Navigation
// -----------------------------------------------------------------------------
//
// Primary navigation for authenticated SisiMove application surfaces.
//
// Verification progression:
//
//     NONE
//       │
//       └── GET VERIFIED
//             │
//             ├── Profile Photo
//             ├── Government ID
//             │
//             └── Enables BOOKING
//
//     MEMBER
//       │
//       ├── VERIFIED TO BOOK
//       │
//       └── Valid Driving Licence
//             │
//             └── Required to become DRIVER and PUBLISH JOURNEYS
//
//     DRIVER
//       │
//       ├── MY JOURNEYS
//       └── MY BOOKINGS
//
// The navigation makes the distinction between traveller/member verification
// and driver verification immediately visible.
//
// Backend authorization remains authoritative. Navigation visibility is only
// presentation guidance.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { VerificationLevel } from '@/features/verification/models/verification';

import { cn } from '@/foundation';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedNavigationProps {
  /**
   * Already-resolved verification level for the authenticated Identity.
   *
   * The value is supplied by the authenticated application boundary.
   *
   * This component only uses the value to determine which navigation and
   * verification guidance should be presented.
   */
  readonly verificationLevel: VerificationLevel;
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedNavigation({
  verificationLevel,
}: AuthenticatedNavigationProps) {
  const pathname = usePathname();

  // ---------------------------------------------------------------------------
  // Active verification route
  // ---------------------------------------------------------------------------

  const isVerificationActive =
    pathname === AUTHENTICATED_ROUTES.VERIFICATION ||
    pathname.startsWith(`${AUTHENTICATED_ROUTES.VERIFICATION}/`);

  // ---------------------------------------------------------------------------
  // NONE — Verification required before booking
  // ---------------------------------------------------------------------------

  if (verificationLevel === 'NONE') {
    return (
      <nav
        aria-label="Authenticated navigation"
        className="flex min-w-0 max-w-full items-center"
      >
        <Link
          href={AUTHENTICATED_ROUTES.VERIFICATION}
          aria-current={isVerificationActive ? 'page' : undefined}
          aria-label="Get verified. Profile Photo and Government ID are required to book. A valid Driving Licence is additionally required to publish a journey."
          className={cn(
            'group inline-flex min-w-0 max-w-full items-center',
            'gap-[clamp(0.375rem,0.8vw,0.5rem)]',
            'rounded-[var(--radius-lg)] border',
            'px-[clamp(0.5rem,1.2vw,0.75rem)]',
            'py-[clamp(0.375rem,0.8vw,0.5rem)]',
            'outline-none transition-all duration-150 ease-out',
            isVerificationActive
              ? 'border-[var(--brand)] bg-[var(--brand-soft)] shadow-[var(--shadow-sm)]'
              : 'border-[var(--warning)]/50 bg-[var(--warning-soft)] shadow-[var(--shadow-sm)] hover:border-[var(--warning)] hover:shadow-[var(--shadow-md)]',
            'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
          )}
        >
          {/* Status icon */}

          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 items-center justify-center rounded-full font-bold',
              'h-[clamp(1.625rem,3.2vw,2rem)]',
              'w-[clamp(1.625rem,3.2vw,2rem)]',
              'text-[clamp(0.625rem,1.2vw,0.875rem)]',
              isVerificationActive
                ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
                : 'bg-[var(--warning)] text-[var(--brand-foreground)]',
            )}
          >
            ✓
          </span>

          {/* Verification message */}

          <span className="flex min-w-0 flex-col text-left leading-tight">
            <span
              className={cn(
                'flex min-w-0 items-center',
                'gap-[clamp(0.25rem,0.6vw,0.5rem)]',
              )}
            >
              <span
                className={cn(
                  'truncate font-bold',
                  'text-[clamp(0.6875rem,1.35vw,0.875rem)]',
                  isVerificationActive
                    ? 'text-[var(--brand)]'
                    : 'text-[var(--foreground)]',
                )}
              >
                Get Verified
              </span>

              <span className="shrink-0 rounded-full bg-[var(--warning-soft)] px-[clamp(0.3rem,0.6vw,0.5rem)] py-0.5 text-[clamp(0.4375rem,0.75vw,0.625rem)] font-bold uppercase tracking-wide text-[var(--warning)] ring-1 ring-[var(--warning)]/30">
                Recommended
              </span>
            </span>

            <span className="mt-0.5 truncate text-[clamp(0.5625rem,1vw,0.75rem)] font-semibold text-[var(--foreground-secondary)]">
              Required to book
            </span>

            <span className="mt-0.5 truncate text-[clamp(0.5rem,0.85vw,0.6875rem)] text-[var(--foreground-muted)]">
              Profile Photo + Government ID
            </span>

            <span className="mt-0.5 truncate text-[clamp(0.5rem,0.85vw,0.6875rem)] font-medium text-[var(--foreground-muted)]">
              Add a valid Driving Licence to publish journeys
            </span>
          </span>
        </Link>
      </nav>
    );
  }

  // ---------------------------------------------------------------------------
  // MEMBER — Verified to book
  // ---------------------------------------------------------------------------

  if (verificationLevel === 'MEMBER') {
    const isMyBookingsActive =
      pathname === AUTHENTICATED_ROUTES.MY_BOOKINGS ||
      pathname.startsWith(`${AUTHENTICATED_ROUTES.MY_BOOKINGS}/`);

    return (
      <nav
        aria-label="Authenticated navigation"
        className={cn(
          'flex min-w-0 max-w-full items-center',
          'gap-[clamp(0.25rem,0.7vw,0.5rem)]',
        )}
      >
        {/* Verified to Book status */}

        <Link
          href={AUTHENTICATED_ROUTES.VERIFICATION}
          aria-current={isVerificationActive ? 'page' : undefined}
          aria-label="You are verified to book. A valid Driving Licence is required to become a driver and publish journeys."
          className={cn(
            'group inline-flex min-w-0 max-w-full items-center',
            'gap-[clamp(0.375rem,0.8vw,0.5rem)]',
            'rounded-[var(--radius-lg)] border',
            'border-[var(--success)]/30 bg-[var(--success-soft)]',
            'px-[clamp(0.5rem,1.2vw,0.75rem)]',
            'py-[clamp(0.375rem,0.8vw,0.5rem)]',
            'outline-none transition-all duration-150 ease-out',
            'hover:border-[var(--success)]/50 hover:shadow-[var(--shadow-sm)]',
            'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
          )}
        >
          <span
            aria-hidden="true"
            className="flex shrink-0 items-center justify-center rounded-full bg-[var(--success)] font-bold text-white h-[clamp(1.625rem,3.2vw,2rem)] w-[clamp(1.625rem,3.2vw,2rem)] text-[clamp(0.625rem,1.2vw,0.875rem)]"
          >
            ✓
          </span>

          <span className="flex min-w-0 flex-col text-left leading-tight">
            <span className="truncate font-bold text-[clamp(0.6875rem,1.35vw,0.875rem)] text-[var(--success)]">
              Verified to Book
            </span>

            <span className="mt-0.5 truncate text-[clamp(0.5rem,0.85vw,0.6875rem)] font-medium text-[var(--foreground-secondary)]">
              Profile Photo + Government ID verified
            </span>

            <span className="mt-0.5 truncate text-[clamp(0.5rem,0.85vw,0.6875rem)] text-[var(--foreground-muted)]">
              Want to drive? A valid Driving Licence is required
            </span>
          </span>
        </Link>

        {/* My Bookings */}

        <Link
          href={AUTHENTICATED_ROUTES.MY_BOOKINGS}
          aria-current={isMyBookingsActive ? 'page' : undefined}
          className={cn(
            'inline-flex shrink-0 items-center',
            'gap-[clamp(0.25rem,0.6vw,0.5rem)]',
            'rounded-[var(--radius-md)]',
            'px-[clamp(0.5rem,1vw,0.75rem)]',
            'py-[clamp(0.375rem,0.8vw,0.5rem)]',
            'font-medium outline-none transition-colors duration-150 ease-out',
            'text-[clamp(0.625rem,1vw,0.875rem)]',
            isMyBookingsActive
              ? 'bg-[var(--brand)]/10 text-[var(--brand)]'
              : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]',
            'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
          )}
        >
          <span
            aria-hidden="true"
            className="text-[clamp(0.75rem,1.3vw,1rem)]"
          >
            🎫
          </span>
          <span className="truncate">My Bookings</span>
        </Link>
      </nav>
    );
  }

  // ---------------------------------------------------------------------------
  // DRIVER — Verified to publish
  // ---------------------------------------------------------------------------

  const isMyJourneysActive =
    pathname === AUTHENTICATED_ROUTES.MY_JOURNEYS ||
    pathname.startsWith(`${AUTHENTICATED_ROUTES.MY_JOURNEYS}/`);

  const isMyBookingsActive =
    pathname === AUTHENTICATED_ROUTES.MY_BOOKINGS ||
    pathname.startsWith(`${AUTHENTICATED_ROUTES.MY_BOOKINGS}/`);

  return (
    <nav
      aria-label="Authenticated navigation"
      className={cn(
        'flex min-w-0 max-w-full items-center',
        'gap-[clamp(0.125rem,0.5vw,0.25rem)]',
      )}
    >
      {/* Driver verification status */}

      <span
        aria-label="Driver verified. You can publish journeys."
        className={cn(
          'inline-flex shrink-0 items-center',
          'gap-[clamp(0.375rem,0.7vw,0.5rem)]',
          'rounded-[var(--radius-md)] border',
          'border-[var(--success)]/30 bg-[var(--success-soft)]',
          'px-[clamp(0.5rem,1vw,0.75rem)]',
          'py-[clamp(0.375rem,0.7vw,0.5rem)]',
        )}
      >
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center rounded-full bg-[var(--success)] font-bold text-white h-[clamp(1.25rem,2.5vw,1.5rem)] w-[clamp(1.25rem,2.5vw,1.5rem)] text-[clamp(0.5rem,0.8vw,0.75rem)]"
        >
          ✓
        </span>

        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-bold text-[clamp(0.5625rem,1vw,0.75rem)] text-[var(--success)]">
            Driver Verified
          </span>

          <span className="truncate text-[clamp(0.4375rem,0.75vw,0.625rem)] text-[var(--foreground-muted)]">
            Verified to publish
          </span>
        </span>
      </span>

      {/* My Journeys */}

      <Link
        href={AUTHENTICATED_ROUTES.MY_JOURNEYS}
        aria-current={isMyJourneysActive ? 'page' : undefined}
        className={cn(
          'inline-flex shrink-0 items-center',
          'gap-[clamp(0.25rem,0.6vw,0.5rem)]',
          'rounded-[var(--radius-md)]',
          'px-[clamp(0.5rem,1vw,0.75rem)]',
          'py-[clamp(0.375rem,0.8vw,0.5rem)]',
          'font-medium outline-none transition-colors duration-150 ease-out',
          'text-[clamp(0.625rem,1vw,0.875rem)]',
          isMyJourneysActive
            ? 'bg-[var(--brand)]/10 text-[var(--brand)]'
            : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
        )}
      >
        <span
          aria-hidden="true"
          className="text-[clamp(0.75rem,1.3vw,1rem)]"
        >
          🧳
        </span>
        <span className="truncate">My Journeys</span>
      </Link>

      {/* My Bookings */}

      <Link
        href={AUTHENTICATED_ROUTES.MY_BOOKINGS}
        aria-current={isMyBookingsActive ? 'page' : undefined}
        className={cn(
          'inline-flex shrink-0 items-center',
          'gap-[clamp(0.25rem,0.6vw,0.5rem)]',
          'rounded-[var(--radius-md)]',
          'px-[clamp(0.5rem,1vw,0.75rem)]',
          'py-[clamp(0.375rem,0.8vw,0.5rem)]',
          'font-medium outline-none transition-colors duration-150 ease-out',
          'text-[clamp(0.625rem,1vw,0.875rem)]',
          isMyBookingsActive
            ? 'bg-[var(--brand)]/10 text-[var(--brand)]'
            : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
        )}
      >
        <span
          aria-hidden="true"
          className="text-[clamp(0.75rem,1.3vw,1rem)]"
        >
          🎫
        </span>
        <span className="truncate">My Bookings</span>
      </Link>
    </nav>
  );
}
