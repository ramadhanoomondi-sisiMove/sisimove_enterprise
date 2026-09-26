// -----------------------------------------------------------------------------
// sisiMove — Messaging Message List Loading
// -----------------------------------------------------------------------------
//
// Loading presentation only.
//
// The message query remains owned by MessagingMessageList.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { Skeleton } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingMessageListLoading({
  className,
  ...props
}: ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      {...props}
      className={cn(
        'min-h-0 overflow-hidden',
        'bg-[var(--background-subtle)]',
        className,
      )}
      aria-label="Loading messages"
      aria-busy="true"
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
        {/* Incoming message */}
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-[var(--radius-full)]" />

          <div className="max-w-[78%] space-y-2">
            <Skeleton className="h-12 w-48 rounded-[var(--radius-xl)]" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex justify-end">
          <div className="max-w-[78%] space-y-2">
            <Skeleton className="h-16 w-56 rounded-[var(--radius-xl)]" />

            <div className="flex justify-end">
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Incoming message */}
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-[var(--radius-full)]" />

          <div className="max-w-[78%] space-y-2">
            <Skeleton className="h-10 w-40 rounded-[var(--radius-xl)]" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex justify-end">
          <div className="max-w-[78%] space-y-2">
            <Skeleton className="h-12 w-44 rounded-[var(--radius-xl)]" />

            <div className="flex justify-end">
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}