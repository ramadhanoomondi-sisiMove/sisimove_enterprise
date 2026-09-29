// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/journey-demand-list.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Public Journey Demand List
//
// Dense public marketplace collection for Journey Demand projections.
//
// Responsibilities:
// - render an ordered collection of PublicJourneyDemand projections;
// - compose JourneyDemandCard for each item;
// - preserve parent-supplied ordering;
// - forward View, Share, and Join actions;
// - preserve per-demand Join loading state;
// - provide compact marketplace spacing.
//
// Non-responsibilities:
// - no data fetching;
// - no filtering;
// - no sorting;
// - no pagination;
// - no loading/error/empty-state ownership;
// - no navigation;
// - no lifecycle logic;
// - no public projection transformation.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from "@/features/journey-demand/models";

import { JourneyDemandCard } from "./journey-demand-card";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandListProps {
  /**
   * Public Journey Demand projections supplied by the marketplace parent.
   *
   * The supplied order is preserved exactly.
   */
  readonly demands: readonly PublicJourneyDemand[];

  /**
   * Optional additional classes for the collection container.
   */
  readonly className?: string;

  /**
   * Controls card information density.
   *
   * Compact is the default marketplace presentation.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * View action supplied by the marketplace parent.
   */
  readonly onView: (demandPublicId: string) => void;

  /**
   * Share action supplied by the marketplace parent.
   */
  readonly onShare: (demandPublicId: string) => void;

  /**
   * Join action supplied by the marketplace parent.
   */
  readonly onJoin: (demandPublicId: string) => void;

  /**
   * Optional disabled state for View actions.
   */
  readonly viewDisabled?: boolean;

  /**
   * Optional disabled state for Share actions.
   */
  readonly shareDisabled?: boolean;

  /**
   * Optional disabled state for Join actions.
   */
  readonly joinDisabled?: boolean;

  /**
   * Optional View action label.
   */
  readonly viewLabel?: string;

  /**
   * Optional Share action label.
   */
  readonly shareLabel?: string;

  /**
   * Optional Join action label.
   */
  readonly joinLabel?: string;

  /**
   * Optional Join loading label.
   */
  readonly joiningLabel?: string;

  /**
   * Public ID of the Journey Demand currently being joined.
   *
   * Only the matching card receives its joining state.
   */
  readonly joiningDemandPublicId?: string | null;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandList({
  demands,
  className,
  emphasis = "compact",
  onView,
  onShare,
  onJoin,
  viewDisabled = false,
  shareDisabled = false,
  joinDisabled = false,
  viewLabel = "View",
  shareLabel = "Share",
  joinLabel = "Join Demand",
  joiningLabel = "Joining…",
  joiningDemandPublicId = null,
}: JourneyDemandListProps) {
  return (
    <div
      className={[
        "w-full",
        "space-y-2",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {demands.map((demand) => {
        const demandPublicId = demand.publicId;

        const handleView = (): void => {
          onView(demandPublicId);
        };

        const handleShare = (): void => {
          onShare(demandPublicId);
        };

        const handleJoin = (): void => {
          onJoin(demandPublicId);
        };

        return (
          <JourneyDemandCard
            key={demandPublicId}
            demand={demand}
            emphasis={emphasis}
            onView={handleView}
            onShare={handleShare}
            onJoin={handleJoin}
            isJoining={
              joiningDemandPublicId === demandPublicId
            }
            viewDisabled={viewDisabled}
            shareDisabled={shareDisabled}
            joinDisabled={joinDisabled}
            viewLabel={viewLabel}
            shareLabel={shareLabel}
            joinLabel={joinLabel}
            joiningLabel={joiningLabel}
          />
        );
      })}
    </div>
  );
}