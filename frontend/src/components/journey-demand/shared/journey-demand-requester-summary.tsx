// src/features/journey-demands/components/shared/journey-demand-requester-summary.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Requester Summary
// -----------------------------------------------------------------------------
//
// Compact public requester identity block used by Journey Demand marketplace
// cards and detail surfaces.
//
// Responsibilities:
// - Render the requester's public avatar.
// - Render the public @handle.
// - Render concise public trust evidence.
//
// This component does NOT:
// - fetch requester data;
// - fetch trust data;
// - perform navigation;
// - calculate trust scores;
// - infer verification state;
// - expose private identity information.
// -----------------------------------------------------------------------------

import { Avatar } from '@/components/ui';

import type { PublicJourneyDemandRequester } from '@/features/journey-demand/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandRequesterSummaryProps {
  readonly requester: PublicJourneyDemandRequester;
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getVerificationLabel(
  verificationLevel: PublicJourneyDemandRequester['trust']['verificationLevel'],
): string | null {
  switch (verificationLevel) {
    case 'HIGHLY_VERIFIED':
      return 'Highly verified';

    case 'VERIFIED':
      return 'Verified';

    case 'BASIC':
      return 'Basic verification';

    case 'NONE':
    default:
      return null;
  }
}

/**
 * Creates a short, readable avatar fallback from a public handle.
 *
 * Examples:
 * - "jane_doe" -> "JD"
 * - "jane-doe" -> "JD"
 * - "jane" -> "J"
 *
 * The fallback is intentionally derived only from the public handle.
 * It does not attempt to infer a person's real name.
 */
function getAvatarFallback(handle: string): string {
  const words = handle
    .replace(/^@+/, '')
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (words.length === 0) {
    return '?';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandRequesterSummary({
  requester,
  emphasis = 'default',
  className,
}: JourneyDemandRequesterSummaryProps) {
  const { traveller, trust } = requester;

  const handle = `@${traveller.handle}`;
  const verificationLabel = getVerificationLabel(
    trust.verificationLevel,
  );

  const avatarFallback = getAvatarFallback(traveller.handle);
  const isCompact = emphasis === 'compact';

  return (
    <div
      className={[
        'flex',
        'min-w-0',
        'items-center',
        isCompact ? 'gap-2' : 'gap-2.5',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Avatar
        src={traveller.avatar?.url}
        alt={`Avatar for ${handle}`}
        fallback={avatarFallback}
        size={isCompact ? 'sm' : 'md'}
      />

      <div className="min-w-0">
        <div
          className="truncate text-sm font-semibold text-foreground"
        >
          {handle}
        </div>

        <div
          className={[
            'mt-0.5',
            'flex',
            'min-w-0',
            'flex-wrap',
            'items-center',
            isCompact
              ? 'gap-x-1.5 gap-y-0'
              : 'gap-x-2 gap-y-0.5',
            'text-xs',
            'text-foreground-muted',
          ].join(' ')}
        >
          {verificationLabel !== null && (
            <span className="shrink-0">
              <span
                aria-hidden="true"
                className="mr-0.5 text-success"
              >
                ✓
              </span>
              {verificationLabel}
            </span>
          )}

          {trust.ratingCount > 0 && (
            <span className="shrink-0">
              <span aria-hidden="true">★</span>{' '}
              {trust.ratingAverage.toFixed(1)}
              {' · '}
              {trust.ratingCount}
            </span>
          )}

          {trust.completedJourneys > 0 && (
            <span className="shrink-0">
              {trust.completedJourneys}{' '}
              {trust.completedJourneys === 1
                ? 'journey'
                : 'journeys'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
