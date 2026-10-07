'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Logo
// -----------------------------------------------------------------------------
//
// Responsive brand/home control for the authenticated application header.
//
// The sisiMove logo is the authenticated application's Home navigation:
//
//     sisiMove → /home
//
// Presentation-only.
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
        // Layout
        'inline-flex',
        'min-w-0',
        'shrink-0',
        'items-center',

        // Responsive sizing
        'rounded-[clamp(0.4rem,0.8vw,0.55rem)]',
        'px-[clamp(0.15rem,0.35vw,0.25rem)]',
        'py-[clamp(0.1rem,0.2vw,0.15rem)]',

        // Responsive typography
        'text-[clamp(1rem,2.2vw,1.5rem)]',
        'font-bold',
        'leading-none',
        'tracking-tight',

        // Colour
        'text-[var(--foreground)]',

        // Interaction
        'outline-none',
        'transition-colors',
        'duration-150',
        'ease-out',
        'hover:text-[var(--brand)]',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--surface)]',
      )}
    >
      <span className="min-w-0">
        sisi
      </span>

      <span className="shrink-0 text-[var(--brand)]">
        Move
      </span>
    </Link>
  );
}

export default AuthenticatedLogo;