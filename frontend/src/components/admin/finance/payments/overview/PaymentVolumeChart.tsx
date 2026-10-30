// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Volume Chart
// -----------------------------------------------------------------------------
//
// Displays payment activity from supplied trend points.
// "Volume" here means payment count, not summed monetary value.
// No synthetic data or charting dependency is introduced.
// -----------------------------------------------------------------------------

import type { AdminFinancialPaymentTrendPoint } from '@/features/admin/finance/payments';

export interface PaymentVolumeChartProps {
  data: AdminFinancialPaymentTrendPoint[];
  title?: string;
  description?: string;
  className?: string;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function PaymentVolumeChart({
  data,
  title = 'Payment activity',
  description = 'Payment counts over the reporting period.',
  className,
}: PaymentVolumeChartProps) {
  const maxCount = Math.max(
    1,
    ...data.map((point) => Math.max(0, point.paymentCount)),
  );

  return (
    <section
      aria-labelledby="payment-volume-chart-title"
      className={[
        'rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5 sm:p-6',
        className ?? '',
      ].join(' ')}
    >
      <div>
        <h2
          id="payment-volume-chart-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          {title}
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          {description}
        </p>
      </div>

      {data.length === 0 ? (
        <div className="mt-5 flex min-h-40 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-subtle)] px-4 text-center">
          <p className="max-w-sm text-sm text-[var(--foreground-muted)]">
            No payment trend data is available for this reporting period.
          </p>
        </div>
      ) : (
        <>
          <div
            className="mt-6 grid items-end gap-3"
            style={{
              gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
            }}
            role="img"
            aria-label="Payment count by reporting date"
          >
            {data.map((point, index) => {
              const count = Math.max(0, point.paymentCount);
              const height = Math.max(4, (count / maxCount) * 160);

              return (
                <div
                  key={`${point.date}-${index}`}
                  className="flex min-w-0 flex-col items-center justify-end gap-2"
                  title={`${formatDate(point.date)}: ${count} payments`}
                >
                  <span className="text-xs font-medium tabular-nums text-[var(--foreground-secondary)]">
                    {count.toLocaleString()}
                  </span>

                  <div className="flex h-40 w-full items-end justify-center rounded-t-md bg-[var(--background-subtle)]">
                    <div
                      className="w-full max-w-10 rounded-t-md bg-[var(--brand)]"
                      style={{ height: `${height}px` }}
                    />
                  </div>

                  <span className="max-w-full truncate text-xs text-[var(--foreground-muted)]">
                    {formatDate(point.date)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--foreground-secondary)]">
            <span>
              Successful payments:{' '}
              <strong className="tabular-nums text-[var(--foreground)]">
                {data
                  .reduce((sum, point) => sum + Math.max(0, point.succeededCount), 0)
                  .toLocaleString()}
              </strong>
            </span>

            <span>
              Failed payments:{' '}
              <strong className="tabular-nums text-[var(--foreground)]">
                {data
                  .reduce((sum, point) => sum + Math.max(0, point.failedCount), 0)
                  .toLocaleString()}
              </strong>
            </span>
          </div>
        </>
      )}
    </section>
  );
}

export default PaymentVolumeChart;