'use client';

import { Skeleton } from '@/components/ui';
import { cn } from '@/foundation';

/**
 * Props for the authenticated Journey Demand loading state.
 */
export interface MyJourneyDemandLoadingProps {
  readonly className?: string;
}

/**
 * Presents the loading state for an owner's Journey Demand detail.
 *
 * This component deliberately does not:
 * - fetch data;
 * - determine loading state;
 * - perform authorization;
 * - manage request state.
 *
 * The owning route/container decides when this presentation is rendered.
 *
 * Skeleton dimensions are supplied through className because the shared
 * Skeleton primitive intentionally exposes arbitrary sizing through its
 * HTML className rather than dedicated width/height props.
 */
export function MyJourneyDemandLoading({
  className,
}: MyJourneyDemandLoadingProps) {
  return (
    <div
      className={cn(
        'min-w-0 space-y-4',
        className,
      )}
      aria-busy="true"
      aria-label="Loading Journey Demand"
    >
      <section className="surface min-w-0 p-4 sm:p-5">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />

            <Skeleton className="h-6 w-full max-w-xs" />
          </div>

          <Skeleton
            className="h-6 w-20"
            radius="full"
          />
        </div>

        <div className="mt-5 space-y-3">
          <Skeleton className="h-4 w-full max-w-sm" />

          <Skeleton className="h-4 w-full max-w-xs" />

          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-4 w-24" />

            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </section>

      <section className="surface min-w-0 p-4 sm:p-5">
        <Skeleton className="h-5 w-20" />

        <Skeleton className="mt-3 h-4 w-full max-w-xs" />
      </section>
    </div>
  );
}

