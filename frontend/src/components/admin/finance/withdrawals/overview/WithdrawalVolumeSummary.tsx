/**
 * SisiMove Admin — Withdrawal Volume Summary
 *
 * Displays daily or monthly withdrawal request counts.
 *
 * Data source:
 * - metrics.dailyVolume
 * - metrics.monthlyVolume
 *
 * This component does not calculate or duplicate the metrics aggregation.
 */

'use client';

import { useMemo, useState } from 'react';

import { Button, Card } from '@/components/ui';

import type { AdminWithdrawalMetrics } from '@/features/admin/finance/withdrawals/models/admin-withdrawal-metrics.model';

type VolumePeriod = 'DAILY' | 'MONTHLY';

interface VolumeBucket {
  key: string;
  label: string;
  count: number;
}

export interface WithdrawalVolumeSummaryProps {
  metrics: AdminWithdrawalMetrics;
  className?: string;
}

const DAILY_BUCKET_COUNT = 14;
const MONTHLY_BUCKET_COUNT = 12;

function getUtcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getUtcMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function createDailyBuckets(now: Date): VolumeBucket[] {
  const formatter = new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

  return Array.from(
    { length: DAILY_BUCKET_COUNT },
    (_, index) => {
      const date = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - (DAILY_BUCKET_COUNT - 1 - index),
        ),
      );

      return {
        key: getUtcDayKey(date),
        label: formatter.format(date),
        count: 0,
      };
    },
  );
}

function createMonthlyBuckets(now: Date): VolumeBucket[] {
  const formatter = new Intl.DateTimeFormat('en-KE', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  });

  return Array.from(
    { length: MONTHLY_BUCKET_COUNT },
    (_, index) => {
      const date = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth() - (MONTHLY_BUCKET_COUNT - 1 - index),
          1,
        ),
      );

      return {
        key: getUtcMonthKey(date),
        label: formatter.format(date),
        count: 0,
      };
    },
  );
}

function buildDailyBuckets(
  metrics: AdminWithdrawalMetrics,
  now: Date,
): VolumeBucket[] {
  const buckets = createDailyBuckets(now);

  const volumeByDate = new Map(
    metrics.dailyVolume.map(({ date, count }) => [
      date,
      count,
    ]),
  );

  return buckets.map((bucket) => ({
    ...bucket,
    count: volumeByDate.get(bucket.key) ?? 0,
  }));
}

function buildMonthlyBuckets(
  metrics: AdminWithdrawalMetrics,
  now: Date,
): VolumeBucket[] {
  const buckets = createMonthlyBuckets(now);

  const volumeByMonth = new Map(
    metrics.monthlyVolume.map(({ month, count }) => [
      month,
      count,
    ]),
  );

  return buckets.map((bucket) => ({
    ...bucket,
    count: volumeByMonth.get(bucket.key) ?? 0,
  }));
}

export function WithdrawalVolumeSummary({
  metrics,
  className,
}: WithdrawalVolumeSummaryProps) {
  const [period, setPeriod] = useState<VolumePeriod>('DAILY');

  const buckets = useMemo(() => {
    const now = new Date();

    return period === 'DAILY'
      ? buildDailyBuckets(metrics, now)
      : buildMonthlyBuckets(metrics, now);
  }, [metrics, period]);

  const maximumCount = Math.max(
    1,
    ...buckets.map((bucket) => bucket.count),
  );

  const totalInPeriod = buckets.reduce(
    (total, bucket) => total + bucket.count,
    0,
  );

  const peakBucket = buckets.reduce<VolumeBucket | null>(
    (peak, bucket) =>
      !peak || bucket.count > peak.count ? bucket : peak,
    null,
  );

  const chartDescription = buckets
    .map((bucket) => `${bucket.label}: ${bucket.count}`)
    .join('; ');

  return (
    <Card className={className}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Withdrawal Volume
          </h3>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Number of withdrawal requests over time.
          </p>
        </div>

        <div
          className="inline-flex w-fit items-center gap-1 rounded-[var(--radius-md)] bg-[var(--background-muted)] p-1"
          role="group"
          aria-label="Withdrawal volume period"
        >
          <Button
            type="button"
            size="sm"
            variant={period === 'DAILY' ? 'secondary' : 'ghost'}
            aria-pressed={period === 'DAILY'}
            onClick={() => setPeriod('DAILY')}
          >
            Daily
          </Button>

          <Button
            type="button"
            size="sm"
            variant={period === 'MONTHLY' ? 'secondary' : 'ghost'}
            aria-pressed={period === 'MONTHLY'}
            onClick={() => setPeriod('MONTHLY')}
          >
            Monthly
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[var(--foreground-muted)]">
            Requests in selected period
          </p>

          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {totalInPeriod.toLocaleString('en-KE')}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--foreground-muted)]">
            Highest period
          </p>

          <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            {peakBucket && peakBucket.count > 0
              ? `${peakBucket.label} · ${peakBucket.count}`
              : '—'}
          </p>
        </div>
      </div>

      <div
        className="grid h-48 items-end gap-1"
        style={{
          gridTemplateColumns: `repeat(${buckets.length}, minmax(0, 1fr))`,
        }}
        role="img"
        aria-label={`${period.toLowerCase()} withdrawal request counts. ${chartDescription}`}
      >
        {buckets.map((bucket) => {
          const height =
            bucket.count > 0
              ? Math.max(
                  4,
                  (bucket.count / maximumCount) * 100,
                )
              : 0;

          return (
            <div
              key={bucket.key}
              className="flex h-full min-w-0 flex-col items-center justify-end gap-2"
              title={`${bucket.label}: ${bucket.count} withdrawals`}
            >
              <div className="flex h-full w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t-sm bg-[var(--brand)] transition-[height] duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-3 grid gap-1 text-center text-[10px] text-[var(--foreground-muted)]"
        style={{
          gridTemplateColumns: `repeat(${buckets.length}, minmax(0, 1fr))`,
        }}
        aria-hidden="true"
      >
        {buckets.map((bucket, index) => {
          const showLabel =
            period === 'MONTHLY' ||
            index === 0 ||
            index === buckets.length - 1 ||
            index % 2 === 0;

          return (
            <span key={bucket.key} className="truncate">
              {showLabel ? bucket.label : ''}
            </span>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-[var(--foreground-muted)]">
        {period === 'DAILY'
          ? 'Showing the last 14 calendar days.'
          : 'Showing the last 12 calendar months.'}{' '}
        All withdrawal statuses are included.
      </p>
    </Card>
  );
}