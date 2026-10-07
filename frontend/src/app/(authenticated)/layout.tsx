// -----------------------------------------------------------------------------
// sisiMove — Authenticated Route Layout
// -----------------------------------------------------------------------------
//
// Application route boundary for authenticated SisiMove surfaces.
//
// Responsibilities:
// - resolve the current Traveller Profile;
// - resolve the Traveller Profile's public avatar Asset reference;
// - resolve the current Identity Verification aggregate;
// - supply presentation-ready traveller data and verification capability
//   to AuthenticatedShell.
//
// Non-responsibilities:
// - authentication state management;
// - session management;
// - route authorization;
// - verification business logic;
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
//
//     useVerification()
//              │
//              └── verification.level
//                         │
//                         ▼
//                  AuthenticatedShell
//                         │
//                         ▼
//                  AuthenticatedHeader
//                         │
//                         ▼
//              AuthenticatedNavigation
//
// Verification presentation:
//
//     NONE
//       → Get Verified
//
//     MEMBER
//       → My Bookings
//
//     DRIVER
//       → My Journeys
//       → My Bookings
//
// Backend authorization remains authoritative.
// Navigation visibility is presentation only.
//
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";

// -----------------------------------------------------------------------------
// Authenticated Application
// -----------------------------------------------------------------------------

import { AuthenticatedShell } from "@/components/authenticated";

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

import { useCurrentTravellerProfile } from "@/features/traveller-profile";

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------
//
// The Verification feature owns retrieval of the current authenticated
// Identity's Verification aggregate.
//
//     GET /verifications/me
//              ↓
//       useVerification()
//              ↓
//       verification.level
//
// The layout does not calculate verification permissions.
// It only passes the already-resolved VerificationLevel to the shell.
// -----------------------------------------------------------------------------

import { useVerification } from "@/features/verification/hooks";

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

import { usePublicAsset } from "@/features/assets";

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
  // Current Verification
  // ---------------------------------------------------------------------------
  //
  // The Verification hook loads:
  //
  //     GET /verifications/me
  //
  // The resulting `verification.level` is passed unchanged to
  // AuthenticatedShell.
  //
  // The layout does not determine authorization.
  //
  // ---------------------------------------------------------------------------

  const {
    verification,
    isLoading: verificationLoading,
    error: verificationError,
  } = useVerification();

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
      <div
        className={[
          "min-h-screen",
          "bg-[var(--background)]",
          "text-[var(--foreground)]",
        ].join(" ")}
      >
        <div
          className="flex min-h-screen items-center justify-center px-4"
          aria-busy="true"
          aria-live="polite"
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading your profile…
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Current Verification Loading
  // ---------------------------------------------------------------------------
  //
  // Navigation visibility depends on the resolved VerificationLevel.
  //
  // Do not render authenticated navigation before Verification has loaded.
  // This prevents the application from briefly presenting the wrong
  // verification-level navigation.
  //
  // ---------------------------------------------------------------------------

  if (verificationLoading) {
    return (
      <div
        className={[
          "min-h-screen",
          "bg-[var(--background)]",
          "text-[var(--foreground)]",
        ].join(" ")}
      >
        <div
          className="flex min-h-screen items-center justify-center px-4"
          aria-busy="true"
          aria-live="polite"
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading your verification status…
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
      <div
        className={[
          "min-h-screen",
          "bg-[var(--background)]",
          "text-[var(--foreground)]",
        ].join(" ")}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <div
            className="max-w-md text-center"
            role="alert"
          >
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              We could not load your profile
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Your Traveller Profile is required to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Current Verification Failure
  // ---------------------------------------------------------------------------
  //
  // A missing Verification aggregate is treated as an error rather than
  // silently converting the user to NONE.
  //
  // Registration is expected to create the Verification aggregate, so a
  // missing result should not be interpreted as an unverified user.
  //
  // ---------------------------------------------------------------------------

  if (verificationError || verification == null) {
    return (
      <div
        className={[
          "min-h-screen",
          "bg-[var(--background)]",
          "text-[var(--foreground)]",
        ].join(" ")}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <div
            className="max-w-md text-center"
            role="alert"
          >
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              We could not load your verification status
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Your verification status is required to determine the
              appropriate SisiMove access level.
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
  // Verification level is now passed from the actual Verification aggregate.
  //
  //     verification.level
  //             ↓
  //     AuthenticatedShell
  //             ↓
  //     AuthenticatedHeader
  //             ↓
  //     AuthenticatedNavigation
  //
  // Notification state is intentionally absent from this composition boundary.
  // The notification feature independently owns that server state.
  //
  // ---------------------------------------------------------------------------

  return (
    <AuthenticatedShell
      travellerHandle={travellerProfile.handle}
      travellerAvatarUrl={avatarAsset?.url ?? null}
      verificationLevel={verification.level}
    >
      {children}
    </AuthenticatedShell>
  );
}
