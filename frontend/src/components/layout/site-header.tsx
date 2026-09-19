// -----------------------------------------------------------------------------
// sisiMove — Site Header
// -----------------------------------------------------------------------------
//
// Public site header.
//
// Responsibilities:
// - Render the sisiMove brand.
// - Compose desktop and mobile navigation.
// - Provide public authentication entry points.
// - Provide the public "Share travel plan" entry point.
// - Route protected public actions to the authentication boundary.
// - Remain independent of authentication implementation details.
//
// Architectural boundary:
//
// - SiteHeader is a public-shell composition component.
// - It does not access authentication state.
// - It does not perform authentication.
// - It does not call APIs.
// - It does not contain marketplace/domain logic.
// - It does not determine whether a user is authenticated.
// - It does not determine whether a user is verified.
//
// Public action rule:
//
//     Share travel plan → /login
//
// The public header does not attempt to determine whether the visitor can
// create or publish a journey. The login route is the entry boundary for
// this protected action.
//
// After authentication, the authenticated application is responsible for
// determining the user's verification/capability requirements.
//
// Import boundary:
//
// - Sibling layout components are imported directly.
// - Shared account-action primitives are imported from their shared boundary.
// - This component must not import from './index'.
// - The layout barrel is intended for consumers outside this module.
//
// Account actions:
//
// - SignIn owns the presentation of the sign-in action.
// - JoinSisiMove owns the presentation of the registration action.
// - SiteHeader composes those actions.
// - "Share travel plan" is a public-shell navigation action and therefore
//   remains a plain Link to the authentication boundary.
//
// Authentication state, session handling, authorization, verification,
// and registration behavior remain outside this component.
//
// -----------------------------------------------------------------------------


'use client';

import Link from 'next/link';

import { cn } from '@/foundation';
import { AUTHENTICATION_ROUTES, PUBLIC_ROUTES } from '@/foundation/routing';

import { Container } from '../ui';

import {
  JoinSisiMove,
  SignIn,
} from '../landing/shared/account-actions';

import { DesktopNavigation } from './desktop-navigation';
import { MobileNavigation } from './mobile-navigation';


// =============================================================================
// Site Header
// =============================================================================

export function SiteHeader() {
  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'w-full min-w-0',
        'border-b border-[var(--border)]',
        'bg-[var(--surface)]/95',
        'backdrop-blur',
      )}
    >
      <Container
        size="xl"
        className={cn(
          'flex min-w-0',
          'min-h-14',
          'items-center',
          'justify-between',
          'gap-3',
          'sm:min-h-16 sm:gap-4',
        )}
      >
        {/* ===================================================================
            Brand
        =================================================================== */}

        <Link
          href={PUBLIC_ROUTES.HOME}
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

        {/* ===================================================================
            Desktop Navigation
        =================================================================== */}

        <div
          className={cn(
            'hidden min-w-0 flex-1',
            'justify-center',
            'md:flex',
          )}
        >
          <DesktopNavigation />
        </div>

        {/* ===================================================================
            Desktop Public Actions
        =================================================================== */}

        <div
          className={cn(
            'hidden shrink-0',
            'items-center gap-1.5',
            'md:flex',
          )}
        >
          {/* ---------------------------------------------------------------
              Share Travel Plan

              Public visitors may see this action, but creating/publishing
              travel plans is protected.

              The header therefore sends the visitor directly to the login
              boundary. Authentication and verification are handled after
              entering the authenticated flow.

              This is intentionally a plain Link:
              - no authentication state
              - no API call
              - no authorization logic
              - no marketplace/domain logic
          ---------------------------------------------------------------- */}

          <Link
            href={AUTHENTICATION_ROUTES.LOGIN}
            className={cn(
              'inline-flex items-center justify-center',
              'min-h-9',
              'rounded-[var(--radius-md)]',
              'px-3',
              'text-sm font-medium',
              'text-[var(--foreground)]',
              'outline-none',
              'transition-colors duration-150 ease-out',
              'hover:bg-[var(--muted)]',
              'hover:text-[var(--brand)]',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
              'focus-visible:ring-offset-[var(--surface)]',
            )}
          >
            Share travel plan
          </Link>

          <SignIn compact />

          <JoinSisiMove compact />
        </div>

        {/* ===================================================================
            Mobile Navigation
        =================================================================== */}

        <div
          className={cn(
            'flex min-w-0 shrink-0',
            'items-center gap-1.5',
            'md:hidden',
          )}
        >
          <MobileNavigation />

          <SignIn compact />
        </div>
      </Container>
    </header>
  );
}

export default SiteHeader;
