
'use client';

import { useState } from 'react';

import {
  useCancelJourney,
  useCompleteJourney,
  useExpireJourney,
  useStartJourney,
} from '@/features/admin/journeys/hooks';

import {
  JourneyActionsMenu,
  JourneyOperationDialog,
  JourneyOperationFeedback,
} from '../operations';

type JourneyLifecycleActionsProps = {
  journeyPublicId: string;
  status: string;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  expiredAt?: string | null;
};

type LifecycleAction = 'start' | 'complete' | 'cancel' | 'expire';

type FeedbackState = {
  variant: 'success' | 'error';
  title: string;
  message?: string;
};

const terminalStatuses = new Set([
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
]);

const actionDetails: Record<
  LifecycleAction,
  {
    title: string;
    description: string;
    confirmLabel: string;
    successMessage: string;
    warning?: string;
  }
> = {
  start: {
    title: 'Start journey',
    description: 'Confirm that this journey should be started.',
    confirmLabel: 'Start journey',
    successMessage: 'The journey has been started successfully.',
  },
  complete: {
    title: 'Complete journey',
    description: 'Confirm that this journey should be marked complete.',
    confirmLabel: 'Complete journey',
    successMessage: 'The journey has been completed successfully.',
    warning: 'Make sure the journey has reached its intended destination.',
  },
  cancel: {
    title: 'Cancel journey',
    description: 'Provide a reason before cancelling this journey.',
    confirmLabel: 'Cancel journey',
    successMessage: 'The journey has been cancelled successfully.',
    warning:
      'Cancellation is a consequential operation. The backend will validate whether this transition is permitted.',
  },
  expire: {
    title: 'Expire journey',
    description: 'Confirm that this journey should be expired.',
    confirmLabel: 'Expire journey',
    successMessage: 'The journey has been expired successfully.',
    warning: 'Only expire the journey when appropriate.',
  },
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'The lifecycle operation failed. Please try again.';
}

export default function JourneyLifecycleActions({
  journeyPublicId,
  status,
  startedAt,
  completedAt,
  cancelledAt,
  expiredAt,
}: JourneyLifecycleActionsProps) {
  const [selectedAction, setSelectedAction] =
    useState<LifecycleAction | null>(null);

  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const startMutation = useStartJourney();
  const completeMutation = useCompleteJourney();
  const cancelMutation = useCancelJourney();
  const expireMutation = useExpireJourney();

  const normalizedStatus = status.trim().toUpperCase();

  const isTerminal =
    terminalStatuses.has(normalizedStatus) ||
    Boolean(completedAt || cancelledAt || expiredAt);

  const isPending =
    startMutation.isPending ||
    completeMutation.isPending ||
    cancelMutation.isPending ||
    expireMutation.isPending;

  const canStart =
    normalizedStatus === 'PUBLISHED' &&
    !startedAt &&
    !isTerminal;

  const canComplete =
    ['STARTED', 'IN_PROGRESS', 'ONGOING'].includes(normalizedStatus) &&
    Boolean(startedAt) &&
    !isTerminal;

  const canExpire =
    ['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(normalizedStatus) &&
    !startedAt &&
    !isTerminal;

  const canCancel = !isTerminal;

  function openAction(action: LifecycleAction) {
    setErrorMessage(null);
    setFeedback(null);

    if (action === 'cancel') {
      setReason('');
    }

    setSelectedAction(action);
  }

  function closeDialog(open: boolean) {
    if (isPending && !open) return;

    if (!open) {
      setSelectedAction(null);
      setErrorMessage(null);
    }
  }

  async function confirmAction(): Promise<void> {
    if (!selectedAction || isPending) return;

    setErrorMessage(null);
    setFeedback(null);

    const id = journeyPublicId.trim();

    if (!id) {
      setErrorMessage('Journey public ID is missing.');
      return;
    }

    if (selectedAction === 'cancel' && !reason.trim()) {
      setErrorMessage('Enter a reason for cancelling this journey.');
      return;
    }

    const action = selectedAction;

    try {
      switch (action) {
        case 'start':
          await startMutation.mutateAsync({
            journeyPublicId: id,
          });
          break;

        case 'complete':
          await completeMutation.mutateAsync({
            journeyPublicId: id,
          });
          break;

        case 'cancel':
          await cancelMutation.mutateAsync({
            journeyPublicId: id,
            request: {
              reason: reason.trim(),
            },
          });
          break;

        case 'expire':
          await expireMutation.mutateAsync({
            journeyPublicId: id,
          });
          break;
      }

      setSelectedAction(null);
      setReason('');

      setFeedback({
        variant: 'success',
        title: actionDetails[action].title,
        message: actionDetails[action].successMessage,
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  const actions = [
    {
      id: 'start',
      label: 'Start journey',
      description: 'Begin this journey.',
      disabled: isPending,
      hidden: !canStart,
      onSelect: () => openAction('start'),
    },
    {
      id: 'complete',
      label: 'Complete journey',
      description: 'Mark this journey as completed.',
      disabled: isPending,
      hidden: !canComplete,
      onSelect: () => openAction('complete'),
    },
    {
      id: 'cancel',
      label: 'Cancel journey',
      description: 'Cancel with a recorded reason.',
      disabled: isPending,
      destructive: true,
      hidden: !canCancel,
      onSelect: () => openAction('cancel'),
    },
    {
      id: 'expire',
      label: 'Expire journey',
      description: 'Mark this journey as expired.',
      disabled: isPending,
      hidden: !canExpire,
      onSelect: () => openAction('expire'),
    },
  ];

  const details = selectedAction
    ? actionDetails[selectedAction]
    : null;

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-[var(--foreground)]">
            Lifecycle controls
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Current status: {status || 'Unknown'}
          </p>
        </div>

        <JourneyActionsMenu
          actions={actions}
          label="Journey actions"
          variant="button"
          align="end"
          disabled={isPending || !journeyPublicId.trim()}
        />
      </div>

      {feedback && (
        <JourneyOperationFeedback
          variant={feedback.variant}
          title={feedback.title}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {!canStart && !canComplete && !canCancel && !canExpire && (
        <p className="text-sm text-[var(--foreground-muted)]">
          No lifecycle actions are available for this status.
        </p>
      )}

      <JourneyOperationDialog
        open={selectedAction !== null}
        onOpenChange={closeDialog}
        title={details?.title ?? 'Journey operation'}
        description={details?.description ?? ''}
        confirmLabel={details?.confirmLabel}
        cancelLabel="Keep current status"
        pendingLabel="Processing..."
        pending={isPending}
        variant={selectedAction === 'cancel' ? 'danger' : 'primary'}
        warning={details?.warning}
        errorMessage={errorMessage ?? undefined}
        onConfirm={() => {
          void confirmAction();
        }}
      >
        {selectedAction === 'cancel' && (
          <div className="space-y-2">
            <label
              htmlFor="journey-cancellation-reason"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Cancellation reason
              <span className="ml-1 text-[var(--danger)]">*</span>
            </label>

            <textarea
              id="journey-cancellation-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setErrorMessage(null);
              }}
              rows={4}
              required
              disabled={isPending}
              placeholder="Explain why this journey is being cancelled."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="text-xs text-[var(--foreground-muted)]">
              The cancellation reason will be submitted to the backend.
            </p>
          </div>
        )}
      </JourneyOperationDialog>
    </section>
  );
}
