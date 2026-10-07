// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Card
// -----------------------------------------------------------------------------
//
// Mobile-first, modern presentation of a Journey Booking.
//
// Responsibilities:
// - Present the booking's historical route.
// - Present booking status.
// - Present departure information when the snapshot exists.
// - Present reserved seats.
// - Present historical pricing when available.
// - Provide optional consumer-controlled actions.
//
// Non-responsibilities:
// - Fetching Journey data.
// - Reconstructing current Journey state.
// - Performing booking lifecycle mutations.
// - Navigating to booking detail.
// - Recalculating pricing.
//
// IMPORTANT:
//
// The JourneyBooking snapshot is historical booking-owned data. The card must
// not replace it with information fetched from the current Journey.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  MapPin,
  ReceiptText,
  Route,
  Ticket,
  Users,
} from 'lucide-react';

import { Card } from '@/components/ui';
import type { JourneyBookingDetail } from '@/features/journey-booking/models';

import { JourneyBookingStatusBadge } from '../booking-status';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBookingCardProps {
  booking: JourneyBookingDetail;

  /**
   * Optional consumer-controlled content rendered as the card footer.
   */
  actions?: ReactNode;

  /**
   * Optional additional content rendered below the booking summary.
   */
  children?: ReactNode;

  className?: string;
}

// -----------------------------------------------------------------------------
// Journey Booking Card
// -----------------------------------------------------------------------------

export function JourneyBookingCard({
  booking,
  actions,
  children,
  className,
}: JourneyBookingCardProps) {
  const snapshot = booking.snapshot;
  const pricing = booking.pricing;

  return (
    <Card
      padding="none"
      className={[
        'group overflow-hidden',
        'rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        'shadow-[var(--shadow-sm)]',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-0.5',
        'hover:shadow-[var(--shadow-md)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              aria-hidden="true"
              className={[
                'flex h-10 w-10 shrink-0 items-center justify-center',
                'rounded-[var(--radius-md)]',
                'bg-[var(--brand-soft)]',
                'text-[var(--brand)]',
                'transition-transform duration-200',
                'group-hover:scale-[1.03]',
              ].join(' ')}
            >
              <Ticket size={19} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Booking
                </p>

                <span
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 rounded-full bg-[var(--foreground-subtle)]"
                />

                <p className="truncate text-xs text-[var(--foreground-muted)]">
                  #{booking.publicId.slice(-6)}
                </p>
              </div>

              <p
                className="mt-0.5 truncate font-mono text-[10px] text-[var(--foreground-subtle)]"
                title={booking.publicId}
              >
                {booking.publicId}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <JourneyBookingStatusBadge status={booking.status} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Route                                                               */}
      {/* ------------------------------------------------------------------- */}

      {snapshot ? (
        <BookingRoute snapshot={snapshot} />
      ) : (
        <div className="mx-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--background-muted)] p-4 sm:mx-5">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground-muted)]"
            >
              <Route size={16} strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--foreground-muted)]">
                Journey details unavailable
              </p>

              <p
                className="mt-1 truncate text-sm font-semibold text-[var(--foreground)]"
                title={booking.journeyPublicId}
              >
                Journey {booking.journeyPublicId}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Booking Information                                                  */}
      {/* ------------------------------------------------------------------- */}

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="grid grid-cols-2 gap-2.5">
          <BookingValue
            label="Seats"
            value={String(booking.seats)}
            icon={<Users size={15} strokeWidth={1.8} />}
          />

          {snapshot?.departureAt && (
            <BookingValue
              label="Departure"
              value={formatDateTime(snapshot.departureAt)}
              icon={<CalendarDays size={15} strokeWidth={1.8} />}
            />
          )}

          {pricing && (
            <BookingValue
              label="Total"
              value={formatMoney(
                pricing.totalAmount,
                pricing.currency,
              )}
              icon={<ReceiptText size={15} strokeWidth={1.8} />}
              emphasis
            />
          )}

          {booking.payment && (
            <BookingValue
              label="Payment"
              value={formatPaymentStatus(booking.payment.status)}
              icon={<CreditCard size={15} strokeWidth={1.8} />}
              paymentStatus={booking.payment.status}
            />
          )}
        </div>

        {children}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Actions                                                              */}
      {/* ------------------------------------------------------------------- */}

      {actions && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3 sm:px-5">
          <div className="flex w-full items-center justify-end gap-2">
            {actions}
          </div>
        </div>
      )}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Route
