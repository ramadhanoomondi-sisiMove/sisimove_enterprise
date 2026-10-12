
'use client';

import { Card, Skeleton } from '@/components/ui';

interface JourneyParticipantsSkeletonProps {
  count?: number;
  className?: string;
}

export function JourneyParticipantsSkeleton({
  count = 3,
  className,
}: JourneyParticipantsSkeletonProps) {
  const safeCount = Math.max(1, Math.min(10, Math.floor(count)));

  return (
    <section
      aria-label="Loading journey participants"
      aria-busy="true"
      className={className}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <Skeleton
          radius="md"
          className="h-5 w-44"
          aria-hidden="true"
        />

        <Skeleton
          radius="full"
          className="h-6 w-16"
          aria-hidden="true"
        />
      </div>

      <div className="space-y-3">
        {Array.from({ length: safeCount }, (_, index) => (
          <Card
            key={index}
            padding="md"
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton
                radius="full"
                className="h-11 w-11 shrink-0"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton
                  radius="sm"
                  className="h-4 w-36 max-w-full"
                  aria-hidden="true"
                />

                <Skeleton
                  radius="sm"
                  className="h-3 w-24 max-w-full"
                  aria-hidden="true"
                />
              </div>

              <Skeleton
                radius="full"
                className="h-6 w-20 shrink-0"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-2">
              <Skeleton
                radius="sm"
                className="h-3 w-full"
                aria-hidden="true"
              />

              <Skeleton
                radius="sm"
                className="h-3 w-2/3"
                aria-hidden="true"
              />
            </div>
          </Card>
        ))}
      </div>

      <span className="sr-only">Loading participants. Please wait.</span>
    </section>
  );
}
