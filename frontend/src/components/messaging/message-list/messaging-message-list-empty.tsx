// -----------------------------------------------------------------------------
// sisiMove — Messaging Message List Empty State
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { MessageCircle } from 'lucide-react';

import { EmptyState } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingMessageListEmpty({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'bg-[var(--background-subtle)]',
        className,
      )}
      aria-label="No messages"
    >
      <EmptyState
        icon={<MessageCircle className="h-5 w-5" />}
        title="No messages yet"
        description="Start the conversation by sending a message."
      />
    </div>
  );
}