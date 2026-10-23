// src/features/admin/boardings/shared/BoardingParticipantStatusBadge.tsx

import { Badge } from '@/components/ui/badge';
import {
  AdminBoardingParticipantStatus,
} from '@/features/admin/boardings';

import type { BadgeVariant } from '@/components/ui/badge';

export interface BoardingParticipantStatusBadgeProps  {
  status: AdminBoardingParticipantStatus | string;
  className?: string;
}

const statusConfig: Record<
  AdminBoardingParticipantStatus,
  { label: string; variant: BadgeVariant }
> = {
  [AdminBoardingParticipantStatus.EXPECTED]: {
    label: 'Expected',
    variant: 'default',
  },
  [AdminBoardingParticipantStatus.BOARDED]: {
    label: 'Boarded',
    variant: 'success',
  },
  [AdminBoardingParticipantStatus.WITHDRAWN]: {
    label: 'Withdrawn',
    variant: 'warning',
  },
  [AdminBoardingParticipantStatus.NO_SHOW]: {
    label: 'No-show',
    variant: 'danger',
  },
  [AdminBoardingParticipantStatus.REMOVED]: {
    label: 'Removed',
    variant: 'outline',
  },
};

export function BoardingParticipantStatusBadge({
  status,
  className,
}: BoardingParticipantStatusBadgeProps) {
  const config =
    statusConfig[status as AdminBoardingParticipantStatus];

  return (
    <Badge
      variant={config?.variant ?? 'outline'}
      className={className}
    >
      {config?.label ?? status.replaceAll('_', ' ')}
    </Badge>
  );
}
