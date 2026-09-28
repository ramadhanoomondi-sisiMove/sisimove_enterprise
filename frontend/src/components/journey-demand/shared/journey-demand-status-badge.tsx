// src/features/journey-demands/components/shared/journey-demand-status-badge.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Status Badge
// -----------------------------------------------------------------------------
//
// Compact presentation component for public Journey Demand status.
//
// Responsibilities:
// - Map the public status model to a design-system Badge.
// - Present status wording consistently.
//
// This component does NOT:
// - perform queries;
// - perform mutations;
// - determine status;
// - transition a Journey Demand;
// - infer capabilities.
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

import type { PublicJourneyDemandStatus } from '@/features/journey-demand/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandStatusBadgeProps {
  /**
   * Public Journey Demand status supplied by the backend read model.
   */
  readonly status: PublicJourneyDemandStatus;

  /**
   * Optional additional classes for the Badge.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

interface JourneyDemandStatusPresentation {
  readonly label: string;
  readonly variant:
    | 'default'
    | 'brand'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline';
}

const STATUS_PRESENTATION: Record<
  PublicJourneyDemandStatus,
  JourneyDemandStatusPresentation
> = {
  OPEN: {
    label: 'Open',
    variant: 'brand',
  },

  MATCHED: {
    label: 'Matched',
    variant: 'brand',
  },

  CONVERTED: {
    label: 'Converted',
    variant: 'success',
  },

  FULFILLED: {
    label: 'Fulfilled',
    variant: 'success',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandStatusBadge({
  status,
  className,
}: JourneyDemandStatusBadgeProps) {
  const presentation = STATUS_PRESENTATION[status];

  return (
    <Badge
      variant={presentation.variant}
      size="sm"
      className={className}
    >
      {presentation.label}
    </Badge>
  );
}
