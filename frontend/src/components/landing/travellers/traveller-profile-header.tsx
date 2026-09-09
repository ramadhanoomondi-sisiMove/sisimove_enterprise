// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Header
// -----------------------------------------------------------------------------
//
// Presentation component for the public Traveller Profile header.
//
// Responsibilities:
// - Present traveller avatar.
// - Present display name.
// - Present social handle.
// - Present biography.
// - Present public profile visibility state.
//
// Non-responsibilities:
// - No API calls.
// - No authentication logic.
// - No authorization logic.
// - No Trust logic.
// - No verification rendering.
// - No ratings.
// - No journey history.
// - No business rules.
//
// Trust information belongs to the dedicated Trust feature and should be
// composed separately by the page/container.
//
// -----------------------------------------------------------------------------

import Image from 'next/image';

import type {
  TravellerProfile,
} from '@/features/traveller-profile';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const AVATAR_SIZE = 96;

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerProfileHeaderProps {
  profile: TravellerProfile;
}

// -----------------------------------------------------------------------------
// Avatar
// -----------------------------------------------------------------------------

interface TravellerProfileAvatarProps {
  profile: TravellerProfile;
}

function TravellerProfileAvatar({
  profile,
}: TravellerProfileAvatarProps) {
  const fallbackInitial =
    profile.displayName
      .trim()
      .charAt(0)
      .toUpperCase();

  if (profile.avatarUrl) {
    return (
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-1 ring-neutral-200">
        <Image
          src={profile.avatarUrl}
          alt={`${profile.displayName}'s profile`}
          fill
          sizes={`${AVATAR_SIZE}px`}
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-2xl font-semibold text-neutral-600 ring-1 ring-neutral-200"
    >
      {fallbackInitial}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerProfileHeader({
  profile,
}: TravellerProfileHeaderProps) {
  return (
    <header className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* ----------------------------------------------------------------- */}
        {/* Avatar                                                            */}
        {/* ----------------------------------------------------------------- */}

        <TravellerProfileAvatar
          profile={profile}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Identity                                                          */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              {profile.displayName}
            </h1>

            {!profile.isPublic ? (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                Private
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-sm text-neutral-500">
            @{profile.handle}
          </p>

          {/* ------------------------------------------------------------- */}
          {/* Biography                                                      */}
          {/* ------------------------------------------------------------- */}

          {profile.bio ? (
            <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-6 text-neutral-700 sm:text-base">
              {profile.bio}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}