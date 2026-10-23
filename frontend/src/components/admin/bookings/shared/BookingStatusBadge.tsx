
import { Badge } from '@/components/ui/badge';

import {
  AdminBookingStatus,
  type AdminBookingStatusTone,
} from '@/features/admin/bookings';

interface BookingStatusBadgeProps {
  status: AdminBookingStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_PRESENTATION: Record<
  AdminBookingStatus,
  {
    label: string;
    tone: AdminBookingStatusTone;
  }
> = {
  [AdminBookingStatus.PENDING]: {
    label: 'Pending',
    tone: 'warning',
  },
  [AdminBookingStatus.CONFIRMED]: {
    label: 'Confirmed',
    tone: 'success',
  },
  [AdminBookingStatus.CANCELLED]: {
    label: 'Cancelled',
    tone: 'danger',
  },
  [AdminBookingStatus.COMPLETED]: {
    label: 'Completed',
    tone: 'info',
  },
  [AdminBookingStatus.EXPIRED]: {
    label: 'Expired',
    tone: 'neutral',
  },
};

const BADGE_VARIANT: Record<
  AdminBookingStatusTone,
  'default' | 'brand' | 'success' | 'warning' | 'danger' | 'outline'
> = {
  neutral: 'default',
  info: 'brand',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export function BookingStatusBadge({
  status,
  size = 'md',
  className,
}: BookingStatusBadgeProps) {
  const presentation = STATUS_PRESENTATION[status];

  return (
    <Badge
      variant={BADGE_VARIANT[presentation.tone]}
      size={size}
      className={className}
    >
      {presentation.label}
    </Badge>
  );
}
