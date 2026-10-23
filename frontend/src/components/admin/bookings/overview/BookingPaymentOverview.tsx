
import {
  Banknote,
  CircleDollarSign,
  RotateCcw,
} from 'lucide-react';

import type { AdminBookingFinancialSummary } from '@/features/admin/bookings/models/admin-booking-summary.model';

import { BookingMetricCard } from './BookingMetricCard';

interface BookingPaymentOverviewProps {
  summary: AdminBookingFinancialSummary;
  className?: string;
}

function formatMoney(
  amount: number,
  currency: string,
): string {
  if (!Number.isFinite(amount)) {
    return '—';
  }

  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE')}`;
  }
}

export function BookingPaymentOverview({
  summary,
  className,
}: BookingPaymentOverviewProps) {
  const currency = summary.currency;

  const metrics = [
    {
      key: 'booking-value',
      title: 'Total booking value',
      value: formatMoney(summary.totalBookingValue, currency),
      description: `Booking value in ${currency}`,
      icon: <CircleDollarSign size={18} aria-hidden="true" />,
      tone: 'default' as const,
    },
    {
      key: 'captured',
      title: 'Captured payments',
      value: formatMoney(summary.totalCapturedAmount, currency),
      description: `Payments captured in ${currency}`,
      icon: <Banknote size={18} aria-hidden="true" />,
      tone: 'success' as const,
    },
    {
      key: 'refunded',
      title: 'Refunded amount',
      value: formatMoney(summary.totalRefundedAmount, currency),
      description: `Refunds in ${currency}`,
      icon: <RotateCcw size={18} aria-hidden="true" />,
      tone: 'warning' as const,
    },
  ];

  return (
    <section
      aria-labelledby="booking-payment-overview-heading"
      className={className}
    >
      <div className="mb-4">
        <h2
          id="booking-payment-overview-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Payment overview
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Booking value, captured payments, and refunds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <BookingMetricCard
            key={metric.key}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            tone={metric.tone}
          />
        ))}
      </div>
    </section>
  );
}

export type { BookingPaymentOverviewProps };
