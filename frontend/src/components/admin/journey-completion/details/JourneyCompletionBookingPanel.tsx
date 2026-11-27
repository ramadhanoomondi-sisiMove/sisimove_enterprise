
import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionPublicId } from '../shared/JourneyCompletionPublicId';
import { JourneyCompletionEntityLink } from '../shared/JourneyCompletionEntityLink';

export interface JourneyCompletionBookingPanelProps {
  bookingPublicId?: string | null;
  bookingHref?: string | null;
  className?: string;
}

export function JourneyCompletionBookingPanel({
  bookingPublicId,
  bookingHref,
  className,
}: JourneyCompletionBookingPanelProps) {
  const normalizedBookingId = bookingPublicId?.trim() ?? '';
  const normalizedBookingHref = bookingHref?.trim() ?? '';
  const hasBooking = normalizedBookingId.length > 0;
  const hasBookingLink = hasBooking && normalizedBookingHref.length > 0;

  return (
    <section
      aria-labelledby="journey-completion-booking-heading"
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div>
        <h2
          id="journey-completion-booking-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Booking information
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Booking associated with this completion confirmation.
        </p>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Booking public ID
        </p>

        {hasBooking ? (
          <div className="mt-2">
            <JourneyCompletionPublicId
              publicId={normalizedBookingId}
              maxLength={32}
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            No booking associated with this confirmation.
          </p>
        )}

        {hasBookingLink && (
          <div className="mt-3">
            <JourneyCompletionEntityLink
              publicId={normalizedBookingId}
              href={normalizedBookingHref}
              prefix="View booking"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default JourneyCompletionBookingPanel;
