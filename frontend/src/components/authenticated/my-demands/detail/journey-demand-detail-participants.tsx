// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Participants
// -----------------------------------------------------------------------------
//
// Presents the members participating in a Journey Demand.
//
// Responsibilities:
// - Display active and historical participants.
// - Display requested seats for each participant.
// - Display participant lifecycle status.
//
// This component is presentation-only. Participant data is supplied by the
// parent detail container and is not fetched here.
// -----------------------------------------------------------------------------

import { Badge, Card } from '@/components/ui';

import type { JourneyDemandParticipant } from '@/features/journey-demand/models';

export interface JourneyDemandDetailParticipantsProps {
  participants: JourneyDemandParticipant[];
}

const STATUS_LABELS: Record<
  JourneyDemandParticipant['status'],
  string
> = {
  ACTIVE: 'Active',
  WITHDRAWN: 'Withdrawn',
  REMOVED: 'Removed',
};

function getStatusVariant(
  status: JourneyDemandParticipant['status'],
): 'default' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'ACTIVE':
      return 'success';

    case 'WITHDRAWN':
      return 'warning';

    case 'REMOVED':
      return 'danger';

    default:
      return 'default';
  }
}

export function JourneyDemandDetailParticipants({
  participants,
}: JourneyDemandDetailParticipantsProps) {
  return (
    <Card padding="lg">
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Participants
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Members currently associated with this journey demand.
          </p>
        </div>

        {participants.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              No participants have been added yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {participants.map((participant) => (
              <ParticipantRow
                key={participant.publicId}
                participant={participant}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

interface ParticipantRowProps {
  participant: JourneyDemandParticipant;
}

function ParticipantRow({
  participant,
}: ParticipantRowProps) {
  const statusLabel =
    STATUS_LABELS[participant.status] ?? participant.status;

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">
          Member {participant.memberPublicId}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {participant.seats}{' '}
          {participant.seats === 1 ? 'seat' : 'seats'}
        </p>
      </div>

      <Badge variant={getStatusVariant(participant.status)}>
        {statusLabel}
      </Badge>
    </div>
  );
}