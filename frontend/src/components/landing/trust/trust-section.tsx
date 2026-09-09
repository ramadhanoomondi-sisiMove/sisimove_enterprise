// src/components/landing/trust/trust-section.tsx

// -----------------------------------------------------------------------------
// sisiMove — Landing Trust Section
// -----------------------------------------------------------------------------
//
// Public landing-page Trust section.
//
// Responsibilities:
// - Present the public Trust section.
// - Present the four high-level Trust signals used by SisiMove.
// - Compose presentation-only Trust signal components.
// - Allow the landing page to replace individual signals or the entire
//   presentation.
//
// This component does not:
// - fetch Trust data;
// - access Trust APIs;
// - calculate Trust;
// - access Identity data;
// - access Booking data;
// - access Financial data;
// - determine verification eligibility;
// - award Trust badges;
// - expose private Trust information.
//
// Important distinction:
// - TrustSignal represents a landing-page presentation concept.
// - TrustBadge belongs to the Trust feature and represents an actual
//   traveller Trust badge.
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
// Trust Section Header
// -----------------------------------------------------------------------------

import {
  TrustSectionHeader,
  type TrustSectionHeaderProps,
} from './trust-section-header';

// -----------------------------------------------------------------------------
// Verification Summary
// -----------------------------------------------------------------------------

import {
  VerificationSummary,
  type VerificationSummaryProps,
} from './verification-summary';

// -----------------------------------------------------------------------------
// Rating Summary
// -----------------------------------------------------------------------------

import {
  RatingSummary,
  type RatingSummaryProps,
} from './rating-summary';

// -----------------------------------------------------------------------------
// Journey History Summary
// -----------------------------------------------------------------------------

import {
  JourneyHistorySummary,
  type JourneyHistorySummaryProps,
} from './journey-history-summary';

// -----------------------------------------------------------------------------
// Trust Signal List
// -----------------------------------------------------------------------------

import {
  TrustSignalList,
  type TrustSignal,
} from './trust-signal-list';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TrustSectionProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'title' | 'content'
  > {
  /**
   * Optional custom section header.
   *
   * When supplied, headerProps and headingId are not applied to the custom
   * content. The caller is responsible for providing an accessible heading.
   */
  headerContent?: ReactNode;

  /**
   * Header configuration used when headerContent is not supplied.
   */
  headerProps?: Omit<
    TrustSectionHeaderProps,
    'headingId'
  >;

  /**
   * Public verification Trust signal.
   */
  verification?: VerificationSummaryProps;

  /**
   * Public rating Trust signal.
   */
  rating?: RatingSummaryProps;

  /**
   * Public journey-history Trust signal.
   */
  journeyHistory?: JourneyHistorySummaryProps;

  /**
   * Landing-page Trust signals.
   *
   * These are presentation concepts and are intentionally separate from
   * Trust domain badges.
   */
  signals?: readonly TrustSignal[];

  /**
   * Optional replacement content for the complete Trust signal area.
   */
  content?: ReactNode;

  /**
   * Optional action displayed below the Trust content.
   */
  actionContent?: ReactNode;

  /**
   * Heading ID used by the section accessibility relationship.
   */
  headingId?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_TRUST_SIGNALS: readonly TrustSignal[] = [
  {
    id: 'verified-identity',
    label: 'Verified identity',
    description:
      'Know that the people you meet have completed identity verification.',
    active: true,
  },
  {
    id: 'completed-journey-ratings',
    label: 'Ratings from completed journeys',
    description:
      'Ratings come from journeys completed through SisiMove.',
    active: true,
  },
  {
    id: 'journey-history',
    label: 'Journey history',
    description:
      'See meaningful experience built through completed journeys.',
    active: true,
  },
  {
    id: 'trust-badges',
    label: 'Trust badges',
    description:
      'Clear signals help you make better decisions before sharing a journey.',
    active: true,
  },
];

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustSection({
  headerContent,
  headerProps,
  verification,
  rating,
  journeyHistory,
  signals = DEFAULT_TRUST_SIGNALS,
  content,
  actionContent,
  headingId = 'trust-heading',
  className,
  ...props
}: TrustSectionProps) {
  const resolvedVerification =
    verification ?? {};

  const resolvedRating =
    rating ?? {};

  const resolvedJourneyHistory =
    journeyHistory ?? {};

  return (
    <section
      id="trust"
      aria-labelledby={headingId}
      className={cn(
        'section',
        className,
      )}
      {...props}
    >
      <div className="page-container">
        {headerContent ?? (
          <TrustSectionHeader
            {...headerProps}
            headingId={headingId}
          />
        )}

        {content ?? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <VerificationSummary
                {...resolvedVerification}
              />

              <RatingSummary
                {...resolvedRating}
              />

              <JourneyHistorySummary
                {...resolvedJourneyHistory}
              />
            </div>

            <div
              className={cn(
                'rounded-2xl',
                'border border-neutral-200',
                'bg-neutral-50',
                'p-6 sm:p-8',
              )}
            >
              <TrustSignalList
                signals={signals}
              />
            </div>
          </div>
        )}

        {actionContent ? (
          <div className="mt-8 flex justify-center">
            {actionContent}
          </div>
        ) : null}
      </div>
    </section>
  );
}