// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Card
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  CreditCard,
  Route,
  Ticket,
  UsersRound,
} from "lucide-react";

import { Card } from "@/components/ui";
import {
  JourneyGetSupportAction,
  JourneyUnreadMessagesBadge,
} from "@/components/journey/shared";
import { formatCurrency } from "@/foundation/formatters/currency";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";
import { cn } from "@/foundation/utils/cn";
import type { JourneyBookingDetail } from "@/features/journey-booking/models";

import { JourneyBookingStatusBadge } from "../booking-status";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBookingCardNavigation {
  /** Authenticated messages inbox or journey-context messaging destination. */
  readonly messagesHref: string;

  /** Bookings associated with this Journey. */
  readonly bookingsHref: string;

  /** Participants associated with this Journey. */
  readonly participantsHref: string;
}

export interface JourneyBookingCardProps {
  readonly booking: JourneyBookingDetail;
  readonly navigation: JourneyBookingCardNavigation;
  readonly unreadMessagesCount?: number;
  readonly actions?: ReactNode;
  readonly children?: ReactNode;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingCard({
  booking,
  navigation,
  unreadMessagesCount = 0,
  actions,
  children,
  className,
}: JourneyBookingCardProps) {
  const router = useRouter();

  // Booking-owned historical data. Do not replace with current Journey data.
  const snapshot = booking.snapshot;
  const pricing = booking.pricing;
  const payment = booking.payment;

  const origin = snapshot?.originName ?? "Origin unavailable";
  const destination =
    snapshot?.destinationName ?? "Destination unavailable";

  const departureAt = snapshot?.departureAt ?? null;

  const departureLabel = departureAt
    ? formatDateTime(departureAt)
    : "Not available";

  const totalLabel = pricing
    ? formatCurrency(pricing.totalAmount, pricing.currency)
    : "Not available";

  const paymentLabel = payment
    ? formatPaymentStatus(payment.status)
    : "Not available";

  return (
    <Card
      padding="none"
      className={cn(
        "group w-full min-w-0 overflow-hidden rounded-xl border",
        "border-[var(--border)] bg-[var(--surface)]",
        "shadow-[var(--shadow-md)] transition-all duration-200",
        "hover:shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      <article
        aria-label={`Booking from ${origin} to ${destination}`}
        className="min-w-0"
      >
        {/* Header */}
        <header className="flex min-w-0 items-center justify-between gap-3 p-3 sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-9 shrink-0 items-center justify-center",
                "rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]",
              )}
            >
              <Ticket size={18} strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Booking
                </h3>

                <span
                  aria-hidden="true"
                  className="size-1 shrink-0 rounded-full bg-[var(--foreground-subtle)]"
                />

                <span className="truncate text-xs text-[var(--foreground-muted)]">
                  #{booking.publicId.slice(-6)}
                </span>
              </div>

              <p
                title={booking.publicId}
                className="mt-0.5 truncate font-mono text-[10px] text-[var(--foreground-subtle)]"
              >
                {booking.publicId}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <JourneyBookingStatusBadge status={booking.status} />
          </div>
        </header>

        {/* Booking information */}
        <div
          className={cn(
            "grid min-w-0 grid-cols-2",
            "sm:grid-cols-[16%_29%_27%_28%]",
          )}
        >
          {/* Departure */}
          <section
            aria-label="Booking departure"
            className={cn(
              "min-w-0 border-r border-b",
              "border-[var(--border-subtle)] sm:border-b-0",
              "p-2 sm:px-3 sm:py-3",
            )}
          >
            <SectionLabel icon={<CalendarDays size={12} />}>
              Departure
            </SectionLabel>

            <p className="text-xs font-bold leading-snug text-[var(--foreground)] sm:text-sm">
              {departureLabel}
            </p>

            {departureAt && (
              <time dateTime={departureAt} className="sr-only">
                {departureLabel}
              </time>
            )}
          </section>

          {/* Historical route */}
          <section
            aria-label="Booked journey route"
            className={cn(
              "min-w-0 border-b border-[var(--border-subtle)]",
              "sm:border-b-0",
              "p-2 sm:px-3 sm:py-3",
            )}
          >
            <SectionLabel icon={<Route size={12} />}>
              Route
            </SectionLabel>

            <div className="flex min-w-0 flex-col gap-1">
              <RoutePoint label="From" name={origin} />
              <RoutePoint label="To" name={destination} />
            </div>
          </section>

          {/* Seats and total */}
          <section
            aria-label="Booking seats and total"
            className={cn(
              "min-w-0 border-r border-[var(--border-subtle)]",
              "sm:border-r-0 sm:border-l",
              "p-2 sm:px-3 sm:py-3",
            )}
          >
            <SectionLabel icon={<UsersRound size={12} />}>
              Reservation
            </SectionLabel>

            <p className="text-sm font-bold text-[var(--foreground)]">
              {booking.seats} {booking.seats === 1 ? "seat" : "seats"}
            </p>

            <div className="mt-2 border-t border-[var(--border-subtle)] pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Total
              </p>

              <p
                title={totalLabel}
                className="mt-0.5 truncate text-sm font-bold text-[var(--foreground)]"
              >
                {totalLabel}
              </p>
            </div>
          </section>

          {/* Payment */}
          <section
            aria-label="Booking payment"
            className="min-w-0 p-2 sm:border-l sm:border-[var(--border-subtle)] sm:px-3 sm:py-3"
          >
            <SectionLabel icon={<CreditCard size={12} />}>
              Payment
            </SectionLabel>

            <p
              className={cn(
                "text-sm font-bold",
                getPaymentValueClass(payment?.status),
              )}
            >
              {paymentLabel}
            </p>

            <p className="mt-1 text-[10px] text-[var(--foreground-muted)]">
              Payment status
            </p>
          </section>
        </div>

        {/* Optional additional booking information */}
        {children && (
          <div className="border-t border-[var(--border-subtle)] p-3">
            {children}
          </div>
        )}

        {/* Passenger actions */}
        <footer className="border-t border-[var(--border)] bg-[var(--background-brand)] p-2 sm:px-3 sm:py-2.5">
          <nav
            aria-label="Booking actions"
            className="flex min-w-0 flex-wrap items-center justify-between gap-2"
          >
            <JourneyUnreadMessagesBadge
              count={Math.max(0, unreadMessagesCount)}
              href={navigation.messagesHref}
            />

            <JourneyGetSupportAction
              journeyPublicId={booking.journeyPublicId}
              onGetSupport={(journeyPublicId) => {
                router.push(
                  AUTHENTICATED_ROUTES.JOURNEY_SUPPORT_NEW(
                    journeyPublicId,
                  ),
                );
              }}
              className="min-h-9 px-3"
            />

            <BookingAction
              href={navigation.bookingsHref}
              icon={<Ticket size={15} />}
              label="Bookings"
            />

            <BookingAction
              href={navigation.participantsHref}
              icon={<UsersRound size={15} />}
              label="Participants"
            />
          </nav>

          {actions && (
            <div className="mt-2 flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border-subtle)] pt-2">
              {actions}
            </div>
          )}
        </footer>
      </article>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Shared presentation helpers
// -----------------------------------------------------------------------------

interface SectionLabelProps {
  readonly children: ReactNode;
  readonly icon: ReactNode;
}

function SectionLabel({ children, icon }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "mb-1.5 flex min-w-0 items-center gap-1",
        "text-[10px] font-semibold uppercase tracking-wide",
        "text-[var(--foreground-muted)]",
      )}
    >
      <span aria-hidden="true" className="shrink-0">
        {icon}
      </span>

      <span className="truncate">{children}</span>
    </div>
  );
}

