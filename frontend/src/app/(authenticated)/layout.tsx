// -----------------------------------------------------------------------------
// sisiMove — Authenticated Route Layout
// -----------------------------------------------------------------------------
//
// Application route boundary for authenticated SisiMove surfaces.
//
// Route structure:
//
//     app/(authenticated)/layout.tsx
//              │
//              ├── Current Traveller Profile
//              │       │
//              │       └── useCurrentTravellerProfile()
//              │
//              └── AuthenticatedShell
//                      │
//                      ├── AuthenticatedHeader
//                      ├── Page content
//                      └── AuthenticatedFooter
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This layout:
//
// - composes authenticated route content through AuthenticatedShell;
// - resolves the current Traveller Profile required by the shell;
// - supplies the Traveller Profile handle to the presentation shell;
// - keeps Traveller Profile fetching outside header and shell components.
//
// -----------------------------------------------------------------------------
//
// NON-RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This layout does NOT:
//
// - implement Traveller Profile HTTP calls;
// - access the API client directly;
// - construct Asset URLs;
// - implement verification logic;
// - implement marketplace capability logic;
// - fetch marketplace data;
// - create or persist authentication sessions;
// - introduce a second authentication/session mechanism.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION
// -----------------------------------------------------------------------------
//
// Authentication/session state remains owned by the existing authentication
// infrastructure.
//
// This route layout consumes authenticated application state indirectly
// through the existing authenticated route boundary and the authenticated
// Traveller Profile API.
//
// It does not create, persist, refresh, or otherwise manage sessions.
//
// -----------------------------------------------------------------------------
//
// TRAVELLER IDENTITY
// -----------------------------------------------------------------------------
//
// AuthSession contains authentication identifiers.
//
// The Traveller Profile owns the traveller handle.
//
// Therefore the handle is resolved through:
//
//     authenticated access token
//             ↓
//     GET /traveller-profiles/me
//             ↓
//     useCurrentTravellerProfile()
//             ↓
//     Traveller Profile
//             ↓
//     traveller.handle
//             ↓
//     AuthenticatedShell
//
// The layout deliberately does not attempt to derive the handle from:
//
// - identityPublicId;
// - sessionPublicId;
// - authenticationPublicId;
// - JWT claims.
//
// -----------------------------------------------------------------------------
//
// PROFILE FAILURE
// -----------------------------------------------------------------------------
//
// The authenticated shell requires a Traveller Profile handle.
//
// Therefore the shell is not rendered while the current Traveller Profile is
// loading or when the profile cannot be resolved.
//
// This prevents the header from being rendered with:
//
// - an empty handle;
// - a fabricated handle;
// - an Identity identifier used as a handle;
// - incomplete Traveller Profile state.
//
// Authentication failures themselves remain the responsibility of the existing
// authentication/API infrastructure.
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
// Props
// -----------------------------------------------------------------------------

export interface AuthenticatedLayoutProps {
  /**
   * Authenticated route content.
   */
  readonly children: ReactNode;
}


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const {
    data: travellerProfile,
    isLoading,
    isError,
  } = useCurrentTravellerProfile();

  // ---------------------------------------------------------------------------
  // Current Traveller Profile Loading
  // ---------------------------------------------------------------------------
  //
  // The authenticated shell requires the Traveller Profile handle for the
  // account control.
  //
  // Do not render the shell while the profile is being resolved.
  // ---------------------------------------------------------------------------

  if (isLoading) {
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
  //
  // A successful authenticated route requires a Traveller Profile because the
  // authenticated shell depends on its handle.
  //
  // Do not fabricate a handle or derive one from authentication identifiers.
  //
  // Authentication/session failures remain outside this layout's
  // responsibility.
  // ---------------------------------------------------------------------------

  if (isError || travellerProfile == null) {
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
  // The layout owns profile resolution.
  //
  // The shell remains presentation-oriented and receives only the information
  // it needs to render the authenticated application chrome.
  // ---------------------------------------------------------------------------

  return (
    <AuthenticatedShell travellerHandle={travellerProfile.handle}>
      {children}
    </AuthenticatedShell>
  );
}

