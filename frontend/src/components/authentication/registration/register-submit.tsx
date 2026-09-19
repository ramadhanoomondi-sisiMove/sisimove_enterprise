// -----------------------------------------------------------------------------
// sisiMove — Registration Submit
// -----------------------------------------------------------------------------
//
// Presentation component for the registration form submit action.
//
// Responsibilities:
//
// - render the primary registration action;
// - communicate the loading state;
// - prevent accidental duplicate submission through the disabled state;
// - provide accessible busy-state semantics.
//
// This component does NOT:
//
// - submit the registration request;
// - validate form values;
// - call the registration API;
// - manage registration state;
// - navigate after registration.
//
// The parent RegisterForm owns submission orchestration.
//
// -----------------------------------------------------------------------------

'use client';

// =============================================================================
// Props
// =============================================================================

export interface RegisterSubmitProps {
  /**
   * Indicates that the registration request is currently being submitted.
   */
  readonly isLoading: boolean;

  /**
   * Allows the submit control to be disabled independently of the loading
   * state, for example when the form is invalid or terms have not been
   * accepted.
   */
  readonly disabled?: boolean;

  /**
   * Optional label override for the normal submit state.
   */
  readonly label?: string;

  /**
   * Optional label displayed while registration is being submitted.
   */
  readonly loadingLabel?: string;
}

// =============================================================================
// Component
// =============================================================================

export function RegisterSubmit({
  isLoading,
  disabled = false,
  label = 'Join sisiMove',
  loadingLabel = 'Creating your account...',
}: RegisterSubmitProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={isLoading}
      className={[
        'flex w-full items-center justify-center rounded-xl px-5 py-3',
        'text-sm font-semibold text-white',
        'transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
        isDisabled
          ? 'cursor-not-allowed bg-slate-300'
          : 'bg-slate-950 hover:bg-slate-800',
      ].join(' ')}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />

          <span>{loadingLabel}</span>
        </span>
      ) : (
        label
      )}
    </button>
  );
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterSubmit;

