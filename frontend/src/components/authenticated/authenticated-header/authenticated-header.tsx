// -----------------------------------------------------------------------------
// sisiMove — Authenticated Header
// -----------------------------------------------------------------------------
//
// Primary header for authenticated application surfaces.
//
// Responsibilities:
// - Compose the authenticated application header.
// - Provide the authenticated sisiMove brand/home control.
// - Provide primary authenticated navigation.
// - Provide the authenticated account control.
// - Provide the notification control.
//
// Non-responsibilities:
// - No authentication-state management.
// - No session restoration.
// - No login/logout implementation.
// - No Traveller Profile fetching.
// - No Asset fetching.
// - No Asset URL resolution.
// - No verification logic.
// - No marketplace data fetching.
//
// The authenticated application boundary resolves the current Traveller
// Profile and its public avatar URL before supplying presentation data here.
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
//             avatarAsset.url
//                    │
//                    ▼
//          AuthenticatedHeader
//                    │
//                    ▼
//          AuthenticatedAccountMenu
//                    │
//                    ▼
//                  Avatar
//
// -----------------------------------------------------------------------------

import {
  AuthenticatedAccountMenu,
  AuthenticatedLogo,
  AuthenticatedNavigation,
  AuthenticatedNotifications,
} from '.';

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedHeaderProps {
  /**
   * Public Traveller Profile handle displayed in the account control.
   */
  readonly travellerHandle: string;

  /**
   * Already-resolved public Asset delivery URL for the current traveller's
   * profile photo.
   *
   * Asset resolution remains outside the header.
   *
   * `null` or `undefined` means that the shared Avatar primitive should render
   * its initials fallback.
   */
  readonly travellerAvatarUrl?: string | null;
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedHeader({
  travellerHandle,
  travellerAvatarUrl,
}: AuthenticatedHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center px-4 sm:min-h-16 sm:px-6 lg:px-8">

        {/* ----------------------------------------------------------------- */}
        {/* Brand + Primary Authenticated Navigation                         */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex min-w-0 flex-1 items-center">
          <AuthenticatedLogo />

          <div className="ml-6">
            <AuthenticatedNavigation />
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Account + Notifications                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-center gap-1">
          <AuthenticatedAccountMenu
            travellerHandle={travellerHandle}
            avatarSrc={travellerAvatarUrl}
          />

          <AuthenticatedNotifications />
        </div>
      </div>
    </header>
  );
}

export default AuthenticatedHeader;