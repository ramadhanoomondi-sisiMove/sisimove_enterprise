// -----------------------------------------------------------------------------
// sisiMove — Login Route
// -----------------------------------------------------------------------------
//
// Next.js route entry point for the public login page.
//
// This file intentionally contains no authentication logic. The page-level
// composition lives in components/authentication/login.
// -----------------------------------------------------------------------------

import { LoginPage } from '@/components/authentication/login';

export default function LoginRoute() {
  return <LoginPage />;
}

