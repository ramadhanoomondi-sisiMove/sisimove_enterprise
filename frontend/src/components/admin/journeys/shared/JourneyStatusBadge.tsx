
import type { ComponentProps } from 'react';

import { Badge } from '@/components/ui/badge';
import type { JourneyStatus } from '@/features/admin/journeys/models/journey.enums';

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>;

export interface JourneyStatusBadgeProps {
  status: JourneyStatus;
  size?: 'sm' | 'md';
  className?: string;
}

interface StatusPresentation {
  label: string;
  variant: BadgeVariant;
}

const STATUS_PRESENTATION: Record<JourneyStatus, StatusPresentation> = {
  DRAFT: {
    label: 'Draft',
    variant: 'default',
  },
  PUBLISHED: {
    label: 'Published',
    variant: 'success',
  },
  FULL: {
    label: 'Full',
    variant: 'warning',
  },
  BOARDING: {
    label: 'Boarding',
    variant: 'brand',
  },
  IN_PROGRESS: {
    label: 'In progress',
    variant: 'brand',
  },
  COMPLETION_PENDING: {
    label: 'Completion pending',
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
};

export function JourneyStatusBadge({
  status,
  size = 'md',
  className,
}: JourneyStatusBadgeProps) {
  const presentation = STATUS_PRESENTATION[status];

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
      aria-label={`Journey status: ${presentation.label}`}
    >
      {presentation.label}
    </Badge>
  );
}

export default JourneyStatusBadge;
