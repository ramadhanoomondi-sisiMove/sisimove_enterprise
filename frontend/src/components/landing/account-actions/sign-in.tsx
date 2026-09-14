// -----------------------------------------------------------------------------
// sisiMove — Sign In
// -----------------------------------------------------------------------------
//
// Reusable public account-action component for existing sisiMove members.
//
// This component is presentation-only.
//
// It does not:
// - authenticate the user;
// - access session state;
// - call an API;
// - perform login.
//
// The authentication boundary owns the actual sign-in flow.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface SignInProps {
  /**
   * Sign-in destination.
   *
   * Defaults to the public login route.
   */
  href?: string;

  /**
   * Optional additional class name.
   */
  className?: string;

  /**
   * Optional compact presentation.
   *
   * Useful for navigation/header surfaces.
   */
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function SignIn({
  href = '/login',
  className,
  compact = false,
}: SignInProps) {
  return (
    <Link
      href={href}
      className={[
        'inline-flex',
        'items-center',
        'justify-center',
        'font-medium',
        'whitespace-nowrap',
        'select-none',
        'transition-colors',
        'duration-150',
        'ease-out',
        'bg-transparent',
        'text-[var(--foreground-secondary)]',
        'border',
        'border-transparent',
        'hover:bg-[var(--background-subtle)]',
        'hover:text-[var(--foreground)]',
        'active:bg-[var(--background-muted)]',
        'focus-visible:outline-2',
        'focus-visible:outline-[var(--brand)]',
        'focus-visible:outline-offset-2',
        compact
          ? [
              'min-h-9',
              'px-3',
              'text-sm',
              'rounded-[var(--radius-md)]',
            ].join(' ')
          : [
              'min-h-11',
              'px-4',
              'text-sm',
              'rounded-[var(--radius-lg)]',
            ].join(' '),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      Sign in
    </Link>
  );
}