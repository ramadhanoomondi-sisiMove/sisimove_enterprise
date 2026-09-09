// -----------------------------------------------------------------------------
// sisiMove — Traveller Verification
// -----------------------------------------------------------------------------
//
// Presentation component for the public verification portion of traveller
// trust.
//
// Responsibilities:
// - Render the public verification state supplied by the trust projection.
// - Present verified travellers consistently across discovery surfaces.
// - Optionally render an explicit unverified state when requested.
//
// This component does not:
// - determine verification eligibility;
// - inspect verification evidence;
// - perform verification checks;
// - call APIs;
// - contain authentication or authorization logic.
//
// The verification state is server-authoritative.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  Badge,
  type BadgeSize,
} from '../../ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerVerificationLevel =
  | 'NONE'
  | 'BASIC'
  | 'VERIFIED';

export interface TravellerVerificationProps {
  /**
   * Public verification state supplied by the Trust projection.
   */
  readonly verified?: boolean;

  /**
   * Public verification level supplied by the Trust projection.
   */
  readonly level?: TravellerVerificationLevel | string | null;

  /**
   * Optional custom label.
   */
  readonly label?: ReactNode;

  /**
   * Whether to explicitly render an unverified state.
   *
   * Defaults to false so the normal public discovery experience
   * does not emphasize the absence of verification.
   */
  readonly showUnverified?: boolean;

  /**
   * Badge presentation size.
   */
  readonly size?: BadgeSize;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getVerificationLabel(
  verified: boolean,
  level: TravellerVerificationLevel | string | null | undefined,
): string {
  if (!verified || !level || level === 'NONE') {
    return 'Not verified';
  }

  switch (level) {
    case 'BASIC':
      return 'Basic verification';

    case 'VERIFIED':
      return 'Verified traveller';

    default:
      return 'Verified traveller';
  }
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function UnverifiedIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="h-3.5 w-3.5"
    >
      <circle
        cx="8"
        cy="8"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M5.75 5.75 10.25 10.25M10.25 5.75 5.75 10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="h-3.5 w-3.5"
    >
      <path
        d="M8 1.75 12.5 3.5v3.75c0 2.8-1.85 5.35-4.5 6.25-2.65-.9-4.5-3.45-4.5-6.25V3.5L8 1.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="m5.75 7.75 1.5 1.5 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerVerification({
  verified = false,
  level = verified ? 'VERIFIED' : 'NONE',
  label,
  showUnverified = false,
  size = 'sm',
}: TravellerVerificationProps) {
  if (!verified && !showUnverified) {
    return null;
  }

  const resolvedLabel =
    label ??
    getVerificationLabel(
      verified,
      level,
    );

  if (!verified) {
    return (
      <Badge
        variant="outline"
        size={size}
        leadingContent={<UnverifiedIcon />}
      >
        {resolvedLabel}
      </Badge>
    );
  }

  return (
    <Badge
      variant="brand"
      size={size}
      leadingContent={<VerifiedIcon />}
    >
      {resolvedLabel}
    </Badge>
  );
}