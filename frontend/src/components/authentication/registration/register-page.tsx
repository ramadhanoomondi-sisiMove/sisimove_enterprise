// -----------------------------------------------------------------------------
// sisiMove — Registration Page
// -----------------------------------------------------------------------------
//
// Page-level composition boundary for:
//
//     /register
//
// Responsibilities:
// - Compose the public registration experience.
// - Introduce the sisiMove marketplace.
// - Provide the responsive page layout.
// - Connect the registration experience to the authentication route contract.
//
// This component intentionally does NOT:
// - Own registration state.
// - Validate registration data.
// - Call the registration API.
// - Manage authentication state.
// - Create or persist a session.
// - Redirect after registration.
// - Decide verification or marketplace authorization.
//
// Those responsibilities belong to their respective feature boundaries.
//
// Composition:
//
//     RegisterPage
//         │
//         ├── Introduction
//         │
//         └── RegisterForm
//                 │
//                 ├── RegisterFormHeader
//                 ├── RegisterFormFields
//                 ├── RegisterPasswordFields
//                 ├── RegisterTerms
//                 ├── RegisterSubmit
//                 ├── RegisterError
//                 └── RegisterSuccess
//
// Registration flow:
//
//     Account creation
//          ↓
//     ACCOUNT CREATED
//          ↓
//     Sign in
//          ↓
//     Login / authentication flow
//
// Registration does not authenticate the user.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import { AUTHENTICATION_ROUTES } from '@/features/authentication/constants';

import { RegisterForm } from './register-form';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface RegisterPageProps {
  /**
   * Optional page-level class customization.
   *
   * Kept intentionally narrow so callers can adjust the outer composition
   * without taking ownership of the page layout.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function RegisterPage({
  className,
}: RegisterPageProps) {
  return (
    <main
      className={[
        'min-h-[calc(100vh-4rem)] bg-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
        {/* -------------------------------------------------------------------
            Introduction
            -------------------------------------------------------------------

            The introduction establishes the reason for joining sisiMove
            without duplicating the registration form's heading.

            The registration form remains the primary interactive surface.
        ------------------------------------------------------------------- */}

        <section
          aria-labelledby="register-introduction-title"
          className="flex flex-col justify-center border-b border-slate-200 px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-16"
        >
          <div className="max-w-md">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                JOIN sisiMove
              </p>

              <h1
                id="register-introduction-title"
                className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
              >
                Start travelling with people going your way.
              </h1>

              <p className="max-w-sm text-base leading-7 text-slate-600">
                Discover journeys, join travel demand, or share a
                journey of your own.
              </p>
            </div>

            {/* ---------------------------------------------------------------
                Marketplace value
                --------------------------------------------------------------- */}

            <div className="mt-8 grid gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                />

                <span>Discover journeys going your way.</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                />

                <span>Find people looking for the same route.</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                />

                <span>Share a journey when you have a seat.</span>
              </div>
            </div>

            {/* ---------------------------------------------------------------
                Existing account
                --------------------------------------------------------------- */}

            <div className="mt-10 border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                  href={AUTHENTICATION_ROUTES.LOGIN}
                  className="font-medium text-blue-600 underline-offset-4 transition-colors hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            Registration form
            -------------------------------------------------------------------

            RegisterForm owns the registration interaction and its complete
            lifecycle. This page only determines where that experience sits.
        ------------------------------------------------------------------- */}

        <section
          aria-labelledby="register-form-title"
          className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16"
        >
          <div className="w-full max-w-xl">
            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;

