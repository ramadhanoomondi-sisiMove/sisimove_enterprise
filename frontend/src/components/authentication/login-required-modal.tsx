// -----------------------------------------------------------------------------
// sisiMove — Login Required Modal
// -----------------------------------------------------------------------------
//
// Presentation-only modal shown when an unauthenticated visitor attempts a
// protected marketplace action.
//
// Responsibilities:
//
// - explain why sign-in is required;
// - provide a Sign in action;
// - provide a Join sisiMove action;
// - allow the visitor to dismiss the modal.
//
// This component does NOT:
//
// - inspect authentication state;
// - perform authentication;
// - perform verification;
// - perform booking;
// - call an API.
//
// Authentication/authorization remains outside this presentation component.
//
// Branding:
//
// - "sisi" → foreground / black
// - "Move" → brand / blue
//
// Routing:
//
// - Sign in      → AUTHENTICATION_ROUTES.LOGIN
// - Join sisiMove → AUTHENTICATION_ROUTES.REGISTER
//
// Route ownership remains in the application routing foundation. This
// component consumes those route definitions rather than hardcoding URL
// strings.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import {
  AUTHENTICATION_ROUTES,
} from '@/foundation/routing';


// =============================================================================
// Types
// =============================================================================

interface LoginRequiredModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
}


// =============================================================================
// Brand Mark
// =============================================================================
//
// Keep the sisiMove wordmark consistent wherever it appears.
//
// The brand itself is deliberately split into two spans so the visual identity
// does not depend on inherited text color.
//

function SisiMoveBrand() {
  return (
    <span
      aria-label="sisiMove"
      className="inline-flex items-baseline font-bold tracking-tight"
    >
      <span className="text-[var(--foreground)]">
        sisi
      </span>

      <span className="text-[var(--brand)]">
        Move
      </span>
    </span>
  );
}


// =============================================================================
// Login Required Modal
// =============================================================================

export function LoginRequiredModal({
  open,
  onClose,
}: LoginRequiredModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        aria-describedby="login-required-description"
        className={[
          'w-full max-w-md',
          'rounded-t-2xl sm:rounded-2xl',
          'border border-[var(--border)]',
          'bg-[var(--background)]',
          'p-6 shadow-2xl',
          'sm:p-7',
        ].join(' ')}
      >
        {/* --------------------------------------------------------------- */}
        {/* Header                                                          */}
        {/* --------------------------------------------------------------- */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* ----------------------------------------------------------- */}
            {/* sisiMove wordmark                                            */}
            {/* ----------------------------------------------------------- */}

            <p className="text-sm leading-none">
              <SisiMoveBrand />
            </p>

            <h2
              id="login-required-title"
              className="mt-3 text-xl font-semibold text-[var(--foreground)]"
            >
              Sign in to continue
            </h2>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Close                                                          */}
          {/* ------------------------------------------------------------- */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={[
              'shrink-0 rounded-full p-2',
              'text-[var(--foreground-muted)]',
              'transition-colors',
              'hover:bg-[var(--background-subtle)]',
              'hover:text-[var(--foreground)]',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
            ].join(' ')}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Explanation                                                     */}
        {/* --------------------------------------------------------------- */}

        <p
          id="login-required-description"
          className="mt-3 text-sm leading-6 text-[var(--foreground-secondary)]"
        >
          You need a sisiMove account to book a seat, Joing demand, or Create on this journey.
          Sign in to continue, or create an account if you are new to
          sisiMove.
        </p>

        {/* --------------------------------------------------------------- */}
        {/* Authentication actions                                          */}
        {/* --------------------------------------------------------------- */}

        <div className="mt-6 space-y-3">
          {/* ------------------------------------------------------------- */}
          {/* Sign in                                                       */}
          {/* ------------------------------------------------------------- */}

          <Link
            href={AUTHENTICATION_ROUTES.LOGIN}
            className={[
              'flex w-full items-center justify-center',
              'rounded-[var(--radius-md)]',
              'bg-[var(--brand)]',
              'px-4 py-3',
              'text-sm font-semibold',
              'text-[var(--brand-foreground)]',
              'transition-colors',
              'hover:bg-[var(--brand-hover)]',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Sign in
          </Link>

          {/* ------------------------------------------------------------- */}
          {/* Join sisiMove                                                  */}
          {/* ------------------------------------------------------------- */}

          <Link
            href={AUTHENTICATION_ROUTES.REGISTER}
            className={[
              'flex w-full items-center justify-center',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'px-4 py-3',
              'text-sm font-semibold',
              'text-[var(--foreground)]',
              'transition-colors',
              'hover:bg-[var(--background-subtle)]',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Join sisiMove
          </Link>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Secondary action                                                */}
        {/* --------------------------------------------------------------- */}

        <button
          type="button"
          onClick={onClose}
          className={[
            'mt-4 w-full',
            'text-center text-sm font-medium',
            'text-[var(--foreground-secondary)]',
            'transition-colors',
            'hover:text-[var(--foreground)]',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]',
          ].join(' ')}
        >
          Continue browsing
        </button>
      </div>
    </div>
  );
}

export default LoginRequiredModal;

