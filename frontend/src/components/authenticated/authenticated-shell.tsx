'use client';

// -----------------------------------------------------------------------------
// Path: src/components/authenticated/authenticated-shell.tsx
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Shell
// -----------------------------------------------------------------------------
//
// Responsive authenticated application shell.
//
// The shell is intentionally:
// - full-width;
// - min-width safe;
// - responsive at every viewport size;
// - free from fixed horizontal dimensions;
// - compatible with the uniformly scaling authenticated header;
// - responsible only for composition, not business logic.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type { VerificationLevel } from '@/features/verification/models/verification';

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
   * AuthenticatedAccountMenu is responsible for presenting the @ prefix.
   */
  readonly travellerHandle: string;

  /**
   * Already-resolved public TravellerProfile avatar URL.
   *
   * Asset resolution remains outside the shell.
   */
  readonly travellerAvatarUrl?: string | null;

  /**
   * Already-resolved verification level for the authenticated Identity.
   */
  readonly verificationLevel: VerificationLevel;
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedShell({
  children,
  travellerHandle,
  travellerAvatarUrl,
  verificationLevel,
}: AuthenticatedShellProps) {
  return (
    <div
      className="
        min-h-screen
        w-full
        min-w-0
        overflow-x-hidden
        bg-[var(--background-brand)]
        text-[var(--foreground)]
      "
    >
      <div
        className="
          flex
          min-h-screen
          w-full
          min-w-0
          flex-col
        "
      >
        {/* ----------------------------------------------------------------- */}
        {/* Authenticated header                                             */}
        {/* ----------------------------------------------------------------- */}

        <AuthenticatedHeader
          travellerHandle={travellerHandle}
          travellerAvatarUrl={travellerAvatarUrl}
          verificationLevel={verificationLevel}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Page content                                                      */}
        {/* ----------------------------------------------------------------- */}

        <main
          className="
            min-w-0
            w-full
            flex-1
            overflow-x-hidden
            bg-[var(--background-brand)]
          "
        >
          {children}
        </main>

        {/* ----------------------------------------------------------------- */}
        {/* Authenticated footer                                             */}
        {/* ----------------------------------------------------------------- */}

        <AuthenticatedFooter />
      </div>
    </div>
  );
}

export default AuthenticatedShell;