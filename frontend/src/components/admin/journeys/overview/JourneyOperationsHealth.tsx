
'use client';

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Users,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyOperationsMetrics } from '@/features/admin/journeys/models/journey-metrics.model';

interface JourneyOperationsHealthProps {
  metrics: JourneyOperationsMetrics;
  className?: string;
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

function getSeatUtilization(
  bookedSeats: number,
  totalSeats: number,
): number | null {
  if (totalSeats <= 0) return null;

  return Math.min(100, Math.max(0, (bookedSeats / totalSeats) * 100));
}

export default function JourneyOperationsHealth({
  metrics,
  className,
}: JourneyOperationsHealthProps) {
  const utilization = getSeatUtilization(
    metrics.bookedSeats,
    metrics.totalSeats,
  );

  const operationalItems = [
    {
      label: 'Journeys at capacity',
      description: 'No remaining seats',
      value: metrics.journeysAtCapacity,
      icon: AlertTriangle,
      iconClassName: 'text-amber-600',
      iconBackgroundClassName: 'bg-amber-50',
    },
    {
      label: 'Journeys in progress',
      description: 'Currently underway',
      value: metrics.journeysInProgress,
      icon: Gauge,
      iconClassName: 'text-blue-600',
      iconBackgroundClassName: 'bg-blue-50',
    },
    {
      label: 'Awaiting completion',
      description: 'Completion still pending',
      value: metrics.journeysAwaitingCompletion,
      icon: ClipboardCheck,
      iconClassName: 'text-violet-600',
      iconBackgroundClassName: 'bg-violet-50',
    },
  ];

  return (
    <section
      aria-labelledby="journey-operations-heading"
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6',
        className,
      )}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--brand-soft)]">
            <Gauge
              aria-hidden="true"
              className="size-5 text-[var(--brand)]"
            />
          </div>

          <div>
            <h2
              id="journey-operations-heading"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Operations health
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Seat capacity and active journey workload.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                Seat utilization
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums">
                {utilization === null
                  ? '—'
                  : `${Math.round(utilization)}%`}
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface)]">
              <Users
                aria-hidden="true"
                className="size-5 text-[var(--brand)]"
              />
            </div>
          </div>

          <div
            className="mt-5 h-2.5 overflow-hidden rounded-full bg-[var(--border)]"
            role="progressbar"
            aria-label="Seat utilization"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={utilization === null ? undefined : Math.round(utilization)}
          >
            <div
              className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-500"
              style={{ width: `${utilization ?? 0}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-[var(--foreground-muted)]">
              {formatNumber(metrics.bookedSeats)} booked
            </span>
            <span className="font-medium text-[var(--foreground-secondary)]">
              {formatNumber(metrics.availableSeats)} available
            </span>
          </div>

          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">
                Total seat capacity
              </span>
              <span className="font-semibold text-[var(--foreground)] tabular-nums">
                {formatNumber(metrics.totalSeats)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
          {operationalItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                    item.iconBackgroundClassName,
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn('size-5', item.iconClassName)}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </div>

                <span className="text-xl font-semibold text-[var(--foreground)] tabular-nums">
                  {formatNumber(item.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3">
        <CheckCircle2
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
        />
        <p className="text-xs leading-5 text-[var(--foreground-muted)]">
          These indicators reflect the supplied operations metrics. They do not
          independently determine whether a journey is safe, delayed, or
          compliant.
        </p>
      </div>
    </section>
  );
}
