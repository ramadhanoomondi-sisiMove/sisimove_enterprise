
'use client';

import {
  CalendarCheck,
  CheckCircle2,
  CircleX,
  PlayCircle,
  Route,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyActivityMetrics } from '@/features/admin/journeys/models/journey-metrics.model';

interface JourneyActivityOverviewProps {
  metrics: JourneyActivityMetrics;
  className?: string;
}

interface ActivityItem {
  key: keyof JourneyActivityMetrics;
  label: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
}

const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    key: 'createdToday',
    label: 'Created',
    description: 'Journeys created today',
    icon: Route,
    iconClassName: 'text-blue-600',
    iconBackgroundClassName: 'bg-blue-50',
  },
  {
    key: 'publishedToday',
    label: 'Published',
    description: 'Journeys published today',
    icon: CalendarCheck,
    iconClassName: 'text-indigo-600',
    iconBackgroundClassName: 'bg-indigo-50',
  },
  {
    key: 'startedToday',
    label: 'Started',
    description: 'Journeys started today',
    icon: PlayCircle,
    iconClassName: 'text-amber-600',
    iconBackgroundClassName: 'bg-amber-50',
  },
  {
    key: 'completedToday',
    label: 'Completed',
    description: 'Journeys completed today',
    icon: CheckCircle2,
    iconClassName: 'text-green-600',
    iconBackgroundClassName: 'bg-green-50',
  },
  {
    key: 'cancelledToday',
    label: 'Cancelled',
    description: 'Journeys cancelled today',
    icon: CircleX,
    iconClassName: 'text-red-600',
    iconBackgroundClassName: 'bg-red-50',
  },
];

export default function JourneyActivityOverview({
  metrics,
  className,
}: JourneyActivityOverviewProps) {
  return (
    <section
      aria-labelledby="journey-activity-heading"
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6',
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="journey-activity-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Today&apos;s activity
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Journey lifecycle activity recorded today.
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--foreground-secondary)]">
          Daily overview
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {ACTIVITY_ITEMS.map((item) => {
          const Icon = item.icon;
          const value = metrics[item.key];

          return (
            <div
              key={item.key}
              className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            >
              <div className="flex items-center justify-between gap-3">
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

                <span className="text-2xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums">
                  {value.toLocaleString()}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
