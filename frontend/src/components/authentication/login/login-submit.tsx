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
// -----------------------------------------------------------------------------

'use client';

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
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />

          <span>{loadingLabel}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}

export default LoginSubmit;

