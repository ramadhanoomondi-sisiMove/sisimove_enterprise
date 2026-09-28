// -----------------------------------------------------------------------------
// sisiMove — Journey Status Badge
// -----------------------------------------------------------------------------
//
// Reusable Journey lifecycle-status presentation.
//
// Responsibilities:
// - Present an already-authoritative Journey status.
// - Reuse the shared sisiMove Badge design-system primitive.
// - Keep Journey-specific status labels and semantic variants in one place.
//
// This component does NOT:
// - determine lifecycle transitions;
// - perform mutations;
// - infer a Journey status;
// - recreate backend lifecycle rules.
//
// The backend remains authoritative for Journey lifecycle state.
// -----------------------------------------------------------------------------

import type { JourneyStatus } from "@/features/journey/models";

import { Badge, type BadgeSize, type BadgeVariant } from "@/components/ui";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyStatusBadgeProps {
  /**
   * Journey lifecycle status supplied by a Journey read projection.
   */
  readonly status: JourneyStatus;

  /**
   * Badge size.
   *
   * Defaults to `sm` for compact Journey metadata presentation.
   */
  readonly size?: BadgeSize;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

interface JourneyStatusPresentation {
  readonly label: string;
  readonly variant: BadgeVariant;
}

/**
 * Presentation-only mapping.
 *
 * This mapping describes how each backend status should look in the UI.
 * It does not encode lifecycle rules or permitted transitions.
 */
const STATUS_PRESENTATION: Record<
  JourneyStatus,
  JourneyStatusPresentation
> = {
  DRAFT: {
    label: "Draft",
    variant: "default",
  },

  PUBLISHED: {
    label: "Published",
    variant: "brand",
  },

  FULL: {
    label: "Full",
    variant: "warning",
  },

  BOARDING: {
    label: "Boarding",
    variant: "warning",
  },

  IN_PROGRESS: {
    label: "In progress",
    variant: "brand",
  },

  COMPLETION_PENDING: {
    label: "Completion pending",
    variant: "warning",
  },

  COMPLETED: {
    label: "Completed",
    variant: "success",
  },

  CANCELLED: {
    label: "Cancelled",
    variant: "danger",
  },

  EXPIRED: {
    label: "Expired",
    variant: "default",
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyStatusBadge({
  status,
  size = "sm",
  className,
}: JourneyStatusBadgeProps) {
  const presentation = STATUS_PRESENTATION[status];

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
    >
      {presentation.label}
    </Badge>
  );
}