// -----------------------------------------------------------------------------
// sisiMove — Sign In
// -----------------------------------------------------------------------------
//
// Reusable public account-action component for existing sisiMove members.
//
// This component is presentation-only.
//
// It does NOT:
// - authenticate the user;
// - access session state;
// - call an API;
// - perform login;
// - determine whether the visitor is already authenticated.
//
// The authentication boundary owns the actual sign-in flow.
//
// -----------------------------------------------------------------------------
// NAVIGATION
// -----------------------------------------------------------------------------
//
// The component receives an href rather than owning authentication behavior.
//
// This keeps it reusable across:
// - public navigation;
// - landing-page actions;
// - marketplace surfaces;
// - account prompts;
// - other public presentation contexts.
//
// -----------------------------------------------------------------------------
// VISUAL ROLE
// -----------------------------------------------------------------------------
//
// Sign in is a secondary account action.
//
// It intentionally uses a transparent/neutral treatment while Join sisiMove
// uses the primary brand treatment:
//
//     [ Sign in ]   [ Join sisiMove ]
//
// This establishes a clear visual hierarchy without making authentication
// behavior part of this component.
//
// -----------------------------------------------------------------------------
// COMPACT MODE
// -----------------------------------------------------------------------------
//
// `compact` changes presentation density only.
//
// It does not change:
// - destination;
// - authentication behavior;
// - authorization;
// - application state.
// -----------------------------------------------------------------------------

import Link from 'next/link';


// =============================================================================
// Props
// =============================================================================

export interface SignInProps {
  /**
   * Sign-in destination.
   *
   * Defaults to the public login route.
   */
  readonly href?: string;

  /**
   * Optional additional class name.
   */
  readonly className?: string;

  /**
   * Compact presentation intended for smaller surfaces such as navigation
   * and header actions.
   *
   * This affects sizing only.
   */
  readonly compact?: boolean;
}


// =============================================================================
// Component
// =============================================================================

export function SignIn({
  href = '/login',
  className,
  compact = false,
}: SignInProps) {
  return (
    <Link
      href={href}
      className={[
        // ---------------------------------------------------------------------
        // Base
        // ---------------------------------------------------------------------

        'inline-flex',
        'items-center',
        'justify-center',
        'gap-2',
        'font-medium',
        'whitespace-nowrap',
        'select-none',
        'rounded-lg',

        // ---------------------------------------------------------------------
        // Secondary action
        // ---------------------------------------------------------------------

        'border border-transparent',
        'bg-transparent',
        'text-[var(--foreground-secondary)]',
        'transition-colors',
        'duration-150',
        'ease-out',

        'hover:bg-[var(--background-subtle)]',
        'hover:text-[var(--foreground)]',
        'active:bg-[var(--background-muted)]',

        // ---------------------------------------------------------------------
        // Keyboard focus
        // ---------------------------------------------------------------------

        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--background)]',

        // ---------------------------------------------------------------------
        // Density
        // ---------------------------------------------------------------------

        compact
          ? [
              'min-h-9',
              'px-3.5',
              'py-1.5',
              'text-sm',
            ].join(' ')
          : [
              'min-h-10',
              'px-4',
              'py-2',
              'text-sm',
              'sm:min-h-11',
              'sm:px-4',
              'sm:py-2.5',
            ].join(' '),

        // ---------------------------------------------------------------------
        // Consumer customization
        // ---------------------------------------------------------------------

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      Sign in
    </Link>
  );
}