interface RoutePointProps {
  readonly label: string;
  readonly name: string;
}

function RoutePoint({ label, name }: RoutePointProps) {
  return (
    <div className="flex min-w-0 items-start gap-1.5">
      <span
        aria-hidden="true"
        className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
      />

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
          {label}
        </p>

        <p
          title={name}
          className="truncate text-xs font-semibold leading-snug text-[var(--foreground)]"
        >
          {name}
        </p>
      </div>
    </div>
  );
}

interface BookingActionProps {
  readonly href: string;
  readonly icon: ReactNode;
  readonly label: string;
}

function BookingAction({
  href,
  icon,
  label,
}: BookingActionProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex min-h-9 min-w-0 items-center justify-center gap-1.5",
        "rounded-lg border border-[var(--border)]",
        "bg-[var(--surface)] px-2 py-2",
        "text-xs font-semibold text-[var(--foreground)]",
        "transition-colors hover:border-[var(--brand)]",
        "hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--brand)]",
      )}
    >
      <span aria-hidden="true" className="shrink-0">
        {icon}
      </span>

      <span className="truncate">{label}</span>
    </Link>
  );
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

type BookingPaymentStatus = NonNullable<
  JourneyBookingDetail["payment"]
>["status"];

function getPaymentValueClass(
  status?: BookingPaymentStatus,
): string {
  switch (status) {
    case "CAPTURED":
      return "text-[var(--success)]";

    case "FAILED":
      return "text-[var(--danger)]";

    case "PENDING":
    case "AUTHORIZED":
      return "text-[var(--warning)]";

    default:
      return "text-[var(--foreground)]";
  }
}

function formatPaymentStatus(status: BookingPaymentStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "AUTHORIZED":
      return "Authorized";

    case "CAPTURED":
      return "Paid";

    case "FAILED":
      return "Failed";

    case "PARTIALLY_REFUNDED":
      return "Partially refunded";

    case "REFUNDED":
      return "Refunded";

    default:
      return status;
  }
}