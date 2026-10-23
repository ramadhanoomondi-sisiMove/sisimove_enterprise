
import type { ComponentProps } from 'react';

import { Badge } from '@/components/ui/badge';

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>;

export type JourneyLifecycleStage =
  | 'CREATED'
  | 'PUBLISHED'
  | 'BOARDING_OPENED'
  | 'JOURNEY_STARTED'
  | 'COMPLETION_REQUESTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'SETTLEMENT_SUBMITTED'
  | 'SETTLEMENT_PROCESSING'
  | 'SETTLEMENT_COMPLETED'
  | 'SETTLEMENT_FAILED'
  | 'SETTLEMENT_HELD'
  | 'SETTLEMENT_CANCELLED';

export interface JourneyLifecycleBadgeProps {
  stage: JourneyLifecycleStage;
  size?: 'sm' | 'md';
  className?: string;
}

interface LifecyclePresentation {
  label: string;
  variant: BadgeVariant;
}

const LIFECYCLE_PRESENTATION: Record<
  JourneyLifecycleStage,
  LifecyclePresentation
> = {
  CREATED: {
    label: 'Created',
    variant: 'default',
  },
  PUBLISHED: {
    label: 'Published',
    variant: 'success',
  },
  BOARDING_OPENED: {
    label: 'Boarding opened',
    variant: 'brand',
  },
  JOURNEY_STARTED: {
    label: 'Journey started',
    variant: 'brand',
  },
  COMPLETION_REQUESTED: {
    label: 'Completion requested',
    variant: 'warning',
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'success',
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'danger',
  },
  EXPIRED: {
    label: 'Expired',
    variant: 'default',
  },
  SETTLEMENT_SUBMITTED: {
    label: 'Settlement submitted',
    variant: 'brand',
  },
  SETTLEMENT_PROCESSING: {
    label: 'Settlement processing',
    variant: 'warning',
  },
  SETTLEMENT_COMPLETED: {
    label: 'Settlement completed',
    variant: 'success',
  },
  SETTLEMENT_FAILED: {
    label: 'Settlement failed',
    variant: 'danger',
  },
  SETTLEMENT_HELD: {
    label: 'Settlement on hold',
    variant: 'warning',
  },
  SETTLEMENT_CANCELLED: {
    label: 'Settlement cancelled',
    variant: 'default',
  },
};

export function JourneyLifecycleBadge({
  stage,
  size = 'md',
  className,
}: JourneyLifecycleBadgeProps) {
  const presentation = LIFECYCLE_PRESENTATION[stage];

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
      aria-label={`Journey lifecycle event: ${presentation.label}`}
    >
      {presentation.label}
    </Badge>
  );
}

export default JourneyLifecycleBadge;
