'use client';

// -----------------------------------------------------------------------------
// sisiMove — Login Submit
// -----------------------------------------------------------------------------
//
// Presentation component for the login form submission action.
//
// Responsibilities:
// - Render the login submit button.
// - Communicate the loading state to the user.
// - Prevent submission while authentication is in progress.
//
// This component intentionally does NOT:
// - Perform login.
// - Call the authentication API.
// - Validate credentials.
// - Manage authentication state.
// - Persist the authentication session.
// - Navigate after login.
//
// Those responsibilities belong to the login feature/form boundary.
//
// Responsive behaviour:
// - Shrinks safely horizontally.
// - Prevents text/icon overflow.
// - Uses fluid sizing across viewport widths.
// - Preserves accessible focus and loading states.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface LoginSubmitProps {
  /**
   * Indicates that the login request is currently being processed.
   */
  readonly isLoading: boolean;

  /**
   * Allows the parent form to disable submission independently of loading.
   */
  readonly disabled?: boolean;

  /**
   * Text displayed when the form is ready to submit.
   */
  readonly label?: string;

  /**
   * Text displayed while authentication is being processed.
   */
  readonly loadingLabel?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LoginSubmit({
  isLoading,
  disabled = false,
  label = 'Sign in',
  loadingLabel = 'Signing in...',
}: LoginSubmitProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={isLoading}
      className={[
        // Layout
        'inline-flex',
        'w-full',
        'min-w-0',
        'max-w-full',
        'shrink',
        'items-center',
        'justify-center',
        'gap-[clamp(0.4rem,1vw,0.55rem)]',

        // Sizing
        'min-h-[clamp(2.5rem,6vw,3rem)]',
        'rounded-[clamp(0.5rem,1vw,0.625rem)]',
        'px-[clamp(0.75rem,2vw,1rem)]',
        'py-[clamp(0.55rem,1.5vw,0.75rem)]',

        // Typography
        'text-[clamp(0.75rem,1.4vw,0.875rem)]',
        'font-semibold',
        'leading-tight',

        // Prevent overflow
        'overflow-hidden',
        'whitespace-nowrap',

        // Visual
        'bg-[var(--brand)]',
        'text-[var(--brand-foreground)]',
        'shadow-[var(--shadow-sm)]',

        // Interaction
        'transition-all',
        'duration-150',
        'ease-out',
        'hover:bg-[var(--brand)]/90',
        'hover:shadow-[var(--shadow-md)]',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--surface)]',

        // Disabled
        'disabled:cursor-not-allowed',
        'disabled:opacity-60',
      ].join(' ')}
    >
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            className={[
              'size-[clamp(0.8rem,1.5vw,1rem)]',
              'shrink-0',
              'animate-spin',
              'rounded-full',
              'border-2',
              'border-white/40',
              'border-t-white',
            ].join(' ')}
          />

          <span className="min-w-0 truncate">
            {loadingLabel}
          </span>
        </>
      ) : (
        <span className="min-w-0 truncate">
          {label}
        </span>
      )}
    </button>
  );
}

export default LoginSubmit;
