// -----------------------------------------------------------------------------
// sisiMove — Traveller Summary
// -----------------------------------------------------------------------------
//
// Presentation component for the public identity and trust summary of a
// traveller.
//
// Responsibilities:
// - Render the traveller's public handle and avatar.
// - Compose public trust signals.
// - Allow the parent to provide contextual trailing/secondary content.
//
// This component does not:
// - fetch traveller data;
// - resolve identities;
// - determine trust;
// - expose private contact information;
// - perform authentication or authorization.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// Public read-model values may legitimately contain null when information is
// unavailable. This component preserves that public contract at its boundary.
//
// TravellerTrust uses undefined to represent an omitted presentation value.
// Therefore nullable values are normalized here with `?? undefined` rather
// than weakening the TravellerTrust contract.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Avatar } from '../../ui';

import { cn } from '../../../foundation/utils/cn';

import { TravellerTrust } from './traveller-trust';

import type {
  TravellerVerificationLevel,
} from './traveller-verification';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerSummaryProps {
  /**
   * Public traveller handle.
   */
  readonly handle: string;

  /**
   * Public avatar URL.
   */
  readonly avatarUrl?: string | null;

  /**
   * Public verification state.
   */
  readonly verified?: boolean;

  /**
   * Public verification level.
   */
  readonly verificationLevel?:
    | TravellerVerificationLevel
    | string
    | null;

  /**
   * Public average rating.
   */
  readonly rating?: number | null;

  /**
   * Number of public ratings.
   */
  readonly ratingCount?: number | null;

  /**
   * Number of completed journeys.
   */
  readonly completedJourneys?: number | null;

  /**
   * Optional content displayed beside the traveller identity.
   */
  readonly trailingContent?: ReactNode;

  /**
   * Optional content displayed below the identity.
   */
  readonly secondaryContent?: ReactNode;

  /**
   * Avatar presentation size.
   */
  readonly avatarSize?: 'sm' | 'md' | 'lg';

  /**
   * Whether the trust summary should be displayed.
   */
  readonly showTrust?: boolean;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerSummary({
  handle,
  avatarUrl,
  verified = false,
  verificationLevel = verified
    ? 'VERIFIED'
    : 'NONE',
  rating = null,
  ratingCount = 0,
  completedJourneys = 0,
  trailingContent,
  secondaryContent,
  avatarSize = 'md',
  showTrust = true,
  className,
}: TravellerSummaryProps) {
  const normalizedHandle = handle.trim();

  if (!normalizedHandle) {
    return null;
  }

  const avatarAlt =
    `@${normalizedHandle}'s profile photo`;

  return (
    <div
      className={cn(
        'flex',
        'min-w-0',
        'items-start',
        'gap-3',
        className,
      )}
    >
      <Avatar
        src={avatarUrl}
        alt={avatarAlt}
        fallback={normalizedHandle}
        size={avatarSize}
      />

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'flex',
            'items-start',
            'justify-between',
            'gap-3',
          )}
        >
          <div className="min-w-0">
            <p
              className={cn(
                'truncate',
                'text-sm',
                'font-semibold',
                'text-[var(--foreground)]',
              )}
            >
              @{normalizedHandle}
            </p>

            {showTrust && (
              <div className="mt-2">
                <TravellerTrust
                  verified={verified}
                  verificationLevel={verificationLevel}
                  rating={rating ?? undefined}
                  ratingCount={ratingCount ?? undefined}
                  completedJourneys={
                    completedJourneys ?? undefined
                  }
                />
              </div>
            )}
          </div>

          {trailingContent && (
            <div className="shrink-0">
              {trailingContent}
            </div>
          )}
        </div>

        {secondaryContent && (
          <div className="mt-2">
            {secondaryContent}
          </div>
        )}
      </div>
    </div>
  );
}

