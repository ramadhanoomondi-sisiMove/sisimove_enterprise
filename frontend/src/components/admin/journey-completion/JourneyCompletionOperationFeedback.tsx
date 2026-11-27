// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Operation Feedback
// -----------------------------------------------------------------------------
//
// Presentation component for journey-completion operation feedback.
//
// Responsibilities:
// - Communicate pending, successful, and failed operation states.
// - Present consistent feedback using shared UI primitives.
// - Optionally expose retry and dismiss actions.
// - Remain independent of mutations, API calls, and domain lifecycle logic.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  Badge,
  Button,
  Card,
  Spinner,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type JourneyCompletionOperationStatus =
  | 'pending'
  | 'success'
  | 'error';

export interface JourneyCompletionOperationFeedbackProps {
  readonly status: JourneyCompletionOperationStatus;

  readonly title?: string;

  readonly description?: string;

  /**
   * Optional action displayed when the operation fails.
   *
   * The owning component is responsible for retry behavior.
   */
  readonly onRetry?: () => void;

  /**
   * Optional action to dismiss the feedback.
   */
  readonly onDismiss?: () => void;

  readonly retryLabel?: string;

  readonly dismissLabel?: string;

  readonly className?: string;

  readonly children?: ReactNode;
}

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

interface FeedbackConfiguration {
  readonly badge: string;
  readonly badgeVariant: 'brand' | 'success' | 'danger';
  readonly defaultTitle: string;
  readonly defaultDescription: string;
}

const feedbackConfiguration: Record<
  JourneyCompletionOperationStatus,
  FeedbackConfiguration
> = {
  pending: {
    badge: 'Processing',
    badgeVariant: 'brand',
    defaultTitle: 'Processing journey completion',
    defaultDescription:
      'Your request is being processed. Please wait.',
  },

  success: {
    badge: 'Completed',
    badgeVariant: 'success',
    defaultTitle: 'Operation completed',
    defaultDescription:
      'The journey-completion operation was completed successfully.',
  },

  error: {
    badge: 'Failed',
    badgeVariant: 'danger',
    defaultTitle: 'Operation failed',
    defaultDescription:
      'The journey-completion operation could not be completed.',
  },
};

// -----------------------------------------------------------------------------
// Status Indicator
// -----------------------------------------------------------------------------

function StatusIndicator({
  status,
}: {
  readonly status: JourneyCompletionOperationStatus;
}) {
  if (status === 'pending') {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)]"
      >
        <Spinner size="md" label="Processing operation" />
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div
      aria-hidden="true"
      className={[
        'flex',
        'h-10',
        'w-10',
        'shrink-0',
        'items-center',
        'justify-center',
        'rounded-full',
        isSuccess
          ? 'bg-[var(--success-soft)] text-[var(--success)]'
          : 'bg-[var(--danger-soft)] text-[var(--danger)]',
      ].join(' ')}
    >
      {isSuccess ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </svg>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCompletionOperationFeedback({
  status,
  title,
  description,
  onRetry,
  onDismiss,
  retryLabel = 'Try again',
  dismissLabel = 'Dismiss',
  className,
  children,
}: JourneyCompletionOperationFeedbackProps) {
  const configuration = feedbackConfiguration[status];

  const resolvedTitle = title ?? configuration.defaultTitle;
  const resolvedDescription =
    description ?? configuration.defaultDescription;

  return (
    <Card
      padding="md"
      className={className}
    >
      <div
        role={status === 'error' ? 'alert' : 'status'}
        aria-live={status === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        className="flex flex-col gap-4"
      >
        {/* Status heading */}

        <div className="flex items-start gap-3">
          <StatusIndicator status={status} />

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {resolvedTitle}
              </h3>

              <Badge
                variant={configuration.badgeVariant}
                size="sm"
              >
                {configuration.badge}
              </Badge>
            </div>

            <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
              {resolvedDescription}
            </p>
          </div>
        </div>

        {/* Additional contextual content */}

        {children && (
          <div className="border-t border-[var(--border-subtle)] pt-3">
            {children}
          </div>
        )}

        {/* Actions */}

        {(onRetry || onDismiss) && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
              >
                {dismissLabel}
              </Button>
            )}

            {onRetry && status === 'error' && (
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
              >
                {retryLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}