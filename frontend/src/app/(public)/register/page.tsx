
// -----------------------------------------------------------------------------
// sisiMove — Registration Route
// -----------------------------------------------------------------------------
//
// Next.js route boundary for:
//
//     /register
//
// The route intentionally contains no registration logic.
// The composed registration experience lives in:
//
//     components/authentication/registration/register-page.tsx
//
// This keeps the Next.js App Router boundary thin and prevents authentication
// behavior from leaking into the routing layer.
//
// -----------------------------------------------------------------------------

import { RegisterPage } from '@/components/authentication/registration';

export default function RegisterRoute() {
  return <RegisterPage />;
}

