
import { UserRound } from 'lucide-react';

import {
  BookingSectionHeader,
} from '@/components/admin/bookings/layout';

import { BookingPublicId } from '@/components/admin/bookings/shared';

interface BookingPassengerPanelProps {
  passengerPublicId: string | null | undefined;
  className?: string;
}

export function BookingPassengerPanel({
  passengerPublicId,
  className,
}: BookingPassengerPanelProps) {
  const hasPassengerId =
    typeof passengerPublicId === 'string' &&
    passengerPublicId.trim().length > 0;

  return (
    <section
      className={[
        'rounded-[var(--radius-lg)] border border-[var(--border)] p-5 sm:p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <BookingSectionHeader
        title="Passenger"
        description="Passenger identity reference associated with this booking."
      />

      <div className="mt-5 flex items-start gap-4 rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
          <UserRound
            className="size-5 text-[var(--foreground-secondary)]"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Passenger identity
          </h3>

          {hasPassengerId ? (
            <>
              <div className="text-sm text-[var(--foreground-secondary)]">
                Passenger public ID
              </div>

              <BookingPublicId publicId={passengerPublicId} />
            </>
          ) : (
            <p className="text-sm text-[var(--foreground-secondary)]">
              No passenger public ID is available for this booking.
            </p>
          )}

          <p className="text-xs leading-5 text-[var(--foreground-muted)]">
            This booking record does not provide additional passenger profile
            details here.
          </p>
        </div>
      </div>
    </section>
  );
}

export type { BookingPassengerPanelProps };
