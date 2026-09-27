'use client';

// -----------------------------------------------------------------------------
// sisiMove — Support Case Empty State
// -----------------------------------------------------------------------------
//
// Reusable empty state for the member-facing Support case collection.
//
// Responsibilities:
// - explain that no Support cases exist;
// - provide the primary action for opening a new case.
//
// Non-responsibilities:
// - loading Support data;
// - determining whether the user is authorized to create a case;
// - creating the case itself.
//
// -----------------------------------------------------------------------------

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface SupportCaseEmptyStateProps {
  /**
   * Optional explanatory message.
   */
  description?: string;
}

export function SupportCaseEmptyState({
  description = 'If you need help with a journey, booking, payment, account, or another SisiMove issue, you can contact support.',
}: SupportCaseEmptyStateProps) {
  const router = useRouter();

  function handleContactSupport() {
    router.push('/support/new');
  }

  return (
    <Card
      variant="default"
      padding="lg"
      className="text-center"
    >
      <div
        className={[
          'mx-auto',
          'flex',
          'max-w-md',
          'flex-col',
          'items-center',
        ].join(' ')}
      >
        <div
          aria-hidden="true"
          className={[
            'flex',
            'h-10',
            'w-10',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-full)]',
            'bg-[var(--brand-soft)]',
            'text-[var(--brand)]',
            'text-sm',
            'font-semibold',
          ].join(' ')}
        >
          ?
        </div>

        <h2
          className={[
            'mt-4',
            'text-base',
            'font-semibold',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          No support cases
        </h2>

        <p
          className={[
            'mt-2',
            'text-sm',
            'leading-6',
            'text-[var(--foreground-secondary)]',
          ].join(' ')}
        >
          {description}
        </p>

        <Button
          type="button"
          className="mt-5"
          size="md"
          variant="primary"
          onClick={handleContactSupport}
        >
          Contact support
        </Button>
      </div>
    </Card>
  );
}

