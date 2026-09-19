// -----------------------------------------------------------------------------
// sisiMove — Authenticated Header
// -----------------------------------------------------------------------------
//
// Primary header for authenticated application surfaces.
//
// Header structure:
//
//     sisiMove
//         │
//         ├── 🧳 My Journeys
//         │
//         ├── 📋 My Demands
//         │
//         ├── @traveller ▾
//         │
//         └── 🔔
//
// Responsibilities:
//
// - Compose the authenticated application header.
// - Provide the authenticated sisiMove brand/home control.
// - Provide primary authenticated navigation.
// - Provide the authenticated account control.
// - Provide the notification control.
//
// Non-responsibilities:
//
// - No authentication-state management.
// - No session restoration.
// - No login/logout implementation.
// - No Traveller Profile fetching.
// - No verification logic.
// - No marketplace capability logic.
// - No marketplace data fetching.
// - No Journey data fetching.
// - No Journey Demand data fetching.
//
// The header is intentionally a presentation/composition boundary.
//
// The authenticated application layer resolves the current Traveller Profile
// and supplies only the presentation data required by the header.
//
// Traveller Profile resolution:
//
//   Authentication
//        ↓
//   useCurrentTravellerProfile()
//        ↓
//   Authenticated application composition
//        ↓
//   AuthenticatedHeader
//        ↓
//   AuthenticatedAccountMenu
//
// Navigation resolution:
//
//   AuthenticatedHeader
//        ↓
//   AuthenticatedNavigation
//        ├── Home
//        ├── My Journeys
//        └── My Demands
//
// The header does not know how Journey or Journey Demand data is loaded.
// Navigation only provides entry points into those authenticated feature
// surfaces.
//
// Branding:
//
// The authenticated header uses the same sisiMove wordmark treatment as the
// public SiteHeader:
//
//     sisi + Move
//
// "sisi" uses the application foreground colour.
// "Move" uses the sisiMove brand colour.
//
// The authenticated shell therefore continues the public brand identity
// rather than introducing a separate authenticated visual treatment.
//
// Branding is presentation-only. It does not introduce routing, authentication,
// marketplace, or domain responsibilities.
//
// -----------------------------------------------------------------------------


import {
  AuthenticatedAccountMenu,
  AuthenticatedLogo,
  AuthenticatedNavigation,
  AuthenticatedNotifications,
} from '.';


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface AuthenticatedHeaderProps {
  /**
   * Public Traveller Profile handle displayed in the account control.
   *
   * The handle belongs to the Traveller Profile and is therefore not derived
   * from AuthSession.
   *
   * The authenticated application layer is responsible for resolving the
   * current Traveller Profile before supplying this value.
   */
  readonly travellerHandle: string;
}


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AuthenticatedHeader({
  travellerHandle,
}: AuthenticatedHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center px-4 sm:min-h-16 sm:px-6 lg:px-8">

        {/* -----------------------------------------------------------------
            Brand + Primary Authenticated Navigation
        ----------------------------------------------------------------- */}

        <div className="flex min-w-0 flex-1 items-center">
          <AuthenticatedLogo />

          <div className="ml-6">
            <AuthenticatedNavigation />
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Account + Notifications
        ----------------------------------------------------------------- */}

        <div className="flex items-center gap-1">
          <AuthenticatedAccountMenu
            travellerHandle={travellerHandle}
          />

          <AuthenticatedNotifications />
        </div>
      </div>
    </header>
  );
}


export default AuthenticatedHeader;