// -----------------------------------------------------------------------------
// sisiMove — Login Page
// -----------------------------------------------------------------------------
//
// Page-level composition boundary for user authentication.
//
// Responsibilities:
// - Compose the public authentication layout.
// - Present the sisiMove introduction/brand context.
// - Provide navigation to registration.
// - Render the LoginForm.
// - Navigate the user to the authenticated marketplace after successful login.
//
// Non-responsibilities:
// - No form state.
// - No validation.
// - No API calls.
// - No token/session management.
// - No authentication state management.
//
// The LoginForm and authentication feature own the actual authentication
// workflow. This component owns the page-level transition that occurs after
// authentication succeeds.
//
// Navigation boundary:
//
//     LoginForm
//          │
//          │ authentication succeeds
//          ▼
//     onSuccess(response)
//          │
//          ▼
//     LoginPage
//          │
//          ▼
//     AUTHENTICATED_ROUTES.HOME
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  AUTHENTICATED_ROUTES,
  AUTHENTICATION_ROUTES,
} from '@/foundation/routing';

import type { AuthenticateLoginResponse } from '@/features/authentication/login';

import { LoginForm } from './login-form';

export interface LoginPageProps {
  readonly forgotPasswordHref?: string;
}

export function LoginPage({
  forgotPasswordHref,
}: LoginPageProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Successful Authentication
  // ---------------------------------------------------------------------------
  //
  // Authentication has already completed successfully inside LoginForm.
  // The authentication feature owns session establishment.
  //
  // The page now performs the application-level transition into the
  // authenticated marketplace.
  //
  // `replace` is intentional: after signing in, the user should not be able
  // to press Back and return to the login page as part of the authenticated
  // navigation history.
  //
  // ---------------------------------------------------------------------------

  const handleLoginSuccess = (
    _response: AuthenticateLoginResponse,
  ) => {
    router.replace(AUTHENTICATED_ROUTES.HOME);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        {/* -----------------------------------------------------------------
            Brand / context panel
            ----------------------------------------------------------------- */}

        <section className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              WELCOME BACK
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Continue your journey with{' '}
              <span className="text-slate-950">sisi</span>
              <span className="text-blue-600">Move</span>.
            </h2>

            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
              Sign in to explore journeys, find people travelling
              your way, and continue from where you left off.
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-600">
              <p>Discover journeys going your way.</p>
              <p>Find travel demand for the routes you need.</p>
              <p>Share a journey when you have a seat.</p>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <Link
                  href={AUTHENTICATION_ROUTES.REGISTER}
                  className="font-semibold transition-colors hover:text-blue-700"
                >
                  <span className="text-slate-950">Join sisi</span>
                  <span className="text-blue-600">Move</span>
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------
            Authentication panel
            ----------------------------------------------------------------- */}

        <section className="flex items-center border-t border-slate-200 px-6 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:px-16 lg:py-16">
          <div className="w-full max-w-xl">
            <LoginForm
              forgotPasswordHref={forgotPasswordHref}
              onSuccess={handleLoginSuccess}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;