// -----------------------------------------------------------------------------

interface BookingRouteProps {
  snapshot: NonNullable<JourneyBookingDetail['snapshot']>;
}

function BookingRoute({ snapshot }: BookingRouteProps) {
  return (
    <div
      aria-label={`Journey from ${snapshot.originName} to ${snapshot.destinationName}`}
      className={[
        'relative mx-4 overflow-hidden',
        'rounded-[var(--radius-lg)]',
        'border border-[var(--border-subtle)]',
        'bg-[var(--background-brand)]',
        'sm:mx-5',
      ].join(' ')}
    >
      {/* Brand accent */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-[var(--brand)]"
      />

      <div className="px-4 py-4 pl-5 sm:py-4.5">
        <div className="flex min-w-0 items-center gap-3">
          <RoutePoint
            label="From"
            name={snapshot.originName}
            variant="origin"
          />

          <div
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--foreground-subtle)]"
          >
            <ArrowRight size={15} strokeWidth={1.8} />
          </div>

          <RoutePoint
            label="To"
            name={snapshot.destinationName}
            variant="destination"
          />
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Route Point
// -----------------------------------------------------------------------------

interface RoutePointProps {
  label: string;
  name: string;
  variant: 'origin' | 'destination';
}

function RoutePoint({
  label,
  name,
  variant,
}: RoutePointProps) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-2.5">
      <MapPin
        size={16}
        strokeWidth={1.8}
        className={[
          'mt-0.5 shrink-0',
          variant === 'origin'
            ? 'text-[var(--brand)]'
            : 'text-[var(--foreground-muted)]',
        ].join(' ')}
        aria-hidden="true"
      />

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-muted)]">
          {label}
        </p>

        <p
          className="mt-0.5 truncate text-sm font-semibold leading-5 text-[var(--foreground)]"
          title={name}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Booking Values
// -----------------------------------------------------------------------------

interface BookingValueProps {
  label: string;
  value: string;
  icon: ReactNode;
  emphasis?: boolean;
  paymentStatus?: NonNullable<
    JourneyBookingDetail['payment']
  >['status'];
}

function BookingValue({
  label,
  value,
  icon,
  emphasis = false,
  paymentStatus,
}: BookingValueProps) {
  const paymentClass = getPaymentValueClass(paymentStatus);

  return (
    <div
      className={[
        'min-w-0 rounded-[var(--radius-md)]',
        'border border-[var(--border-subtle)]',
        'bg-[var(--background-subtle)]',
        'px-3 py-3',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground-muted)]"
        >
          {icon}
        </span>

        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--foreground-muted)]">
          {label}
        </p>
      </div>

      <p
        className={[
          'mt-2 truncate',
          emphasis
            ? 'text-[15px] font-bold'
            : 'text-sm font-semibold',
          paymentClass || 'text-[var(--foreground)]',
        ].join(' ')}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Payment Styling
// -----------------------------------------------------------------------------

function getPaymentValueClass(
  status?: NonNullable<
    JourneyBookingDetail['payment']
  >['status'],
): string {
  switch (status) {
    case 'CAPTURED':
      return 'text-[var(--success)]';

    case 'FAILED':
      return 'text-[var(--danger)]';

    case 'PENDING':
    case 'AUTHORIZED':
      return 'text-[var(--warning)]';

    default:
      return '';
  }
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Pricing amounts are represented by the API in the smallest currency unit.
 *
 * This function performs display formatting only. It does not recalculate
 * booking pricing.
 */
function formatMoney(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return `${currency} ${(amount / 100).toFixed(2)}`;
  }
}

function formatPaymentStatus(
  status: NonNullable<
    JourneyBookingDetail['payment']
  >['status'],
): string {
  switch (status) {
    case 'PENDING':
      return 'Pending';

    case 'AUTHORIZED':
      return 'Authorized';

    case 'CAPTURED':
      return 'Paid';

    case 'FAILED':
      return 'Failed';

    case 'PARTIALLY_REFUNDED':
      return 'Partially refunded';

    case 'REFUNDED':
      return 'Refunded';

    default:
      return status;
  }
}
