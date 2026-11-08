
'use client';

// -----------------------------------------------------------------------------
// Path: src/components/authenticated/authenticated-shell.tsx
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Shell
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
  readonly children: ReactNode;

  readonly travellerHandle: string;

  readonly travellerAvatarUrl?: string | null;

  readonly verificationLevel: VerificationLevel;

  /**
   * Available wallet balance in integer minor units.
   *
   * Null means the balance is loading or unavailable.
   */
  readonly availableAmount: number | null;
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedShell({
  children,
  travellerHandle,
  travellerAvatarUrl,
  verificationLevel,
  availableAmount,
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
      <div className="flex min-h-screen w-full min-w-0 flex-col">

        <AuthenticatedHeader
          travellerHandle={travellerHandle}
          travellerAvatarUrl={travellerAvatarUrl}
          verificationLevel={verificationLevel}
          availableAmount={availableAmount}
        />

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

        <AuthenticatedFooter />

      </div>
    </div>
  );
}

export default AuthenticatedShell;
