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
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <div
          key={badge.publicId}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5"
        >
          {badge.asset !== null ? (
            <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
              <Image
                src={badge.asset.url}
                alt={badge.asset.alt ?? ''}
                fill
                sizes="20px"
                className="object-cover"
              />
            </span>
          ) : null}

          <span className="text-sm font-medium">
            {badge.name}
          </span>
        </div>
      ))}
    </div>
  );
}