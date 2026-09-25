// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Header
// -----------------------------------------------------------------------------
//
// Presents the primary identity and lifecycle state of a Journey Demand.
//
// Responsibilities:
// - Display the demand title/context.
// - Display lifecycle status.
// - Display requester information when available.
// - Provide a concise creation/update context.
//
// This component is presentation-only. It does not fetch data and does not
// perform lifecycle mutations.
// -----------------------------------------------------------------------------

import { Badge, Card } from '@/components/ui';

import type { JourneyDemand } from '@/features/journey-demand/models';
import { JOURNEY_DEMAND_STATUSES } from '@/features/journey-demand/models';

export interface JourneyDemandDetailHeaderProps {
  journeyDemand: JourneyDemand;
}

const STATUS_LABELS: Record<
  (typeof JOURNEY_DEMAND_STATUSES)[number],
  string
> = {
  DRAFT: 'Draft',
  OPEN: 'Open',
  MATCHED: 'Matched',
  CONVERTED: 'Converted',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

function getStatusVariant(
  status: JourneyDemand['status'],
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'OPEN':
      return 'success';

    case 'MATCHED':
      return 'info';

    case 'DRAFT':
      return 'default';

    case 'CONVERTED':
    case 'FULFILLED':
      return 'success';

    case 'CANCELLED':
    case 'EXPIRED':
      return 'danger';

    default:
      return 'default';
  }
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function JourneyDemandDetailHeader({
  journeyDemand,
}: JourneyDemandDetailHeaderProps) {
  const statusLabel =
    STATUS_LABELS[journeyDemand.status] ?? journeyDemand.status;

  const createdDate = formatDate(journeyDemand.createdAt);
  const updatedDate = formatDate(journeyDemand.updatedAt);

  return (
    <Card padding="lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(journeyDemand.status)}>
              {statusLabel}
            </Badge>

            {journeyDemand.matchedJourneyPublicId ? (
              <Badge variant="default">
                Journey matched
              </Badge>
            ) : null}
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Journey demand
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Request {journeyDemand.publicId}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-left text-sm text-slate-500 sm:text-right">
          {createdDate ? (
            <p>
              Created {createdDate}
            </p>
          ) : null}

          {updatedDate && updatedDate !== createdDate ? (
            <p className="mt-1">
              Updated {updatedDate}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}