// src/features/admin/boardings/shared/BoardingStatusBadge.tsx

import { Badge } from '@/components/ui/badge';
import { AdminBoardingStatus } from '@/features/admin/boardings';

import type { BadgeVariant } from '@/components/ui/badge';

export interface BoardingStatusBadgeProps {
  status: AdminBoardingStatus | string;
  className?: string;
}

const statusConfig: Record<
  AdminBoardingStatus,
  { label: string; variant: BadgeVariant }
> = {
  [AdminBoardingStatus.NOT_STARTED]: {
    label: 'Not started',
    variant: 'default',
  },
  [AdminBoardingStatus.BOARDING]: {
    label: 'Boarding',
    variant: 'brand',
  },
  [AdminBoardingStatus.STARTED]: {
    label: 'Started',
    variant: 'success',
  },
  [AdminBoardingStatus.CANCELLED]: {
    label: 'Cancelled',
    variant: 'danger',
  },
};

export function BoardingStatusBadge({
  status,
  className,
}: BoardingStatusBadgeProps) {
  const config =
    statusConfig[status as AdminBoardingStatus];

  return (
    <Badge
      variant={config?.variant ?? 'outline'}
      className={className}
    >
      {config?.label ?? status.replaceAll('_', ' ')}
    </Badge>
  );
}
