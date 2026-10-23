import type {
  AdminBooking,
  AdminBookingPricing,
} from '../models/admin-booking.model';

const DEFAULT_LOCALE = 'en-KE';
const DEFAULT_CURRENCY = 'KES';

export function formatAdminBookingDate(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {},
): string {
  if (value == null || value === '') {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: 'medium',
    ...options,
  }).format(date);
}

export function formatAdminBookingDateTime(
  value: string | Date | null | undefined,
): string {
  return formatAdminBookingDate(value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatAdminBookingMoney(
  amount: number | null | undefined,
  currency: string = DEFAULT_CURRENCY,
): string {
  if (amount == null || !Number.isFinite(amount)) {
    return '—';
  }

  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(DEFAULT_LOCALE)}`;
  }
}

export function formatAdminBookingAmount(
  pricing: AdminBookingPricing | null | undefined,
): string {
  if (!pricing) {
    return '—';
  }

  return formatAdminBookingMoney(pricing.totalAmount, pricing.currency);
}

export function formatAdminBookingSeats(
  seats: number | null | undefined,
): string {
  if (seats == null || !Number.isFinite(seats)) {
    return '—';
  }

  return `${seats} ${seats === 1 ? 'seat' : 'seats'}`;
}

export function formatAdminBookingReference(
  publicId: string | null | undefined,
): string {
  if (!publicId?.trim()) {
    return '—';
  }

  return publicId;
}

export function formatAdminBookingRoute(
  booking: Pick<AdminBooking, 'snapshot'>,
): string {
  const snapshot = booking.snapshot;

  if (!snapshot) {
    return 'Route unavailable';
  }

  const origin = snapshot.originName.trim();
  const destination = snapshot.destinationName.trim();

  if (!origin && !destination) {
    return 'Route unavailable';
  }

  if (!origin) {
    return `Unknown origin → ${destination}`;
  }

  if (!destination) {
    return `${origin} → Unknown destination`;
  }

  return `${origin} → ${destination}`;
}