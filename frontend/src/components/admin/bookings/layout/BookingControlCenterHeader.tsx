
import type { ReactNode } from 'react';
import { CalendarCheck2 } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

interface BookingControlCenterHeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function BookingControlCenterHeader({
  title = 'Booking Control Center',
  description = 'Monitor and manage journey bookings, payment status, and booking activity.',
  actions,
  className,
}: BookingControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--brand)]">
          <CalendarCheck2 aria-hidden="true" className="size-5" />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {title}
          </h1>

          {description && (
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)]">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}

export type { BookingControlCenterHeaderProps };
