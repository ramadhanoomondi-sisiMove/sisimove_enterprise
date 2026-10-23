
import { Badge } from '@/components/ui/badge';

import { AdminBookingPaymentStatus } from '@/features/admin/bookings';

interface BookingPaymentStatusBadgeProps {
  status: AdminBookingPaymentStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const PAYMENT_STATUS_PRESENTATION: Record<
  AdminBookingPaymentStatus,
  {
    label: string;
    variant: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'outline';
  }
> = {
  [AdminBookingPaymentStatus.PENDING]: {
    label: 'Pending',
    variant: 'warning',
  },
  [AdminBookingPaymentStatus.AUTHORIZED]: {
    label: 'Authorized',
    variant: 'brand',
  },
  [AdminBookingPaymentStatus.CAPTURED]: {
    label: 'Captured',
    variant: 'success',
  },
  [AdminBookingPaymentStatus.FAILED]: {
    label: 'Failed',
    variant: 'danger',
  },
  [AdminBookingPaymentStatus.REFUNDED]: {
    label: 'Refunded',
    variant: 'default',
  },
  [AdminBookingPaymentStatus.PARTIALLY_REFUNDED]: {
    label: 'Partially refunded',
    variant: 'outline',
  },
};

export function BookingPaymentStatusBadge({
  status,
  size = 'md',
  className,
}: BookingPaymentStatusBadgeProps) {
  const presentation = PAYMENT_STATUS_PRESENTATION[status];

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
