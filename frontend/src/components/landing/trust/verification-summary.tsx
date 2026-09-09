// src/components/landing/trust/verification-summary.tsx

// -----------------------------------------------------------------------------
// sisiMove — Landing Verification Summary
// -----------------------------------------------------------------------------
//
// Public landing-page Trust signal.
//
// Responsibilities:
// - Explain identity verification as a public Trust signal.
// - Present verified and not-verified states when explicitly provided.
// - Allow the landing composition to customize the presentation.
//
// This component does not:
// - fetch verification data;
// - perform verification;
// - access Identity data;
// - expose verification evidence;
// - expose verification-provider responses;
// - calculate Trust;
// - require authentication.
//
// This is presentation-only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface VerificationSummaryProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'title'
  > {
  /**
   * Whether the public Trust signal represents a verified identity.
   *
   * Defaults to true because the landing-page default presentation
   * describes the verification capability rather than a live traveller.
   */
  verified?: boolean;

  /**
   * Optional public label.
   */
  label?: ReactNode;

  /**
   * Optional public supporting description.
   */
  description?: ReactNode;

  /**
   * Optional replacement leading visual.
   */
  leadingContent?: ReactNode;

  /**
   * Optional trailing content.
   */
  trailingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Default Icons
// -----------------------------------------------------------------------------

function VerifiedIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="size-5"
      >
        <path
          d="m5 10 3 3 7-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function UnverifiedIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="size-5"
      >
        <path
          d="M10 6.5v4M10 13.5h.01M4.8 16h10.4c1.1 0 1.8-1.2 1.25-2.15L11.25 4.8c-.55-.95-1.95-.95-2.5 0l-5.2 9.05C3 14.8 3.7 16 4.8 16Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationSummary({
  verified = true,
  label,
  description,
  leadingContent,
  trailingContent,
  className,
  ...props
}: VerificationSummaryProps) {
  const resolvedLabel =
    label ??
    (verified
      ? 'Verified identity'
      : 'Identity verification');

  const resolvedDescription =
    description ??
    (verified
      ? 'Identity verification helps you know who you are travelling with.'
      : 'Identity verification has not been completed.');

  const defaultIcon = verified
    ? <VerifiedIcon />
    : <UnverifiedIcon />;

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        className,
      )}
      {...props}
    >
      {leadingContent ?? defaultIcon}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-neutral-950">
          {resolvedLabel}
        </p>

        {resolvedDescription ? (
          <p className="mt-1 text-sm leading-5 text-neutral-600">
            {resolvedDescription}
          </p>
        ) : null}
      </div>

      {trailingContent ? (
        <div className="shrink-0">
          {trailingContent}
        </div>
      ) : null}
    </div>
  );
}