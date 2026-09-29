// -----------------------------------------------------------------------------
// sisiMove — Authenticated Shell
// -----------------------------------------------------------------------------
//
// Application shell for authenticated SisiMove routes.
//
// Product message:
//
//     PLAN → PUBLISH → DISCOVER → MATCH → TRAVEL → COMPLETE
//
// The authenticated application continues the same SisiMove marketplace
// experience established by the public application.
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
// - Preserve the SisiMove marketplace visual language.
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
// Route protection remains at the authenticated route boundary and should use
// the existing authentication infrastructure. The shell must not create a
// second authentication mechanism.
//
// Traveller identity:
//
// AuthSession contains authentication/session identifiers, while the public
// traveller handle and avatar belong to TravellerProfile.
//
// Therefore, the authenticated application boundary resolves the current
// TravellerProfile and its public avatar URL, then supplies those values to
// this shell.
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
// Visual language:
//
// The authenticated shell deliberately continues the public SisiMove
// marketplace rather than introducing a separate "dashboard" aesthetic.
//
// - White primary surfaces.
// - Very light brand-tinted application background.
// - SisiMove blue as the primary navigation/accent colour.
// - Subtle borders and restrained shadows.
// - Dense, purposeful layout.
// - Journey marketplace remains the product centre.
// - Individual pages own their cards and content surfaces.
//
// -----------------------------------------------------------------------------


import type { ReactNode } from "react";

import {
  AuthenticatedFooter,
  AuthenticatedHeader,
} from "@/components/authenticated";

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
   * AuthenticatedAccountMenu is responsible for presenting the @ prefix.
   */
  readonly travellerHandle: string;

  /**
   * Already-resolved public TravellerProfile avatar URL.
   *
   * Asset resolution remains outside the shell.
   *
   * `null` or `undefined` means that the traveller does not currently have
   * a usable public avatar, allowing the shared Avatar primitive to render
   * its initials fallback.
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
    <div
      className={[
        "min-h-screen",
        "bg-[var(--background-brand)]",
        "text-[var(--foreground)]",
      ].join(" ")}
    >
      <div className="flex min-h-screen flex-col">
        <AuthenticatedHeader
          travellerHandle={travellerHandle}
          travellerAvatarUrl={travellerAvatarUrl}
        />

        <main
          className={[
            "min-w-0",
            "flex-1",
            "bg-[var(--background-brand)]",
          ].join(" ")}
        >
          {children}
        </main>

        <AuthenticatedFooter />
      </div>
    </div>
  );
}

export default AuthenticatedShell;