// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyStatusBadge.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Status Badge
//
// Compact presentation of the authoritative Journey lifecycle status.
//
// Responsibilities:
// - Present an already-authoritative Journey status.
// - Reuse the shared sisiMove Badge design-system primitive.
// - Keep Journey-specific status labels and semantic variants in one place.
// - Add a subtle Lucide status icon without changing lifecycle semantics.
//
// This component does NOT:
// - determine lifecycle transitions;
// - perform mutations;
// - infer a Journey status;
// - recreate backend lifecycle rules.
//
// The backend remains authoritative for Journey lifecycle state.
// -----------------------------------------------------------------------------

import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  CircleDot,
  Clock3,
  Flag,
  LoaderCircle,
  UsersRound,
} from "lucide-react";

import type { JourneyStatus } from "@/features/journey/models";

import {
  Badge,
  type BadgeSize,
  type BadgeVariant,
} from "@/components/ui";

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
  readonly icon: typeof CircleDot;
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
    icon: CircleDot,
  },

  PUBLISHED: {
    label: "Published",
    variant: "brand",
    icon: BadgeCheck,
  },

  FULL: {
    label: "Full",
    variant: "warning",
    icon: UsersRound,
  },

  BOARDING: {
    label: "Boarding",
    variant: "warning",
    icon: Clock3,
  },

  IN_PROGRESS: {
    label: "In progress",
    variant: "brand",
    icon: LoaderCircle,
  },

  COMPLETION_PENDING: {
    label: "Completion pending",
    variant: "warning",
    icon: Flag,
  },

  COMPLETED: {
    label: "Completed",
    variant: "success",
    icon: CheckCircle2,
  },

  CANCELLED: {
    label: "Cancelled",
    variant: "danger",
    icon: Ban,
  },

  EXPIRED: {
    label: "Expired",
    variant: "default",
    icon: Clock3,
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

  const Icon = presentation.icon;

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
    >
      <Icon
        className="size-3 shrink-0"
        aria-hidden="true"
      />

      <span>{presentation.label}</span>
    </Badge>
  );
}