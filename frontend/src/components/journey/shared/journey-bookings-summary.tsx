
import type { JourneyBooking } from "@/features/journey-booking/models/journey-booking";
import { cn } from "@/foundation/utils/cn";

export interface JourneyBookingsSummaryProps {
  readonly bookings: readonly JourneyBooking[];
  readonly className?: string;
}

export function JourneyBookingsSummary({
  bookings,
  className,
}: JourneyBookingsSummaryProps) {
  const bookingCount = bookings.length;

  const reservedSeats = bookings.reduce(
    (total, booking) => total + booking.seats,
    0,
  );

  const hasBookings = bookingCount > 0;

  const tooltip = hasBookings
    ? `${bookingCount} ${
        bookingCount === 1 ? "booking" : "bookings"
      } received, with ${reservedSeats} ${
        reservedSeats === 1 ? "seat reserved" : "seats reserved"
      }.`
    : "No bookings have been received for this Journey yet.";

  return (
    <section
      aria-label="Journey bookings"
      title={tooltip}
      className={cn(
        "group relative w-full min-w-0 max-w-[12rem]",
        "rounded-lg border p-2",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-md",
        hasBookings
          ? "border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100"
          : "border-[var(--border-subtle)] bg-[var(--background-subtle)] hover:border-[var(--brand)] hover:bg-[var(--background)]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col items-start gap-1.5">
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full",
            "transition-all duration-200 ease-out",
            "group-hover:scale-105",
            hasBookings
              ? "bg-green-100 text-green-700 group-hover:bg-green-200"
              : "bg-[var(--background-muted)] text-[var(--foreground-muted)] group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)]",
          )}
          aria-hidden="true"
        >
          {hasBookings ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 transition-transform duration-200 group-hover:scale-110"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 transition-transform duration-200 group-hover:scale-110"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          )}
        </div>

        <div className="w-full min-w-0">
          <div className="flex w-full min-w-0 items-center justify-between gap-1">
            <p
              className={cn(
                "text-xs font-semibold leading-tight",
                hasBookings
                  ? "text-green-800"
                  : "text-[var(--foreground)]",
              )}
            >
              {hasBookings ? "Bookings received" : "Bookings"}
            </p>

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "size-3.5 shrink-0",
                "transition-all duration-200 ease-out",
                "group-hover:translate-x-1",
                hasBookings
                  ? "text-green-700"
                  : "text-[var(--foreground-muted)] group-hover:text-[var(--brand)]",
              )}
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>

          <p
            className={cn(
              "mt-1 text-base font-bold leading-tight tabular-nums",
              hasBookings
                ? "text-green-900"
                : "text-[var(--foreground)]",
            )}
          >
            {bookingCount}{" "}
            <span
              className={cn(
                "text-xs font-normal",
                hasBookings
                  ? "text-green-800"
                  : "text-[var(--foreground-muted)]",
              )}
            >
              {bookingCount === 1 ? "booking" : "bookings"}
            </span>
          </p>

          <p
            className={cn(
              "mt-1 text-xs leading-tight",
              hasBookings
                ? "text-green-800"
                : "text-[var(--foreground-muted)]",
            )}
          >
            {reservedSeats}{" "}
            {reservedSeats === 1 ? "seat reserved" : "seats reserved"}
          </p>

          <p
            className={cn(
              "mt-1.5 text-[0.65rem] leading-tight",
              hasBookings
                ? "font-medium text-green-800"
                : "text-[var(--foreground-muted)]",
            )}
          >
            {hasBookings ? "Passengers booked" : "Awaiting bookings"}
          </p>
        </div>
      </div>
    </section>
  );
}
