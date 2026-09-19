// -----------------------------------------------------------------------------
// sisiMove — Authenticated Shell
// -----------------------------------------------------------------------------
//
// Application shell for authenticated SisiMove routes.
//
// Shell structure:
//
//     AuthenticatedShell
//         │
//         ├── AuthenticatedHeader
//         │     ├── Logo
//         │     ├── Navigation
//         │     ├── Account Menu
//         │     └── Notifications
//         │
//         ├── Page content
//         │
//         └── AuthenticatedFooter
//
// Responsibilities:
// - Establish the authenticated application's visual shell.
// - Compose the authenticated header.
// - Provide the page-content boundary.
// - Compose the authenticated footer.
//
// Non-responsibilities:
// - No authentication-state management.
// - No session restoration.
// - No login/logout implementation.
// - No route protection.
// - No authorization.
// - No verification logic.
// - No marketplace capability logic.
// - No marketplace data fetching.
// - No traveller-profile fetching.
//
// Authentication boundary:
//
//     (authenticated)/layout.tsx
//              │
//              ▼
//     AuthenticatedShell
//
// Route protection should remain at the authenticated route boundary and
// should use the existing authentication infrastructure. The shell itself
// must not create a second authentication mechanism.
//
// Traveller identity:
//
// AuthSession contains authentication/session identifiers, but the public
// traveller handle belongs to TravellerProfile. Therefore the shell receives
// travellerHandle from the authenticated application boundary rather than
// reading it from AuthSession.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  AuthenticatedFooter,
  AuthenticatedHeader,
} from '@/components/authenticated';

export interface AuthenticatedShellProps {
  /**
   * Authenticated page content.
   */
  readonly children: ReactNode;

  /**
   * Public TravellerProfile handle displayed in the authenticated header.
   *
   * Example:
   *
   *     ramadhan
   *
   * AuthenticatedAccountMenu is responsible for presenting the @ prefix.
   */
  readonly travellerHandle: string;
}

export function AuthenticatedShell({
  children,
  travellerHandle,
}: AuthenticatedShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        <AuthenticatedHeader
          travellerHandle={travellerHandle}
        />

        <main className="min-w-0 flex-1">
          {children}
        </main>

        <AuthenticatedFooter />
      </div>
    </div>
  );
}

export default AuthenticatedShell;
