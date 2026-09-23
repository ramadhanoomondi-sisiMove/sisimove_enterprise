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
// - No Asset fetching.
// - No Asset URL resolution.
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
// traveller handle and avatar belong to TravellerProfile.
//
// Therefore the authenticated application boundary resolves the current
// TravellerProfile and its public avatar URL, then supplies those values
// to this shell.
//
// Presentation flow:
//
//     TravellerProfile
//          │
//          ├── handle
//          │
//          └── avatarAssetPublicId
//                    │
//                    ▼
//             usePublicAsset()
//                    │
//                    ▼
//          AuthenticatedShell
//                    │
//                    ▼
//          AuthenticatedHeader
//                    │
//                    ▼
//        AuthenticatedAccountMenu
//
// The shell does not know how the avatar URL was resolved.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  AuthenticatedFooter,
  AuthenticatedHeader,
} from '@/components/authenticated';

// =============================================================================
// Props
// =============================================================================

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

  /**
   * Already-resolved public TravellerProfile avatar URL.
   *
   * Asset resolution remains outside the shell.
   *
   * `null` or `undefined` means that the traveller does not currently have
   * a usable public avatar, in which case the shared Avatar primitive
   * renders its initials fallback.
   */
  readonly travellerAvatarUrl?: string | null;
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedShell({
  children,
  travellerHandle,
  travellerAvatarUrl,
}: AuthenticatedShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        <AuthenticatedHeader
          travellerHandle={travellerHandle}
          travellerAvatarUrl={travellerAvatarUrl}
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