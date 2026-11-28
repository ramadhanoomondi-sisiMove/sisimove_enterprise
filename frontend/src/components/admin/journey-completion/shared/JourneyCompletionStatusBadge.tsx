
import { Badge } from '@/components/ui';

import type { BadgeVariant } from '@/components/ui';

import { AdminJourneyCompletionStatus } from '@/features/admin/journey-completion';

export interface JourneyCompletionStatusBadgeProps {
  status: AdminJourneyCompletionStatus;
  size?: 'sm' | 'md';
  className?: string;
}

type StatusPresentation = {
  label: string;
  variant: BadgeVariant;
};

const STATUS_PRESENTATION: Record<
  AdminJourneyCompletionStatus,
  StatusPresentation
> = {
  [AdminJourneyCompletionStatus.PENDING]: {
    label: 'Pending',
    variant: 'default',
  },
  [AdminJourneyCompletionStatus.CONFIRMATION_REQUIRED]: {
    label: 'Confirmation required',
    variant: 'warning',
  },
  [AdminJourneyCompletionStatus.CONFIRMED]: {
    label: 'Confirmed',
    variant: 'success',
  },
  [AdminJourneyCompletionStatus.DISPUTED]: {
    label: 'Disputed',
    variant: 'danger',
  },
  [AdminJourneyCompletionStatus.CANCELLED]: {
    label: 'Cancelled',
    variant: 'outline',
  },
};

export function JourneyCompletionStatusBadge({
  status,
  size = 'md',
  className,
}: JourneyCompletionStatusBadgeProps) {
  const presentation = STATUS_PRESENTATION[status] ?? {
    label: 'Unknown',
    variant: 'outline' as BadgeVariant,
  };

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
