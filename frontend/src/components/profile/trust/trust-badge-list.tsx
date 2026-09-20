// -----------------------------------------------------------------------------
// sisiMove — Trust Badge List
// -----------------------------------------------------------------------------
//
// Presentational list of active Trust badges awarded to the traveller.
//
// Responsibilities:
// - Render the supplied public badge information.
// - Render badge name and optional description.
// - Render badge artwork when the frontend model provides it.
//
// Non-responsibilities:
// - Fetching badges.
// - Determining whether a badge is active.
// - Joining TrustBadge and TrustProfileBadge.
// - Constructing asset URLs.
// - Applying Trust business rules.
//
// Those concerns belong to the Trust API/domain boundary.
//
// Architectural note:
// - The authenticated profile consumes TravellerTrust.
// - TravellerTrust embeds the safe PublicTrustBadge representation.
// - Internal Trust badge-definition and badge-assignment models remain behind
//   the Trust boundary.
//
// Visual language:
// - Compact badge collection.
// - White badge surfaces with subtle borders.
// - Brand-accented artwork container.
// - Suitable for both mobile wrapping and desktop presentation.
// - Badge content remains presentation-only.
//
// -----------------------------------------------------------------------------

import Image from 'next/image';
import type { ReactNode } from 'react';

import type { TravellerTrust } from '@/features/trust/models/traveller-trust';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustBadgeListProps {
  readonly badges: TravellerTrust['badges'];
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustBadgeList({
  badges,
}: TrustBadgeListProps): ReactNode {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap gap-2"
      aria-label="Trust badges"
    >
      {badges.map((badge) => (
        <div
          key={badge.publicId}
          className={[
            'inline-flex min-w-0 items-center gap-2',
            'rounded-[var(--radius-full)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'px-3 py-2',
            'shadow-[var(--shadow-sm)]',
          ].join(' ')}
          title={badge.description ?? undefined}
        >
          {/* -----------------------------------------------------------------
              Badge Artwork
              ----------------------------------------------------------------- */}

          {badge.asset !== null ? (
            <span
              aria-hidden="true"
              className={[
                'relative size-6 shrink-0 overflow-hidden',
                'rounded-full',
                'border border-[var(--border-subtle)]',
                'bg-[var(--brand-soft)]',
              ].join(' ')}
            >
              <Image
                src={badge.asset.url}
                alt={badge.asset.alt ?? ''}
                fill
                sizes="24px"
                className="object-cover"
              />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={[
                'flex size-6 shrink-0 items-center justify-center',
                'rounded-full',
                'bg-[var(--brand-soft)]',
                'text-xs font-semibold text-[var(--brand)]',
              ].join(' ')}
            >
              ✓
            </span>
          )}

          {/* -----------------------------------------------------------------
              Badge Content
              ----------------------------------------------------------------- */}

          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-[var(--foreground)]">
              {badge.name}
            </span>

            {badge.description ? (
              <span className="block max-w-[18rem] truncate text-xs text-[var(--foreground-muted)]">
                {badge.description}
              </span>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}