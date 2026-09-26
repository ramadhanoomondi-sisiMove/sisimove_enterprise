// -----------------------------------------------------------------------------
// sisiMove — Authenticated Route Layout
// -----------------------------------------------------------------------------
//
// Application route boundary for authenticated SisiMove surfaces.
//
// Responsibilities:
// - resolve the current Traveller Profile;
// - resolve the Traveller Profile's public avatar Asset reference;
// - supply presentation-ready traveller data to AuthenticatedShell.
//
// Non-responsibilities:
// - authentication state management;
// - session management;
// - route authorization;
// - notification fetching;
// - notification state management;
// - marketplace data fetching;
// - rendering application pages.
//
// Data flow:
//
//     useCurrentTravellerProfile()
//              │
//              ├── handle
//              │
//              └── avatarAssetPublicId
//                         │
//                         ▼
//                  usePublicAsset()
//                         │
//                         └── avatar.url
//                                  │
//                                  ▼
//                         AuthenticatedShell
//                                  │
//                                  ▼
//                         AuthenticatedHeader
//                           │              │
//                           │              └── AuthenticatedAccountMenu
//                           │
//                           └── AuthenticatedNotifications
//                                      │
//                                      ▼
//                                NotificationBell
//                                      │
//                                      ▼
//                               useNotifications()
//
// The layout is the composition boundary for current traveller presentation
// data. Header and shell components do not fetch Traveller Profile or Asset
// data.
//
// Notification state deliberately does not pass through this layout.
// `NotificationBell` owns its notification query because notifications are
// independent authenticated server state.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Authenticated Application
// -----------------------------------------------------------------------------

import { AuthenticatedShell } from '@/components/authenticated';

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

import { useCurrentTravellerProfile } from '@/features/traveller-profile';

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------
//
// The Asset feature owns public Asset URL resolution.
//
//     avatarAssetPublicId
//             ↓
//     public Asset reference
//             ↓
//     avatar.url
//
// The layout never constructs an Asset URL itself.
// -----------------------------------------------------------------------------

import { usePublicAsset } from '@/features/assets';

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedLayoutProps {
  /**
   * Authenticated route content.
   */
  readonly children: ReactNode;
}

// =============================================================================
// Component
// =============================================================================

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  // ---------------------------------------------------------------------------
  // Current Traveller Profile
  // ---------------------------------------------------------------------------
  //
  // The authenticated route boundary resolves the current Traveller Profile.
  //
  // Header and shell components receive presentation-ready values and remain
  // independent from Traveller Profile data access.
  //
  // ---------------------------------------------------------------------------

  const {
    data: travellerProfile,
    isLoading: profileLoading,
    isError: profileIsError,
  } = useCurrentTravellerProfile();

  // ---------------------------------------------------------------------------
  // Avatar Asset Reference
  // ---------------------------------------------------------------------------
  //
  // TravellerProfile owns only the opaque Asset public ID.
  //
  // The Asset feature owns resolution of:
  //
  //     avatarAssetPublicId → public delivery URL
  //
  // `null` is supplied while the profile is unavailable. The public Asset hook
  // is responsible for treating a null identifier as a disabled query.
  //
  // ---------------------------------------------------------------------------

  const avatarAssetPublicId =
    travellerProfile?.avatarAssetPublicId ?? null;

  const {
    asset: avatarAsset,
  } = usePublicAsset(avatarAssetPublicId);

  // ---------------------------------------------------------------------------
  // Current Traveller Profile Loading
  // ---------------------------------------------------------------------------

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div
          className="flex min-h-screen items-center justify-center px-4"
          aria-busy="true"
          aria-live="polite"
        >
          <p className="text-sm text-muted-foreground">
            Loading your profile…
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Current Traveller Profile Failure
  // ---------------------------------------------------------------------------
  //
  // The authenticated shell requires a Traveller Profile because the header
  // account boundary requires the public traveller handle.
  //
  // ---------------------------------------------------------------------------

  if (profileIsError || travellerProfile == null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div
            className="max-w-md text-center"
            role="alert"
          >
            <h1 className="text-lg font-semibold">
              We could not load your profile
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Your Traveller Profile is required to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Authenticated Application Shell
  // ---------------------------------------------------------------------------
  //
  // Avatar URL resolution is intentionally non-blocking.
  //
  // If the Asset request is still loading or fails, `null` is passed to the
  // account menu and the shared Avatar primitive can render its initials
  // fallback.
  //
  // Notification state is intentionally absent from this composition boundary.
  // The notification feature independently owns that server state.
  //
  // ---------------------------------------------------------------------------

  return (
    <AuthenticatedShell
      travellerHandle={travellerProfile.handle}
      travellerAvatarUrl={avatarAsset?.url ?? null}
    >
      {children}
    </AuthenticatedShell>
  );
}

