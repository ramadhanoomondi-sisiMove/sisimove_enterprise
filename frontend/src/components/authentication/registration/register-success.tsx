// -----------------------------------------------------------------------------
// sisiMove — Registration Success
// -----------------------------------------------------------------------------
//
// Presentation component for the successful registration state.
//
// Registration is intentionally NOT authentication.
//
// Successful registration:
//
//     Account created
//          │
//          ▼
//     Traveller profile created
//          │
//          ▼
//     Traveller handle assigned
//          │
//          ▼
//     Ready to sign in
//
// The backend-generated traveller handle is the authoritative public handle
// created during registration.
//
// This component therefore:
//
// - displays the returned traveller handle;
// - presents LOGIN as the next action.
//
// This component does NOT:
//
// - authenticate the user;
// - create a session;
// - store tokens;
// - redirect automatically;
// - claim that the user is verified;
// - call the registration API;
// - generate or modify the traveller handle.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import { AUTHENTICATION_ROUTES } from '@/features/authentication/constants';

// =============================================================================
// Props
// =============================================================================

export interface RegisterSuccessProps {
  /**
   * Backend-generated public traveller handle.
   *
   * Example:
   *
   *     ramadhan_balala
   *
   * This value is authoritative and must be displayed exactly as returned
   * by the registration API.
   */
  readonly travellerHandle: string;
}

// =============================================================================
// Component
// =============================================================================

export function RegisterSuccess({
  travellerHandle,
}: RegisterSuccessProps) {
  return (
    <section
      aria-labelledby="register-success-title"
      className="w-full"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Success Indicator                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5 12 4 4L19 6"
          />
        </svg>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          Account created
        </p>

        <h1
          id="register-success-title"
          className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
        >
          Welcome to{' '}
          <span className="text-slate-950">sisi</span>
          <span className="text-blue-600">Move</span>.
        </h1>

        <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-base">
          Your account is ready. Your traveller profile has been created,
          and you can now sign in to access the marketplace.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Traveller Handle                                                    */}
      {/* ------------------------------------------------------------------ */}
      {travellerHandle ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Your traveller handle
          </p>

          <p className="mt-1 text-base font-semibold text-slate-950">
            @{travellerHandle}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            This is your public identity on sisiMove.
          </p>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Primary Action                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-8">
        <Link
          href={AUTHENTICATION_ROUTES.LOGIN}
          className="flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Sign in
        </Link>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Marketplace Prompt                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-sm font-semibold text-slate-900">
          Ready to see what&apos;s happening?
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          Sign in to explore{' '}
          <span className="font-medium text-slate-950">sisi</span>
          <span className="font-medium text-blue-600">Move</span>.
        </p>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterSuccess;

