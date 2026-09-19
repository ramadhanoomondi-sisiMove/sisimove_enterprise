// -----------------------------------------------------------------------------
// sisiMove — Authenticated Logo
// -----------------------------------------------------------------------------
//
// Brand/home control for the authenticated application header.
//
// The sisiMove logo is the authenticated application's Home navigation:
//
//     sisiMove → /home
//
// Responsibilities:
// - Render the sisiMove wordmark.
// - Link the authenticated application logo to authenticated Home.
// - Provide accessible naming for the home destination.
//
// Non-responsibilities:
// - No authentication-state management.
// - No session management.
// - No authorization.
// - No marketplace logic.
// - No traveller-profile logic.
// - No navigation state.
// - No data fetching.
//
// Route ownership:
//
//     AUTHENTICATED_ROUTES.HOME
//         ↓
//     /home
//
// Branding:
//
// The authenticated logo mirrors the public SiteHeader wordmark:
//
//     sisi + Move
//
// - "sisi" uses the application foreground colour.
// - "Move" uses the sisiMove brand colour.
//
// The authenticated shell therefore uses the same brand expression as the
// public shell while retaining its authenticated Home route.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { cn } from '@/foundation';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';


// =============================================================================
// Authenticated Logo
// =============================================================================

export function AuthenticatedLogo() {
  return (
    <Link
      href={AUTHENTICATED_ROUTES.HOME}
      aria-label="sisiMove home"
      className={cn(
        'shrink-0',
        'rounded-[var(--radius-md)]',
        'text-xl font-bold tracking-tight',
        'text-[var(--foreground)]',
        'outline-none',
        'transition-colors duration-150 ease-out',
        'hover:text-[var(--brand)]',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--surface)]',
        'sm:text-2xl',
      )}
    >
      sisi
      <span className="text-[var(--brand)]">Move</span>
    </Link>
  );
}


export default AuthenticatedLogo;