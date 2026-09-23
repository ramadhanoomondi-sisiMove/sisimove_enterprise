// -----------------------------------------------------------------------------
// sisiMove — Authenticated Route Layout
// -----------------------------------------------------------------------------
//
// Application route boundary for authenticated SisiMove surfaces.
//
// Responsibilities:
// - Resolve the current Traveller Profile.
// - Resolve the current Traveller Profile's public avatar Asset reference.
// - Supply presentation-ready identity data to AuthenticatedShell.
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
//                                  │
//                                  ▼
//                    AuthenticatedAccountMenu
//
// The layout is the composition boundary. Header and shell components do not
// fetch Traveller Profile or Asset data.
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

import {
  useCurrentTravellerProfile,
} from '@/features/traveller-profile';

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------
//
// Use the existing public Asset reference hook.
//
// This hook resolves:
//
//     avatarAssetPublicId
//             ↓
//     GET /assets/public/:assetPublicId/reference
//             ↓
//     public Asset URL
//
// -----------------------------------------------------------------------------

import {
  usePublicAsset,
} from '@/features/assets';

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
  // It does not own Asset delivery and must not construct the URL itself.
  //
  // The Asset feature owns resolution of:
  //
  //     avatarAssetPublicId → public delivery URL
  //
  // Passing `null` while the profile is unavailable prevents an unnecessary
  // Asset request.
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
          aria-live="polite"
          aria-busy="true"
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

  if (profileIsError || travellerProfile == null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
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
  // The header receives the exact same resolved Asset URL that can be used by
  // ProfileHeader.
  //
  // Avatar resolution is intentionally non-blocking. Until `avatarAsset.url`
  // is available, AuthenticatedAccountMenu passes `undefined` to Avatar and
  // the shared Avatar primitive renders its initials fallback.
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