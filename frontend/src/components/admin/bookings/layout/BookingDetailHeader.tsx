
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

interface BookingDetailHeaderProps {
  title: string;
  description?: string;
  reference?: string;
  status?: ReactNode;
  actions?: ReactNode;
  onBack?: () => void;
  className?: string;
}

export function BookingDetailHeader({
  title,
  description,
  reference,
  status,
  actions,
  onBack,
  className,
}: BookingDetailHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to bookings
          </button>
        ) : (
          <span />
        )}

        {actions && (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {title}
            </h1>
            {status}
          </div>

          {reference && (
            <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
              Booking reference:{' '}
              <span className="font-mono font-medium text-[var(--foreground)]">
                {reference}
              </span>
            </p>
          )}

          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)]">
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

export type { BookingDetailHeaderProps };
