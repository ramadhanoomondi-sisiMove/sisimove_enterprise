import {
  AdminBookingPaymentStatus,
  AdminBookingStatus,
  type AdminBookingStatusTone,
} from '../models/admin-booking.enums';

export function getAdminBookingStatusLabel(
  status: AdminBookingStatus | string | null | undefined,
): string {
  if (!status) {
    return 'Unknown';
  }

  const labels: Record<string, string> = {
    [AdminBookingStatus.PENDING]: 'Pending',
    [AdminBookingStatus.CONFIRMED]: 'Confirmed',
    [AdminBookingStatus.CANCELLED]: 'Cancelled',
    [AdminBookingStatus.COMPLETED]: 'Completed',
    [AdminBookingStatus.EXPIRED]: 'Expired',
  };

  return (
    labels[status] ??
    status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
}

export function getAdminBookingStatusTone(
  status: AdminBookingStatus | string | null | undefined,
): AdminBookingStatusTone {
  switch (status) {
    case AdminBookingStatus.CONFIRMED:
    case AdminBookingStatus.COMPLETED:
      return 'success';

    case AdminBookingStatus.PENDING:
      return 'warning';

    case AdminBookingStatus.CANCELLED:
    case AdminBookingStatus.EXPIRED:
      return 'danger';

    default:
      return 'neutral';
  }
}

export function getAdminBookingPaymentStatusLabel(
  status: AdminBookingPaymentStatus | string | null | undefined,
): string {
  if (!status) {
    return 'Unknown';
  }

  const labels: Record<string, string> = {
    [AdminBookingPaymentStatus.PENDING]: 'Pending',
    [AdminBookingPaymentStatus.AUTHORIZED]: 'Authorized',
    [AdminBookingPaymentStatus.CAPTURED]: 'Captured',
    [AdminBookingPaymentStatus.FAILED]: 'Failed',
    [AdminBookingPaymentStatus.REFUNDED]: 'Refunded',
    [AdminBookingPaymentStatus.PARTIALLY_REFUNDED]:
      'Partially refunded',
  };

  return (
    labels[status] ??
    status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
}

export function getAdminBookingPaymentStatusTone(
  status: AdminBookingPaymentStatus | string | null | undefined,
): AdminBookingStatusTone {
  switch (status) {
    case AdminBookingPaymentStatus.CAPTURED:
      return 'success';

    case AdminBookingPaymentStatus.AUTHORIZED:
    case AdminBookingPaymentStatus.PENDING:
      return 'info';

    case AdminBookingPaymentStatus.FAILED:
      return 'danger';

    case AdminBookingPaymentStatus.REFUNDED:
    case AdminBookingPaymentStatus.PARTIALLY_REFUNDED:
      return 'warning';

    default:
      return 'neutral';
  }
}