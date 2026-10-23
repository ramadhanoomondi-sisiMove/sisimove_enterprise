
'use client';

import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react';

import type { AdminBoarding } from '@/features/admin/boardings/models';
import {
  AdminBoardingParticipantRole,
  AdminBoardingParticipantStatus,
  AdminBoardingStatus,
} from '@/features/admin/boardings/models';

import { BoardingPublicId } from '@/components/admin/boardings/shared';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface BoardingProviderPanelProps {
  boarding: AdminBoarding;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDateTime(value?: string | null): string {
  if (!value) return 'Not recorded';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

function getProviderStatus(boarding: AdminBoarding) {
  if (boarding.status === AdminBoardingStatus.CANCELLED) {
    return {
      label: 'Boarding cancelled',
      className:
        'bg-[var(--danger-soft)] text-[var(--danger)] ring-[var(--danger)]/20',
      Icon: XCircle,
    };
  }

  if (boarding.status === AdminBoardingStatus.STARTED) {
    return {
      label: 'Journey started',
      className:
        'bg-[var(--success-soft)] text-[var(--success)] ring-[var(--success)]/20',
      Icon: CheckCircle2,
    };
  }

  const provider = boarding.participants.find(
    (participant) =>
      participant.role === AdminBoardingParticipantRole.PROVIDER,
  );

  if (provider?.status === AdminBoardingParticipantStatus.BOARDED) {
    return {
      label: 'Provider boarded',
      className:
        'bg-[var(--success-soft)] text-[var(--success)] ring-[var(--success)]/20',
      Icon: CheckCircle2,
    };
  }

  if (boarding.status === AdminBoardingStatus.BOARDING) {
    return {
      label: 'Boarding in progress',
      className:
        'bg-[var(--brand-soft)] text-[var(--brand)] ring-[var(--brand)]/20',
      Icon: Clock3,
    };
  }

  return {
    label: 'Awaiting boarding',
    className:
      'bg-[var(--background-muted)] text-[var(--foreground-secondary)] ring-[var(--border)]',
    Icon: Clock3,
  };
}

// -----------------------------------------------------------------------------
// Boarding Provider Panel
// -----------------------------------------------------------------------------

export function BoardingProviderPanel({
  boarding,
}: BoardingProviderPanelProps) {
  const provider = boarding.participants.find(
    (participant) =>
      participant.role === AdminBoardingParticipantRole.PROVIDER,
  );

  const status = getProviderStatus(boarding);
  const StatusIcon = status.Icon;

  return (
    <section
      aria-labelledby="boarding-provider-heading"
      className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--border)] px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
            <ShieldCheck size={22} aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="boarding-provider-heading"
              className="text-lg font-bold text-[var(--foreground)]"
            >
              Provider boarding
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Provider identity and boarding confirmation.
            </p>
          </div>
        </div>

        <span
          className={cn(
            'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset',
            status.className,
          )}
        >
          <StatusIcon size={14} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      {/* Provider identity */}
      <div className="px-5 py-6 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]">
            <UserRound size={27} aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Provider public ID
            </p>

            <div className="mt-2">
              <BoardingPublicId
                publicId={boarding.providerPublicId}
                copyable
              />
            </div>

            <div className="mt-3">
              {provider ? (
                <div>
                  <p className="text-xs font-medium text-[var(--foreground-muted)]">
                    Provider participant ID
                  </p>

                  <div className="mt-1">
                    <BoardingPublicId
                      publicId={provider.publicId}
                      copyable
                      compact
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--foreground-secondary)]">
                  No provider participant record is included in this boarding
                  response.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation details */}
      <div className="border-t border-[var(--border)] bg-[var(--background-subtle)] px-5 py-5 sm:px-6">
        <h3 className="mb-4 text-sm font-bold text-[var(--foreground)]">
          Boarding confirmation
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Provider participant status
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {provider
                ? provider.status.replaceAll('_', ' ')
                : 'Not available'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Provider boarded at
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {formatDateTime(provider?.boardedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Boarding started
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {formatDateTime(boarding.boardingStartedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Journey started
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {formatDateTime(boarding.journeyStartedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Missing provider data notice */}
      {!provider && (
        <div
          role="note"
          className="border-t border-[var(--warning)]/30 bg-[var(--warning-soft)] px-5 py-4 sm:px-6"
        >
          <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
            The provider ID is available on the boarding record, but provider
            participant details are missing from the loaded data. Provider
            boarding confirmation cannot be established from this response
            alone.
          </p>
        </div>
      )}
    </section>
  );
}

export default BoardingProviderPanel;
