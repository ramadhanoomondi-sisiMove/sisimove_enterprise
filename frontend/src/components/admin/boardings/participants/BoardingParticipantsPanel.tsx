
'use client';

import { Users } from 'lucide-react';

import type { AdminBoardingParticipant } from '@/features/admin/boardings/models';
import { AdminBoardingParticipantRole } from '@/features/admin/boardings/models';

import { BoardingParticipantRow } from './BoardingParticipantRow';
import { BoardingParticipantSummary } from './BoardingParticipantSummary';

interface BoardingParticipantsPanelProps {
  participants: AdminBoardingParticipant[];
}

export function BoardingParticipantsPanel({
  participants,
}: BoardingParticipantsPanelProps) {
  const sortedParticipants = [...participants].sort((a, b) => {
    if (
      a.role === AdminBoardingParticipantRole.PROVIDER &&
      b.role !== AdminBoardingParticipantRole.PROVIDER
    ) {
      return -1;
    }

    if (
      b.role === AdminBoardingParticipantRole.PROVIDER &&
      a.role !== AdminBoardingParticipantRole.PROVIDER
    ) {
      return 1;
    }

    return a.expectedAt.localeCompare(b.expectedAt);
  });

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)]">
            <Users className="h-5 w-5" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Boarding participants
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Provider and passenger boarding records
            </p>
          </div>
        </div>

        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-sm font-medium tabular-nums text-[var(--foreground)]">
          {participants.length}
        </span>
      </div>

      <BoardingParticipantSummary participants={participants} />

      {sortedParticipants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] px-6 py-10 text-center">
          <Users
            className="mx-auto h-8 w-8 text-[var(--muted-foreground)]"
            aria-hidden="true"
          />
          <h3 className="mt-3 font-medium text-[var(--foreground)]">
            No participants recorded
          </h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Participant records will appear here when available.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedParticipants.map((participant) => (
            <BoardingParticipantRow
              key={participant.publicId}
              participant={participant}
            />
          ))}
        </div>
      )}
    </section>
  );
}
