'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Header
// -----------------------------------------------------------------------------
//
// Composition boundary for the authenticated application shell.
//
// Responsibilities:
// - render the authenticated SisiMove logo;
// - render primary authenticated navigation;
// - render the notification control;
// - render the authenticated account menu;
// - pass already-resolved traveller presentation data to child components.
//
// Non-responsibilities:
// - fetching Identity;
// - fetching Traveller Profile;
// - fetching Assets;
// - fetching Notifications;
// - determining notification unread state;
// - performing notification mutations;
// - implementing authentication;
// - implementing logout;
// - deciding authorization;
// - resolving marketplace/domain state.
//
// Notification architecture:
// - `AuthenticatedNotifications` is the authenticated-shell adapter;
// - the notification feature owns notification fetching and unread state;
// - this header only composes the adapter;
// - notification state must not be duplicated here.
//
// Account architecture:
// - `AuthenticatedAccountMenu` owns account-menu interaction and logout;
// - this header supplies only already-resolved traveller presentation data.
//
// Import boundary:
// - sibling authenticated-header components are imported directly;
// - the local barrel is reserved for consumers of the authenticated-header
//   component family and is not used internally.
//
// The header intentionally remains a thin composition component.
// -----------------------------------------------------------------------------

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
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AuthenticatedHeader({
  travellerHandle,
  travellerAvatarUrl,
}: AuthenticatedHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center px-4 sm:min-h-16 sm:px-6 lg:px-8">
        {/* ----------------------------------------------------------------- */}
        {/* Primary authenticated navigation                                 */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex min-w-0 flex-1 items-center">
          <AuthenticatedLogo />

          <div className="ml-6 min-w-0">
            <AuthenticatedNavigation />
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Authenticated utilities                                           */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex shrink-0 items-center gap-1">
          {/*
           * Notification behavior belongs to the notification feature.
           *
           * The header does not receive an unread count and does not know
           * whether notifications are SENT, READ, PENDING, or terminal.
           */}
          <AuthenticatedNotifications />

          {/*
           * Account behavior belongs to the authenticated account menu.
           *
           * The header only forwards presentation data already resolved by
           * the authenticated shell.
           */}
          <AuthenticatedAccountMenu
            travellerHandle={travellerHandle}
            avatarSrc={travellerAvatarUrl}
          />
        </div>
      </div>
    </header>
  );
}
