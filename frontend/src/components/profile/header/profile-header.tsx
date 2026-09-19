// -----------------------------------------------------------------------------
// sisiMove — Profile Header
// -----------------------------------------------------------------------------
//
// Authenticated profile header displaying the traveller's primary identity.
//
// Responsibilities:
// - Display the traveller avatar.
// - Display the public handle and basic profile identity.
// - Display account/profile status.
// - Provide the presentation-level Change photo action.
//
// Non-responsibilities:
// - Fetching traveller data.
// - Uploading profile photos.
// - Persisting profile changes.
// - Determining verification or account status.
//
// The parent/profile workflow owns those concerns.
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { ProfileAvatar } from './profile-avatar';

export interface ProfileHeaderProps {
  handle: string;
  country: string;
  status: string;
  avatarUrl?: string | null;
  avatarAlt?: string;
  avatarFallback?: string;
  visibilityDescription?: string;
  onChangePhoto?: () => void;
}

export function ProfileHeader({
  handle,
  country,
  status,
  avatarUrl,
  avatarAlt = '',
  avatarFallback,
  visibilityDescription,
  onChangePhoto,
}: ProfileHeaderProps): ReactNode {
  return (
    <div className="rounded-xl border border-border bg-background p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <ProfileAvatar
          src={avatarUrl}
          alt={avatarAlt}
          fallback={avatarFallback ?? handle}
          size="xl"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              @{handle}
            </h2>

            <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {status}
            </span>
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            {country}
          </div>

          {visibilityDescription !== undefined ? (
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {visibilityDescription}
            </p>
          ) : null}
        </div>

        {onChangePhoto !== undefined ? (
          <button
            type="button"
            onClick={onChangePhoto}
            className="shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Change photo
          </button>
        ) : null}
      </div>
    </div>
  );
}