
'use client';

// -----------------------------------------------------------------------------
// Path: src/components/navigation/authenticated-header.tsx
// -----------------------------------------------------------------------------
// sisiMove — Responsive Authenticated Header
// -----------------------------------------------------------------------------
//
// Mobile:
// Row 1: Logo, wallet, notifications, account menu.
// Row 2: Verification status and authenticated navigation.
//
// Desktop:
// Logo, authenticated navigation, wallet, notifications, account menu.
//
// The header does not fetch wallet or account data.
//
// -----------------------------------------------------------------------------

import type { VerificationLevel } from '@/features/verification/models/verification';

import { AuthenticatedAccountMenu } from './authenticated-account-menu';
import { AuthenticatedLogo } from './authenticated-logo';
import { AuthenticatedNavigation } from './authenticated-navigation';
import { AuthenticatedNotifications } from './authenticated-notifications';
import { AuthenticatedWalletBalance } from './authenticated-wallet-balance';

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedHeaderProps {
  readonly travellerHandle: string;

  readonly travellerAvatarUrl?: string | null;

  readonly verificationLevel: VerificationLevel;

  /**
   * Available wallet balance in integer minor units.
   *
   * Null means loading or unavailable.
   */
  readonly availableAmount: number | null;
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedHeader({
  travellerHandle,
  travellerAvatarUrl,
  verificationLevel,
  availableAmount,
}: AuthenticatedHeaderProps) {
  return (
    <header className="
      sticky
      top-0
      z-40
      w-full
      border-b
      border-[var(--border)]
      bg-[var(--surface)]/95
      backdrop-blur
    ">

      {/* ================================================================= */}
      {/* Primary Header Row                                                 */}
      {/* ================================================================= */}

      <div className="
        mx-auto
        flex
        min-h-14
        w-full
        max-w-7xl
        min-w-0
        items-center
        justify-between
        gap-2
        px-3
        sm:px-4
        lg:min-h-16
        lg:px-6
      ">

        {/* Logo */}

        <div className="min-w-0 shrink-0">
          <AuthenticatedLogo />
        </div>

        {/* Desktop Navigation */}

        <div className="
          hidden
          min-w-0
          flex-1
          items-center
          justify-center
          overflow-hidden
          lg:flex
        ">
          <AuthenticatedNavigation
            verificationLevel={verificationLevel}
          />
        </div>

        {/* Authenticated Utilities */}

        <div className="
          flex
          min-w-0
          shrink-0
          items-center
          justify-end
          gap-1
          sm:gap-2
        ">

          {/* Wallet Balance */}

          <AuthenticatedWalletBalance
            availableAmount={availableAmount}
          />

          {/* Notifications */}

          <AuthenticatedNotifications />

          {/* Account Menu */}

          <AuthenticatedAccountMenu
            travellerHandle={travellerHandle}
            avatarSrc={travellerAvatarUrl}
          />

        </div>
      </div>

      {/* ================================================================= */}
      {/* Mobile Navigation Row                                              */}
      {/* ================================================================= */}

      <div className="
        w-full
        border-t
        border-[var(--border-subtle)]
        px-3
        py-2
        sm:px-4
        lg:hidden
      ">
        <div className="
          mx-auto
          w-full
          max-w-7xl
          min-w-0
          overflow-x-auto
          overscroll-x-contain
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        ">
          <div className="flex w-max min-w-full items-center">
            <AuthenticatedNavigation
              verificationLevel={verificationLevel}
            />
          </div>
        </div>
      </div>

    </header>
  );
}

export default AuthenticatedHeader;
