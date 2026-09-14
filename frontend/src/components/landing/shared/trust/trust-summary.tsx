// -----------------------------------------------------------------------------
// sisiMove — Trust Summary
// -----------------------------------------------------------------------------
//
// Composite public trust presentation component.
//
// This component combines:
//
// - VerificationBadge;
// - RatingSummary;
// - completed journey statistics;
// - active public trust badges.
//
// It intentionally receives the already-resolved PublicTravellerTrust model
// and performs no API requests.
//
// -----------------------------------------------------------------------------

import type { PublicTravellerTrust } from "@/features/trust/models";

import { RatingSummary } from "./rating-summary";
import { VerificationBadge } from "./verification-badge";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TrustSummaryProps {
  /**
   * Public traveller trust read model.
   */
  trust: PublicTravellerTrust;

  /**
   * Whether to display awarded trust badges.
   *
   * Defaults to true.
   */
  showBadges?: boolean;

  /**
   * Optional additional class name.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustSummary({
  trust,
  showBadges = true,
  className,
}: TrustSummaryProps) {
  return (
    <div className={className ?? "space-y-2"}>
      <div className="flex flex-wrap items-center gap-2">
        <VerificationBadge
          verificationLevel={trust.verificationLevel}
        />

        <RatingSummary
          ratingAverage={trust.ratingAverage}
          ratingCount={trust.ratingCount}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {trust.completedJourneys.toLocaleString()} completed{" "}
        {trust.completedJourneys === 1 ? "journey" : "journeys"}
      </p>

      {showBadges && trust.badges.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {trust.badges.map((badge) => (
            <span
              key={badge.publicId}
              className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              title={badge.description ?? badge.name}
            >
              {badge.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}