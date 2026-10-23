
'use client';

import {
  AlertTriangle,
  LoaderCircle,
  Radio,
  Play,
  UserCheck,
  X,
} from 'lucide-react';

import type { BoardingOperation } from './BoardingActionsMenu';

interface BoardingOperationDialogProps {
  operation: BoardingOperation | null;
  boardingPublicId: string;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const OPERATION_DETAILS: Record<
  BoardingOperation,
  {
    title: string;
    description: string;
    confirmLabel: string;
    Icon: typeof Radio;
    destructive?: boolean;
  }
> = {
  open: {
    title: 'Open boarding?',
    description:
      'This will request that boarding be opened for this journey. The backend will enforce the boarding lifecycle rules.',
    confirmLabel: 'Open boarding',
    Icon: Radio,
  },
  'board-provider': {
    title: 'Confirm provider boarding',
    description:
      'This will record the provider boarding operation for this journey.',
    confirmLabel: 'Confirm provider',
    Icon: UserCheck,
  },
  'start-journey': {
    title: 'Start this journey?',
    description:
      'This will request that the journey starts. Confirm that the boarding details are correct before continuing.',
    confirmLabel: 'Start journey',
    Icon: Play,
  },
  cancel: {
    title: 'Cancel boarding?',
    description:
      'This will request cancellation of the boarding. This action may not be reversible.',
    confirmLabel: 'Cancel boarding',
    Icon: AlertTriangle,
    destructive: true,
  },
};

export function BoardingOperationDialog({
  operation,
  boardingPublicId,
  isPending = false,
  onConfirm,
  onClose,
}: BoardingOperationDialogProps) {
  if (!operation) return null;

  const details = OPERATION_DETAILS[operation];
  const Icon = details.Icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !isPending) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="boarding-operation-title"
        aria-describedby="boarding-operation-description"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              details.destructive
                ? 'bg-[var(--danger)]/10 text-[var(--danger)]'
                : 'bg-[var(--muted)] text-[var(--foreground)]'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={isPending}
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2
          id="boarding-operation-title"
          className="mt-5 text-lg font-semibold text-[var(--foreground)]"
        >
          {details.title}
        </h2>

        <p
          id="boarding-operation-description"
          className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]"
        >
          {details.description}
        </p>

        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-2.5">
          <p className="text-xs text-[var(--muted-foreground)]">
            Boarding reference
          </p>
          <p className="mt-1 break-all text-sm font-medium text-[var(--foreground)]">
            {boardingPublicId}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-50"
          >
            Keep boarding
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${
              details.destructive
                ? 'bg-[var(--danger)] hover:opacity-90'
                : 'bg-[var(--primary)] hover:opacity-90'
            }`}
          >
            {isPending && (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            )}
            {isPending ? 'Processing…' : details.confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
