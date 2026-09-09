// -----------------------------------------------------------------------------
// sisiMove — Traveller Trust
// -----------------------------------------------------------------------------
//
// Presentation component for the public trust signals of a traveller.
//
// Responsibilities:
// - Compose public verification, rating, and journey-history signals.
// - Provide a consistent trust presentation across traveller surfaces.
// - Allow individual trust signals to be shown or hidden by the parent.
//
// This component does not:
// - calculate trust;
// - determine verification eligibility;
// - calculate ratings;
// - infer journey completion;
// - access private trust or moderation information.
//
// All trust values are server-authoritative public projections.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '../../../foundation/utils/cn';

import {
  TravellerRating,
} from './traveller-rating';

import {
  TravellerVerification,
  type TravellerVerificationLevel,
} from './traveller-verification';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerTrustProps {
  /**
   * Public verification state.
   */
  readonly verified?: boolean;

  /**
   * Public verification level.
   *
   * This value is supplied by the public Trust projection.
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
  readonly ratingCount?: number;

  /**
   * Number of completed journeys.
   */
  readonly completedJourneys?: number;

  /**
   * Whether to display verification.
   */
  readonly showVerification?: boolean;

  /**
   * Whether to display rating.
   */
  readonly showRating?: boolean;

  /**
   * Whether to display completed journey history.
   */
  readonly showJourneyHistory?: boolean;

  /**
   * Optional custom content rendered before trust signals.
   */
  readonly leadingContent?: ReactNode;

  /**
   * Presentation size.
   */
  readonly size?: 'sm' | 'md';

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeCount(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return Math.floor(value);
}

// -----------------------------------------------------------------------------
// Completed Journey Icon
// -----------------------------------------------------------------------------

function CompletedJourneyIcon({
  size,
}: {
  readonly size: 'sm' | 'md';
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={
        size === 'sm'
          ? 'h-3.5 w-3.5 shrink-0'
          : 'h-4 w-4 shrink-0'
      }
    >
      <path
        d="M10 3.25v6.75l4.25 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerTrust({
  verified = false,
  verificationLevel = verified
    ? 'VERIFIED'
    : 'NONE',
  rating = null,
  ratingCount = 0,
  completedJourneys = 0,
  showVerification = true,
  showRating = true,
  showJourneyHistory = true,
  leadingContent,
  size = 'sm',
  className,
}: TravellerTrustProps) {
  const normalizedJourneys =
    normalizeCount(completedJourneys);

  const hasVerification =
    showVerification &&
    verified;

  const hasRating =
    showRating &&
    (
      rating !== null ||
      ratingCount > 0
    );

  const hasJourneyHistory =
    showJourneyHistory &&
    normalizedJourneys > 0;

  const hasTrustSignals =
    hasVerification ||
    hasRating ||
    hasJourneyHistory;

  if (
    !hasTrustSignals &&
    !leadingContent
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex',
        'flex-wrap',
        'items-center',
        'gap-x-3',
        'gap-y-2',
        className,
      )}
    >
      {leadingContent}

      {hasVerification && (
        <TravellerVerification
          verified
          level={verificationLevel}
          size={size}
        />
      )}

      {hasRating && (
        <TravellerRating
          score={rating}
          count={ratingCount}
          size={size}
        />
      )}

      {hasJourneyHistory && (
        <span
          className={cn(
            'inline-flex',
            'items-center',
            'gap-1.5',
            'whitespace-nowrap',
            size === 'sm'
              ? 'text-xs'
              : 'text-sm',
            'text-[var(--foreground-muted)]',
          )}
        >
          <CompletedJourneyIcon
            size={size}
          />

          <span>
            <span className="font-semibold text-[var(--foreground)]">
              {normalizedJourneys}
            </span>{' '}
            {normalizedJourneys === 1
              ? 'completed journey'
              : 'completed journeys'}
          </span>
        </span>
      )}
    </div>
  );
}