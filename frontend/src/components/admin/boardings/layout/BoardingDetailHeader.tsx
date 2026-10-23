// src/features/admin/boardings/layout/BoardingDetailHeader.tsx

import { ArrowLeft, ClipboardList } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { BoardingStatusBadge } from '../shared/BoardingStatusBadge';
import { BoardingPublicId } from '../shared/BoardingPublicId';
import { cn } from '@/foundation/utils/cn';

import type { AdminBoardingStatus } from '@/features/admin/boardings';
import type { ReactNode } from 'react';

export interface BoardingDetailHeaderProps {
  publicId: string;
  status: AdminBoardingStatus | string;
  journeyId?: string;
  providerPublicId?: string;
  title?: string;
  backHref?: string;
  actions?: ReactNode;
  className?: string;
}

export function BoardingDetailHeader({
  publicId,
  status,
  journeyId,
  providerPublicId,
  title = 'Boarding details',
  backHref = '/admin/bookings',
  actions,
  className,
}: BoardingDetailHeaderProps) {
  return (
    <header
      className={cn(
        'space-y-5 border-b border-[var(--border)] pb-6',
        className,
      )}
    >
      <a
        href={backHref}
        className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:text-[var(--brand)]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to bookings
      </a>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
            </span>

            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {title}
            </h1>

            <BoardingStatusBadge status={status} />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="text-[var(--foreground-muted)]">
              Boarding ID
            </span>

            <BoardingPublicId publicId={publicId} copyable />
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {journeyId && (
              <p>
                <span className="text-[var(--foreground-muted)]">
                  Journey:{' '}
                </span>
                <span className="font-mono text-[var(--foreground-secondary)]">
                  {journeyId}
                </span>
              </p>
            )}

            {providerPublicId && (
              <p>
                <span className="text-[var(--foreground-muted)]">
                  Provider:{' '}
                </span>
                <span className="font-mono text-[var(--foreground-secondary)]">
                  {providerPublicId}
                </span>
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      <Badge variant="outline">Administrative record</Badge>
    </header>
  );
}
