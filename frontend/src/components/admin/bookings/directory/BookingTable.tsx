
'use client';

import { BookingTableRow } from './BookingTableRow';

import type { AdminBooking } from '@/features/admin/bookings';

interface BookingTableProps {
  bookings: AdminBooking[];
  onView?: (booking: AdminBooking) => void;
  className?: string;
}

const TABLE_HEADERS = [
  { label: 'Booking', align: 'text-left' },
  { label: 'Route', align: 'text-left' },
  { label: 'Passenger', align: 'text-left' },
  { label: 'Booking status', align: 'text-left' },
  { label: 'Payment', align: 'text-left' },
  { label: 'Amount', align: 'text-right' },
  { label: 'Departure', align: 'text-left' },
  { label: 'Actions', align: 'text-right' },
] as const;

export function BookingTable({
  bookings,
  onView,
  className = '',
}: BookingTableProps) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] ${className}`}
    >
      <table className="w-full min-w-[1100px] border-collapse text-left">
        <caption className="sr-only">
          Admin booking records
        </caption>

        <thead className="bg-[var(--background-subtle)]">
          <tr className="border-b border-[var(--border)]">
            {TABLE_HEADERS.map((header) => (
              <th
                key={header.label}
                scope="col"
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)] ${header.align}`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--border-subtle)]">
          {bookings.map((booking) => (
            <BookingTableRow
              key={booking.publicId}
              booking={booking}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
