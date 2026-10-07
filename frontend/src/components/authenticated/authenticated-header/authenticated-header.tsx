'use client';

// -----------------------------------------------------------------------------
// Path: src/components/navigation/authenticated-header.tsx
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Header
// -----------------------------------------------------------------------------
//
// Responsive authenticated header.
//
// The header scales uniformly across viewport sizes:
// - header height scales down;
// - horizontal padding scales down;
// - logo/navigation spacing scales down;
// - utility spacing scales down;
// - navigation remains shrinkable;
// - no fixed-width element is allowed to force overflow;
// - existing component responsibilities and behavior are unchanged.
//
// -----------------------------------------------------------------------------

import type { VerificationLevel } from '@/features/verification/models/verification';

import { AuthenticatedAccountMenu } from './authenticated-account-menu';
import { AuthenticatedLogo } from './authenticated-logo';
import { AuthenticatedNavigation } from './authenticated-navigation';
import { AuthenticatedNotifications } from './authenticated-notifications';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface AuthenticatedHeaderProps {
  /**
   * Public traveller handle displayed by the authenticated account menu.
   */
  readonly travellerHandle: string;

  /**
   * Already-resolved public Asset URL for the traveller avatar.
   *
   * The header does not resolve or fetch the asset itself.
   */
  readonly travellerAvatarUrl?: string | null;

  /**
   * Already-resolved verification level for the authenticated Identity.
   *
   * The header does not fetch Verification or determine authorization.
   */
  readonly verificationLevel: VerificationLevel;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AuthenticatedHeader({
  travellerHandle,
  travellerAvatarUrl,
  verificationLevel,
}: AuthenticatedHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div
        className="
          mx-auto
          flex
          min-h-[clamp(2.75rem,7vw,4rem)]
          w-full
          max-w-7xl
          min-w-0
          items-center
          gap-[clamp(0.25rem,1vw,0.75rem)]
          px-[clamp(0.5rem,2.5vw,2rem)]
        "
      >
        {/* ----------------------------------------------------------------- */}
        {/* Primary authenticated navigation                                 */}
        {/* ----------------------------------------------------------------- */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-[clamp(0.35rem,1.5vw,1.5rem)]
            overflow-hidden
          "
        >
          <div className="min-w-0 shrink">
            <AuthenticatedLogo />
          </div>

          <div
            className="
              min-w-0
              flex-1
              overflow-hidden
            "
          >
            <AuthenticatedNavigation
              verificationLevel={verificationLevel}
            />
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Authenticated utilities                                           */}
        {/* ----------------------------------------------------------------- */}

        <div
          className="
            flex
            min-w-0
            shrink
            items-center
            gap-[clamp(0.15rem,0.6vw,0.5rem)]
          "
        >
          {/*
           * Notification behavior belongs to the notification feature.
           */}
          <div className="min-w-0 shrink">
            <AuthenticatedNotifications />
          </div>

          {/*
           * Account behavior belongs to the authenticated account menu.
           */}
          <div className="min-w-0 shrink">
            <AuthenticatedAccountMenu
              travellerHandle={travellerHandle}
              avatarSrc={travellerAvatarUrl}
            />
          </div>
        </div>
      </div>
    </header>
  );
}