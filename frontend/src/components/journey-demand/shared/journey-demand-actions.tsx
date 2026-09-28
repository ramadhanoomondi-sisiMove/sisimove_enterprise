// src/features/journey-demands/components/shared/journey-demand-actions.tsx

import type { ReactNode } from 'react';

import { Button } from '@/components/ui';

export interface JourneyDemandActionsProps {
  /**
   * Opens the Journey Demand detail surface.
   *
   * Navigation is owned by the parent.
   */
  readonly onView?: () => void;

  /**
   * Joins the Journey Demand.
   *
   * The parent owns the mutation and authorization decision.
   */
  readonly onJoin?: () => void;

  readonly viewLabel?: string;
  readonly joinLabel?: string;
  readonly joiningLabel?: string;

  /**
   * Whether the Join Demand mutation is currently processing.
   */
  readonly isJoining?: boolean;

  readonly viewDisabled?: boolean;
  readonly joinDisabled?: boolean;

  readonly viewLeadingContent?: ReactNode;
  readonly joinLeadingContent?: ReactNode;

  /**
   * Controls action density.
   */
  readonly emphasis?: 'compact' | 'default';

  readonly className?: string;
}

export function JourneyDemandActions({
  onView,
  onJoin,
  viewLabel = 'View Demand',
  joinLabel = 'Join Demand',
  joiningLabel = 'Joining…',
  isJoining = false,
  viewDisabled = false,
  joinDisabled = false,
  viewLeadingContent,
  joinLeadingContent,
  emphasis = 'compact',
  className,
}: JourneyDemandActionsProps) {
  const hasViewAction = onView !== undefined;
  const hasJoinAction = onJoin !== undefined;

  if (!hasViewAction && !hasJoinAction) {
    return null;
  }

  const size = emphasis === 'compact' ? 'sm' : 'md';

  return (
    <div
      className={[
        'flex',
        'w-full',
        'flex-wrap',
        'items-center',
        'gap-2',
        'sm:w-auto',
        'sm:justify-end',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {hasViewAction && (
        <Button
          type="button"
          variant="outline"
          size={size}
          disabled={viewDisabled}
          onClick={onView}
          className={[
            'min-w-0',
            'max-w-full',
            'flex-1',
            'whitespace-normal',
            'break-words',
            'sm:flex-none',
          ].join(' ')}
        >
          {viewLeadingContent}
          <span className="min-w-0 text-center">
            {viewLabel}
          </span>
        </Button>
      )}

      {hasJoinAction && (
        <Button
          type="button"
          variant="primary"
          size={size}
          disabled={joinDisabled || isJoining}
          onClick={onJoin}
          className={[
            'min-w-0',
            'max-w-full',
            'flex-1',
            'whitespace-normal',
            'break-words',
            'sm:flex-none',
          ].join(' ')}
        >
          {joinLeadingContent}
          <span className="min-w-0 text-center">
            {isJoining ? joiningLabel : joinLabel}
          </span>
        </Button>
      )}
    </div>
  );
}
