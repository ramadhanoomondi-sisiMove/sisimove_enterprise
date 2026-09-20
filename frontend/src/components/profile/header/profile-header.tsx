// -----------------------------------------------------------------------------
// sisiMove — Profile Header
// -----------------------------------------------------------------------------
//
// Authenticated profile identity header.
//
// Responsibilities:
// - Display the traveller avatar.
// - Display the public handle beneath the avatar.
// - Display the traveller's country.
// - Display account/profile status.
// - Display the optional profile visibility description.
// - Provide the presentation-level avatar photo action.
//
// Non-responsibilities:
// - Fetching traveller data.
// - Uploading profile photos.
// - Persisting profile changes.
// - Determining verification or account status.
//
// The parent/profile workflow owns those concerns.
//
// Visual language:
// - Compact mobile-first identity layout.
// - Large avatar establishes a strong primary identity anchor.
// - Camera action sits outside the avatar edge rather than covering the photo.
// - Public handle sits directly beneath the avatar.
// - Active status uses the semantic success treatment.
// - Supporting identity information remains secondary and restrained.
// - White surface with subtle border and restrained shadow.
//
// Architectural boundary:
//
// ProfileHeader
//     │
//     ├── ProfileAvatar
//     │
//     └── traveller identity presentation
//
// The component receives already-resolved display values from its parent.
// It does not fetch profile data, resolve asset URLs, or determine status.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { ProfileAvatar } from './profile-avatar';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ProfileHeaderProps {
  readonly handle: string;
  readonly country: string;
  readonly status: string;
  readonly avatarUrl?: string | null;
  readonly avatarAlt?: string;
  readonly avatarFallback?: string;
  readonly visibilityDescription?: string;
  readonly onChangePhoto?: () => void;
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function CameraIcon(): ReactNode {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M14.5 4.5h-5L8 7H5.5A2.5 2.5 0 0 0 3 9.5v8A2.5 2.5 0 0 0 5.5 20h13a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 18.5 7H16l-1.5-2.5Z" />
      <circle cx="12" cy="13.5" r="3.25" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Profile Header
// -----------------------------------------------------------------------------

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
  const isActive = status.trim().toUpperCase() === 'ACTIVE';

  return (
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          {/* -----------------------------------------------------------------
              Primary traveller identity
             ----------------------------------------------------------------- */}

          <div className="flex shrink-0 flex-col items-center">
            {/* ---------------------------------------------------------------
                Large avatar

                The camera control is deliberately positioned outside the
                avatar boundary so the traveller photo remains unobstructed.
               --------------------------------------------------------------- */}

            <div className="relative">
              <ProfileAvatar
                src={avatarUrl}
                alt={avatarAlt}
                fallback={avatarFallback ?? handle}
                size="2xl"
              />

              {onChangePhoto !== undefined ? (
                <button
                  type="button"
                  onClick={onChangePhoto}
                  aria-label="Change profile photo"
                  title="Change profile photo"
                  className="
                    absolute
                    -bottom-2
                    -right-2
                    inline-flex
                    size-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    text-[var(--foreground-secondary)]
                    shadow-[var(--shadow-md)]
                    transition-colors
                    hover:border-[var(--brand)]
                    hover:bg-[var(--brand-soft)]
                    hover:text-[var(--brand)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--brand)]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--surface)]
                  "
                >
                  <CameraIcon />
                </button>
              ) : null}
            </div>

            {/* ---------------------------------------------------------------
                Public handle

                The green indicator communicates the supplied ACTIVE state.
                It is presentation only and does not determine account state.
               --------------------------------------------------------------- */}

            <div className="mt-3 flex max-w-full items-center gap-1.5">
              <span
                aria-hidden="true"
                className={[
                  'size-2 shrink-0 rounded-full',
                  isActive
                    ? 'bg-[var(--success)]'
                    : 'bg-[var(--foreground-subtle)]',
                ].join(' ')}
              />

              <h2 className="max-w-[16rem] truncate text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg">
                @{handle}
              </h2>
            </div>
          </div>

          {/* -----------------------------------------------------------------
              Supporting profile identity
             ----------------------------------------------------------------- */}

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {/* -------------------------------------------------------------
                  Profile status
                 ------------------------------------------------------------- */}

              <span
                className={[
                  'inline-flex items-center gap-1.5',
                  'rounded-full border px-2.5 py-1',
                  'text-xs font-medium leading-none whitespace-nowrap',
                  isActive
                    ? 'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]'
                    : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'size-1.5 shrink-0 rounded-full',
                    isActive
                      ? 'bg-[var(--success)]'
                      : 'bg-[var(--foreground-subtle)]',
                  ].join(' ')}
                />

                {status}
              </span>
            </div>

            {/* ---------------------------------------------------------------
                Country
               --------------------------------------------------------------- */}

            <p className="mt-1.5 text-sm text-[var(--foreground-muted)]">
              {country}
            </p>

            {/* ---------------------------------------------------------------
                Optional visibility description
               --------------------------------------------------------------- */}

            {visibilityDescription !== undefined ? (
              <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-5 text-[var(--foreground-muted)] sm:mx-0">
                {visibilityDescription}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}