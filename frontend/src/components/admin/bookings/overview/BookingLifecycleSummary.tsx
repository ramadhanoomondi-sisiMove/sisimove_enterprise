
import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  ListChecks,
  XCircle,
  CalendarCheck,
} from 'lucide-react';

import type { AdminBookingSummary } from '@/features/admin/bookings/models/admin-booking-summary.model';

import { BookingMetricCard } from './BookingMetricCard';

interface BookingLifecycleSummaryProps {
  summary: AdminBookingSummary;
  className?: string;
}

export function BookingLifecycleSummary({
  summary,
  className,
}: BookingLifecycleSummaryProps) {
  const metrics = [
    {
      key: 'total',
      title: 'Total bookings',
      value: summary.totalBookings,
      description: 'All bookings in scope',
      icon: <ListChecks size={18} aria-hidden="true" />,
      tone: 'default' as const,
    },
    {
      key: 'pending',
      title: 'Pending',
      value: summary.pendingBookings,
      description: 'Awaiting confirmation',
      icon: <Clock3 size={18} aria-hidden="true" />,
      tone: 'warning' as const,
    },
    {
      key: 'confirmed',
      title: 'Confirmed',
      value: summary.confirmedBookings,
      description: 'Confirmed bookings',
      icon: <CheckCircle2 size={18} aria-hidden="true" />,
      tone: 'success' as const,
    },
    {
      key: 'completed',
      title: 'Completed',
      value: summary.completedBookings,
      description: 'Completed journeys',
      icon: <CalendarCheck size={18} aria-hidden="true" />,
      tone: 'info' as const,
    },
    {
      key: 'cancelled',
      title: 'Cancelled',
      value: summary.cancelledBookings,
      description: 'Cancelled bookings',
      icon: <XCircle size={18} aria-hidden="true" />,
      tone: 'danger' as const,
    },
    {
      key: 'expired',
      title: 'Expired',
      value: summary.expiredBookings,
      description: 'Expired bookings',
      icon: <CircleDashed size={18} aria-hidden="true" />,
      tone: 'default' as const,
    },
  ];

  return (
    <section
      aria-labelledby="booking-lifecycle-heading"
      className={className}
    >
      <div className="mb-4">
        <h2
          id="booking-lifecycle-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Booking lifecycle
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Booking counts grouped by their current lifecycle status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <BookingMetricCard
            key={metric.key}
            title={metric.title}
            value={metric.value.toLocaleString()}
            description={metric.description}
            icon={metric.icon}
            tone={metric.tone}
          />
        ))}
      </div>
    </section>
  );
}

export type { BookingLifecycleSummaryProps };
