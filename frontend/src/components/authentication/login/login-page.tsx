'use client';

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
// - Return the user to the route that initiated authentication when supplied.
// - Fall back to the authenticated marketplace after successful login.
//
// Non-responsibilities:
// - No form state.
// - No validation.
// - No API calls.
// - No token/session management.
// - No authentication state management.
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
//          ├── returnTo supplied
//          │       │
//          │       ▼
//          │   returnTo route
//          │
//          └── no returnTo
//                  │
//                  ▼
//          AUTHENTICATED_ROUTES.HOME
//
// Public Journey booking flow:
//
//     /journeys/[publicId]
//          │
//          ▼
//     Book Journey
//          │
//          ▼
//     /login?returnTo=/journeys/[publicId]
//          │
//          ▼
//     Successful login
//          │
//          ▼
//     /journeys/[publicId]
//
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  AUTHENTICATED_ROUTES,
  AUTHENTICATION_ROUTES,
} from '@/foundation/routing';

import { LoginForm } from './login-form';

// =============================================================================
// Props
// =============================================================================

export interface LoginPageProps {
  readonly forgotPasswordHref?: string;
}

// =============================================================================
// Component
// =============================================================================

export function LoginPage({
  forgotPasswordHref,
}: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---------------------------------------------------------------------------
  // Successful Authentication
  // ---------------------------------------------------------------------------
  //
  // If authentication was initiated from a protected continuation such as
  // booking a public Journey, return to that exact route.
  //
  // Otherwise, use the normal authenticated marketplace destination.
  //
  // ---------------------------------------------------------------------------

  const handleLoginSuccess = () => {
    const returnTo = searchParams.get('returnTo');

    if (returnTo && returnTo.startsWith('/')) {
      router.replace(returnTo);
      return;
    }

    router.replace(AUTHENTICATED_ROUTES.HOME);
  };

  return (
    <main
      className={[
        'min-h-[calc(100vh-4rem)]',
        'min-w-0',
        'overflow-x-hidden',
        'bg-[var(--surface)]',
        'text-[var(--foreground)]',
      ].join(' ')}
    >
      <div
        className={[
          'mx-auto',
          'grid',
          'min-h-[calc(100vh-4rem)]',
          'w-full',
          'min-w-0',
          'max-w-7xl',
          'lg:grid-cols-[0.9fr_1.1fr]',
        ].join(' ')}
      >
        {/* -----------------------------------------------------------------
            Brand / context panel
            ----------------------------------------------------------------- */}

        <section
          className={[
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            'px-[clamp(1rem,4vw,4rem)]',
            'py-[clamp(2rem,6vw,4rem)]',
            'lg:py-[clamp(3rem,6vw,4.5rem)]',
          ].join(' ')}
        >
          <div className="min-w-0 max-w-lg">
            <p
              className={[
                'text-[clamp(0.58rem,0.9vw,0.75rem)]',
                'font-semibold',
                'uppercase',
                'tracking-[0.18em]',
                'text-[var(--brand)]',
              ].join(' ')}
            >
              WELCOME BACK
            </p>

            <h2
              className={[
                'mt-[clamp(0.65rem,1.5vw,0.9rem)]',
                'min-w-0',
                'text-[clamp(1.75rem,4vw,2.5rem)]',
                'font-semibold',
                'leading-[1.1]',
                'tracking-tight',
                'text-[var(--foreground)]',
              ].join(' ')}
            >
              Continue your journey with{' '}
              <span className="text-[var(--foreground)]">sisi</span>
              <span className="text-[var(--brand)]">Move</span>.
            </h2>

            <p
              className={[
                'mt-[clamp(0.75rem,1.8vw,1rem)]',
                'max-w-md',
                'text-[clamp(0.75rem,1.4vw,1rem)]',
                'leading-relaxed',
                'text-[var(--foreground-secondary)]',
              ].join(' ')}
            >
              Sign in to explore journeys, find people travelling
              your way, and continue from where you left off.
            </p>

            {/* -------------------------------------------------------------
                Product context
                ------------------------------------------------------------- */}

            <div
              className={[
                'mt-[clamp(1.5rem,3vw,2rem)]',
                'min-w-0',
                'space-y-[clamp(0.45rem,0.9vw,0.75rem)]',
                'text-[clamp(0.7rem,1.15vw,0.875rem)]',
                'leading-relaxed',
                'text-[var(--foreground-secondary)]',
              ].join(' ')}
            >
              <p>Discover journeys going your way.</p>

              <p>Book a journey when you find the right one.</p>

              <p>Share a journey when you have available seats.</p>
            </div>

            {/* -------------------------------------------------------------
                Registration
                ------------------------------------------------------------- */}

            <div
              className={[
                'mt-[clamp(2rem,5vw,2.5rem)]',
                'border-t',
                'border-[var(--border)]',
                'pt-[clamp(1rem,2vw,1.5rem)]',
              ].join(' ')}
            >
              <p
                className={[
                  'text-[clamp(0.7rem,1.15vw,0.875rem)]',
                  'leading-relaxed',
                  'text-[var(--foreground-secondary)]',
                ].join(' ')}
              >
                Don&apos;t have an account?{' '}
                <Link
                  href={AUTHENTICATION_ROUTES.REGISTER}
                  className={[
                    'font-semibold',
                    'outline-none',
                    'transition-colors',
                    'duration-150',
                    'hover:text-[var(--brand)]',
                    'focus-visible:rounded-sm',
                    'focus-visible:ring-2',
                    'focus-visible:ring-[var(--brand)]',
                    'focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-[var(--surface)]',
                  ].join(' ')}
                >
                  <span className="text-[var(--foreground)]">
                    Join sisi
                  </span>
                  <span className="text-[var(--brand)]">Move</span>
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------
            Authentication panel
            ----------------------------------------------------------------- */}

        <section
          className={[
            'flex',
            'min-w-0',
            'items-center',
            'border-t',
            'border-[var(--border)]',
            'px-[clamp(1rem,4vw,4rem)]',
            'py-[clamp(2rem,6vw,4rem)]',
            'lg:border-l',
            'lg:border-t-0',
            'lg:py-[clamp(3rem,6vw,4.5rem)]',
          ].join(' ')}
        >
          <div className="w-full min-w-0 max-w-xl">
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