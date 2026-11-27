
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';
import type { AdminJourneyCompletion } from '@/features/admin/journey-completion/models';

import {
  JourneyCompletionJourneyLink,
  JourneyCompletionProviderLink,
  JourneyCompletionPublicId,
  JourneyCompletionStatusBadge,
} from '../shared';

export interface JourneyCompletionDetailHeaderProps {
  completion: AdminJourneyCompletion;
  journeyHref: string;
  providerHref: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function JourneyCompletionDetailHeader({
  completion,
  journeyHref,
  providerHref,
  title = 'Journey completion details',
  description,
  actions,
  className,
}: JourneyCompletionDetailHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        'rounded-[var(--radius-lg)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4 sm:p-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
              {title}
            </h1>

            <JourneyCompletionStatusBadge
              status={completion.status}
            />
          </div>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
              {description}
            </p>
          )}

          <div className="mt-3">
            <JourneyCompletionPublicId
              publicId={completion.publicId}
              prefix="Completion"
            />
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      <div className="grid gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Journey
          </p>

          <div className="mt-1">
            <JourneyCompletionJourneyLink
              publicId={completion.journeyPublicId}
              href={journeyHref}
            />
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Provider
          </p>

          <div className="mt-1">
            <JourneyCompletionProviderLink
              publicId={completion.providerPublicId}
              href={providerHref}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
