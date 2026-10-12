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
  /** Messages inbox or journey-context messaging destination. */
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
  readonly associatedBookingsCount?: number;
  readonly participantsCount?: number;
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
  associatedBookingsCount = 0,
  participantsCount = 0,
  actions,
  children,
  className,
}: JourneyBookingCardProps) {
  const router = useRouter();

  // Use booking-owned historical data, not current Journey data.
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

  const sectionPadding = cn(
    "min-w-0 p-2",
    "sm:px-[clamp(0.45rem,1vw,0.85rem)]",
    "sm:py-[clamp(0.4rem,0.8vw,0.7rem)]",
  );

  return (
    <Card
      padding="none"
      className={cn(
        "group w-full min-w-0 overflow-hidden rounded-xl border",
        "border-[var(--border)] bg-[var(--surface)]",
        "shadow-[var(--shadow-md)] transition-all duration-200",
        "hover:border-[var(--border-strong)]",
        "hover:shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      <article
        aria-label={`Booking from ${origin} to ${destination}`}
        className="min-w-0"
      >
        {/* Header */}
        <header
          className={cn(
            "flex min-w-0 items-center justify-between gap-2",
            "p-2.5 sm:px-3 sm:py-2.5",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-8 shrink-0 items-center justify-center",
                "rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]",
              )}
            >
              <Ticket size={17} strokeWidth={1.8} />
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
            "grid w-full min-w-0 grid-cols-2",
            "sm:grid-cols-[16%_29%_35%_20%]",
          )}
        >
          {/* Departure */}
          <section
            aria-label="Booking departure"
            className={cn(
              sectionPadding,
              "border-r border-b border-[var(--border-subtle)]",
              "sm:border-b-0",
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
              sectionPadding,
              "border-b border-[var(--border-subtle)]",
              "sm:border-b-0",
            )}
          >
            <SectionLabel icon={<Route size={12} />}>
              Route
            </SectionLabel>

            <div className="flex min-w-0 flex-col gap-1.5">
              <RoutePoint label="From" name={origin} />
              <RoutePoint label="To" name={destination} />
            </div>
          </section>

          {/* Seats and total */}
          <section
            aria-label="Booking seats and total"
            className={cn(
              sectionPadding,
              "border-r border-[var(--border-subtle)]",
              "sm:border-r-0 sm:border-l",
            )}
          >
            <SectionLabel icon={<UsersRound size={12} />}>
              Reservation
            </SectionLabel>

            <p className="text-sm font-bold text-[var(--foreground)]">
              {booking.seats} {booking.seats === 1 ? "seat" : "seats"}
            </p>

            <div className="mt-2 border-t border-[var(--border-subtle)] pt-1.5">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
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
            className={cn(
              sectionPadding,
              "sm:border-l sm:border-[var(--border-subtle)]",
            )}
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
        <footer
          className={cn(
            "border-t border-[var(--border)]",
            "bg-[var(--background-brand)]",
            "px-2.5 py-2 sm:px-3",
          )}
        >
          <nav
            aria-label="Booking actions"
            className="flex min-w-0 items-center justify-between gap-2"
          >
            {/* Messages summary */}
           
            <div className="shrink-0 ml-6">
              <JourneyUnreadMessagesBadge
                count={Math.max(0, unreadMessagesCount)}
                href={navigation.messagesHref}
              />
            </div>

            {/* Each action keeps its own count and layout */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="shrink-0">
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
              </div>

              <BookingAction
                href={navigation.bookingsHref}
                icon={<Ticket size={15} />}
                label="Bookings"
                count={associatedBookingsCount}
              />

              <BookingAction
                href={navigation.participantsHref}
                icon={<UsersRound size={15} />}
                label="Participants"
                count={participantsCount}
              />
            </div>
          </nav>

          {/* Additional page-level actions */}
          {actions && (
            <div className="mt-2 flex items-center justify-end gap-2 border-t border-[var(--border-subtle)] pt-2">
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
        "mb-1 flex min-w-0 items-center gap-1",
        "text-[0.625rem] sm:text-[clamp(0.48rem,0.62vw,0.62rem)]",
        "font-semibold uppercase tracking-[0.06em] leading-tight",
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
  readonly count?: number;
}

function BookingAction({
  href,
  icon,
  label,
  count = 0,
}: BookingActionProps) {
  const safeCount = Math.max(0, count);

  return (
    <Link
      href={href}
      aria-label={`${label}: ${safeCount}`}
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

      <span
        className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--background-muted)] px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
        aria-hidden="true"
      >
        {safeCount}
      </span>
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

function getPaymentValueClass(status?: BookingPaymentStatus): string {
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
