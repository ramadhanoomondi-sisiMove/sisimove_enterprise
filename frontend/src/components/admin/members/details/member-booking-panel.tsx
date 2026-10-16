
"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberDataSection } from "@/components/admin/members/primitives/member-data-section";
import { cn } from "@/foundation/utils/cn";
import { useMemberBookings } from "@/features/admin/members/hooks/use-member-bookings";
import type { MemberBookingApiResponse } from "@/features/admin/members/api/member-bookings.api";

interface MemberBookingPanelProps {
  passengerPublicId: string;
  className?: string;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatMoney(
  amount?: number | null,
  currency?: string | null,
): string {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency || "KES",
    maximumFractionDigits: 2,
  }).format(amount);
}

function statusVariant(
  status: string,
): "success" | "warning" | "danger" | "outline" {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
    case "COMPLETED":
    case "CAPTURED":
    case "AUTHORIZED":
      return "success";

    case "PENDING":
    case "PROCESSING":
      return "warning";

    case "CANCELLED":
    case "FAILED":
    case "EXPIRED":
    case "REFUNDED":
      return "danger";

    default:
      return "outline";
  }
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>
      <div className="mt-1 break-words text-sm text-[var(--foreground)]">
        {value || "—"}
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: MemberBookingApiResponse }) {
  const snapshot = booking.snapshot;
  const pricing = booking.pricing;
  const payment = booking.payment;
  const cancellation = booking.cancellation;

  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Booking reference
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[var(--foreground)]">
            {booking.publicId}
          </p>
        </div>

        <Badge variant={statusVariant(booking.status)}>
          {booking.status.replaceAll("_", " ")}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Detail
          label="Origin"
          value={snapshot?.originName}
        />
        <Detail
          label="Destination"
          value={snapshot?.destinationName}
        />
        <Detail
          label="Departure"
          value={formatDate(snapshot?.departureAt)}
        />
        <Detail
          label="Arrival"
          value={formatDate(snapshot?.arrivalAt)}
        />
        <Detail label="Seats booked" value={booking.seats} />
        <Detail
          label="Journey reference"
          value={booking.journeyPublicId}
        />
        <Detail label="Booking created" value={formatDate(booking.createdAt)} />
        <Detail label="Last updated" value={formatDate(booking.updatedAt)} />
      </div>

      {pricing && (
        <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
          <h4 className="text-sm font-semibold text-[var(--foreground)]">
            Pricing
          </h4>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail
              label="Price per seat"
              value={formatMoney(pricing.pricePerSeat, pricing.currency)}
            />
            <Detail
              label="Subtotal"
              value={formatMoney(pricing.subtotal, pricing.currency)}
            />
            <Detail
              label="Discount"
              value={formatMoney(pricing.discountAmount, pricing.currency)}
            />
            <Detail
              label="Adjustment"
              value={formatMoney(pricing.adjustmentAmount, pricing.currency)}
            />
            <Detail
              label="Total amount"
              value={formatMoney(pricing.totalAmount, pricing.currency)}
            />
            <Detail label="Pricing currency" value={pricing.currency} />
          </div>
        </div>
      )}

      {payment && (
        <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Payment
            </h4>
            <Badge variant={statusVariant(payment.status)}>
              {payment.status.replaceAll("_", " ")}
            </Badge>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail
              label="Payment amount"
              value={formatMoney(payment.amount, payment.currency)}
            />
            <Detail label="Currency" value={payment.currency} />
            <Detail label="Authorized at" value={formatDate(payment.authorizedAt)} />
            <Detail label="Captured at" value={formatDate(payment.capturedAt)} />
            <Detail label="Failed at" value={formatDate(payment.failedAt)} />
            <Detail label="Refunded at" value={formatDate(payment.refundedAt)} />
            <Detail
              label="Transaction reference"
              value={payment.transactionPublicId}
            />
            {payment.failureReason && (
              <Detail label="Failure reason" value={payment.failureReason} />
            )}
          </div>
        </div>
      )}

      {cancellation && (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-3">
          <h4 className="text-sm font-semibold text-[var(--foreground)]">
            Cancellation details
          </h4>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Detail label="Reason" value={cancellation.reason} />
            <Detail
              label="Description"
              value={cancellation.reasonDescription}
            />
            <Detail
              label="Cancelled at"
              value={formatDate(cancellation.cancelledAt)}
            />
            <Detail
              label="Cancelled by"
              value={cancellation.cancelledByPublicId}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--foreground-muted)]">
        {booking.confirmedAt && (
          <span>Confirmed: {formatDate(booking.confirmedAt)}</span>
        )}
        {booking.cancelledAt && (
          <span>Cancelled: {formatDate(booking.cancelledAt)}</span>
        )}
        {booking.completedAt && (
          <span>Completed: {formatDate(booking.completedAt)}</span>
        )}
        {booking.expiredAt && (
          <span>Expired: {formatDate(booking.expiredAt)}</span>
        )}
      </div>
    </article>
  );
}

export function MemberBookingPanel({
  passengerPublicId,
  className,
}: MemberBookingPanelProps) {
  const bookingsQuery = useMemberBookings(passengerPublicId);
  const bookings = bookingsQuery.data;

  return (
    <MemberDataSection
      title="Bookings"
      description="Booking history, journey details, pricing and available payment information for this passenger."
      className={cn("space-y-4", className)}
    >
      {bookingsQuery.isPending ? (
        <div className="space-y-3" aria-label="Loading bookings">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--border)] p-4"
            >
              <div className="h-4 w-40 rounded bg-[var(--background-muted)]" />
              <div className="mt-4 h-3 w-full rounded bg-[var(--background-muted)]" />
              <div className="mt-2 h-3 w-2/3 rounded bg-[var(--background-muted)]" />
            </div>
          ))}
        </div>
      ) : bookingsQuery.isError ? (
        <div
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/30 p-4"
          role="alert"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Could not load bookings.
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Check your access and connection, then try again.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void bookingsQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No bookings found
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            There are no bookings available for this passenger.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--foreground-secondary)]">
              Booking records
            </p>
            <Badge variant="outline">{bookings.length}</Badge>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.publicId} booking={booking} />
            ))}
          </div>
        </>
      )}
    </MemberDataSection>
  );
}

export default MemberBookingPanel;
