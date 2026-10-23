
'use client';

import {
  CheckCircle2,
  Clock3,
  UserX,
  Users,
} from 'lucide-react';

import type { AdminBoardingParticipant } from '@/features/admin/boardings/models';
import {
  AdminBoardingParticipantRole,
  AdminBoardingParticipantStatus,
} from '@/features/admin/boardings/models';

interface BoardingParticipantSummaryProps {
  participants: AdminBoardingParticipant[];
}

export function BoardingParticipantSummary({
  participants,
}: BoardingParticipantSummaryProps) {
  const passengerParticipants = participants.filter(
    (participant) =>
      participant.role === AdminBoardingParticipantRole.PASSENGER,
  );

  const boarded = passengerParticipants.filter(
    (participant) =>
      participant.status === AdminBoardingParticipantStatus.BOARDED,
  ).length;

  const expected = passengerParticipants.filter(
    (participant) =>
      participant.status === AdminBoardingParticipantStatus.EXPECTED,
  ).length;

  const exceptions = passengerParticipants.filter(
    (participant) =>
      participant.status === AdminBoardingParticipantStatus.NO_SHOW ||
      participant.status === AdminBoardingParticipantStatus.WITHDRAWN ||
      participant.status === AdminBoardingParticipantStatus.REMOVED,
  ).length;

  const metrics = [
    {
      label: 'Passengers',
      value: passengerParticipants.length,
      icon: Users,
      color: 'text-[var(--foreground)]',
    },
    {
      label: 'Boarded',
      value: boarded,
      icon: CheckCircle2,
      color: 'text-[var(--success)]',
    },
    {
      label: 'Awaiting',
      value: expected,
      icon: Clock3,
      color: 'text-[var(--warning)]',
    },
    {
      label: 'Exceptions',
      value: exceptions,
      icon: UserX,
      color: 'text-[var(--danger)]',
    },
  ];

  return (
    <section
      aria-label="Passenger boarding summary"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {metrics.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-[var(--muted-foreground)]">
              {label}
            </span>
            <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
          </div>

          <p className="mt-3 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {value}
          </p>
        </div>
      ))}
    </section>
  );
}
