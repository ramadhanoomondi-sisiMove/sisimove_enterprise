// -----------------------------------------------------------------------------
// sisiMove — Authenticated Navigation
// -----------------------------------------------------------------------------
//
// Primary navigation for authenticated application surfaces.
//
// Current navigation:
//
//     🧳 My Journeys
//         → /my-journeys
//
//     📋 My Demands
//         → /my-demands
//
//     📁 Assets
//         → /assets
//
// The sisiMove logo → /home is intentionally handled by
// AuthenticatedLogo. Therefore, Home is not rendered here.
//
// Account and notification controls are also intentionally separate:
//
//     AuthenticatedAccountMenu
//     AuthenticatedNotifications
//
// Responsibilities:
// - Render primary authenticated application navigation.
// - Provide canonical links to authenticated application surfaces.
// - Highlight the currently active authenticated surface.
// - Provide entry points into the user's owned Journey and Demand surfaces.
// - Provide entry point into the user's Asset-management surface.
//
// Non-responsibilities:
// - No authentication-state management.
// - No session management.
// - No authorization.
// - No verification logic.
// - No marketplace capability logic.
// - No Journey data fetching.
// - No Journey Demand data fetching.
// - No Asset data fetching.
// - No account-menu behavior.
// - No notification behavior.
//
// Navigation is intentionally static. Whether a user is authorized to
// perform an action on a destination surface is resolved by that surface
// and the corresponding backend authorization boundary.
//
// Active-state ownership:
//
//     usePathname()
//          ↓
//     AuthenticatedNavigation
//          ↓
//     active navigation item
//
// The active state is presentation-only. It does not determine authorization
// or access to the destination.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/foundation';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedNavigation() {
  const pathname = usePathname();

  const isMyJourneysActive =
    pathname === AUTHENTICATED_ROUTES.MY_JOURNEYS ||
    pathname.startsWith(`${AUTHENTICATED_ROUTES.MY_JOURNEYS}/`);

  const isMyDemandsActive =
    pathname === AUTHENTICATED_ROUTES.MY_DEMANDS ||
    pathname.startsWith(`${AUTHENTICATED_ROUTES.MY_DEMANDS}/`);

  const isAssetsActive =
    pathname === AUTHENTICATED_ROUTES.ASSETS ||
    pathname.startsWith(`${AUTHENTICATED_ROUTES.ASSETS}/`);

  return (
    <nav
      aria-label="Authenticated navigation"
      className="flex items-center"
    >
      {/* ------------------------------------------------------------------- */}
      {/* My Journeys                                                        */}
      {/* ------------------------------------------------------------------- */}

      <Link
        href={AUTHENTICATED_ROUTES.MY_JOURNEYS}
        aria-current={isMyJourneysActive ? 'page' : undefined}
        className={cn(
          'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 ease-out',
          isMyJourneysActive
            ? 'bg-[var(--brand)]/10 text-[var(--brand)]'
            : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
        )}
      >
        <span aria-hidden="true">🧳</span>

        <span>My Journeys</span>
      </Link>

      {/* ------------------------------------------------------------------- */}
      {/* My Demands                                                         */}
      {/* ------------------------------------------------------------------- */}

      <Link
        href={AUTHENTICATED_ROUTES.MY_DEMANDS}
        aria-current={isMyDemandsActive ? 'page' : undefined}
        className={cn(
          'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 ease-out',
          isMyDemandsActive
            ? 'bg-[var(--brand)]/10 text-[var(--brand)]'
            : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
        )}
      >
        <span aria-hidden="true">📋</span>

        <span>My Demands</span>
      </Link>

      {/* ------------------------------------------------------------------- */}
      {/* Assets                                                              */}
      {/* ------------------------------------------------------------------- */}

      <Link
        href={AUTHENTICATED_ROUTES.ASSETS}
        aria-current={isAssetsActive ? 'page' : undefined}
        className={cn(
          'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 ease-out',
          isAssetsActive
            ? 'bg-[var(--brand)]/10 text-[var(--brand)]'
            : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
        )}
      >
        <span aria-hidden="true">📁</span>

        <span>Assets</span>
      </Link>
    </nav>
  );
}

export default AuthenticatedNavigation;