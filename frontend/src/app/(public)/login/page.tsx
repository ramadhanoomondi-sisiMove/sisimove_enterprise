// -----------------------------------------------------------------------------
// Path: src/app/(public)/login/page.tsx
// -----------------------------------------------------------------------------
// sisiMove — Login Route
// -----------------------------------------------------------------------------
//
// Next.js route entry point for the public login page.
//
// The LoginPage client component uses useSearchParams() for the optional
// returnTo continuation. It therefore must be rendered beneath a Suspense
// boundary for production prerendering.
//
// -----------------------------------------------------------------------------

import { Suspense } from 'react';

import { LoginPage } from '@/components/authentication/login';

export default function LoginRoute() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}