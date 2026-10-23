
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Hash,
  MapPin,
  Route,
  Users,
  XCircle,
} from 'lucide-react';

import type { AdminBoarding } from '@/features/admin/boardings/models';
import { AdminBoardingStatus } from '@/features/admin/boardings/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface BoardingJourneyPanelProps {
  boarding: AdminBoarding;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDateTime(value?: string | null): string {
  if (!value) return 'Not recorded';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

function getStatusPresentation(status: AdminBoardingStatus) {
  switch (status) {
    case AdminBoardingStatus.NOT_STARTED:
      return {
        label: 'Not started',
        className: 'bg-slate-100 text-slate-700 ring-slate-200',
        Icon: Clock3,
      };

    case AdminBoardingStatus.BOARDING:
      return {
        label: 'Boarding in progress',
        className: 'bg-blue-50 text-blue-700 ring-blue-200',
        Icon: Users,
      };

    case AdminBoardingStatus.STARTED:
      return {
        label: 'Journey started',
        className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        Icon: CheckCircle2,
      };

    case AdminBoardingStatus.CANCELLED:
      return {
        label: 'Cancelled',
        className: 'bg-red-50 text-red-700 ring-red-200',
        Icon: XCircle,
      };

    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

// -----------------------------------------------------------------------------
// Small presentation components
// -----------------------------------------------------------------------------

function DetailItem({
  icon: Icon,
  label,
  value,
  breakAll = false,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div className="flex min-w-0 gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon size={17} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p
          className={`mt-1 text-sm font-semibold text-slate-900 ${
            breakAll ? 'break-all' : 'break-words'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  value,
  description,
  active = false,
}: {
  label: string;
  value: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      <div className="relative flex w-4 shrink-0 justify-center">
        <span
          className={`mt-1.5 h-3 w-3 rounded-full ring-4 ring-white ${
            active ? 'bg-blue-600' : 'bg-slate-300'
          }`}
        />

        <span className="absolute top-5 h-full w-px bg-slate-200 last:hidden" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{value}</p>
        </div>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Boarding Journey Panel
// -----------------------------------------------------------------------------

export function BoardingJourneyPanel({
  boarding,
}: BoardingJourneyPanelProps) {
  const status = getStatusPresentation(boarding.status);
  const StatusIcon = status.Icon;

  return (
    <section
      aria-labelledby="boarding-journey-heading"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Route size={22} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Boarding operations
              </p>

              <h2
                id="boarding-journey-heading"
                className="mt-1 text-lg font-bold text-slate-950"
              >
                Journey overview
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                Boarding ID: {boarding.publicId}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${status.className}`}
          >
            <StatusIcon size={15} aria-hidden="true" />
            {status.label}
          </span>
        </div>
      </div>

      {/* Journey details */}
      <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <DetailItem
          icon={Compass}
          label="Journey ID"
          value={boarding.journeyId}
          breakAll
        />

        <DetailItem
          icon={Users}
          label="Provider ID"
          value={boarding.providerPublicId}
          breakAll
        />

        <DetailItem
          icon={Hash}
          label="Boarding version"
          value={String(boarding.version)}
        />

        <DetailItem
          icon={Users}
          label="Participants"
          value={String(boarding.participants.length)}
        />

        <DetailItem
          icon={CheckCircle2}
          label="Boarded participants"
          value={String(
            boarding.participants.filter(
              (participant) => participant.status === 'BOARDED',
            ).length,
          )}
        />

        <DetailItem
          icon={CalendarDays}
          label="Activity events"
          value={String(boarding.events.length)}
        />
      </div>

      {/* Lifecycle timeline */}
      <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-6 sm:px-6">
        <div className="mb-5 flex items-center gap-2">
          <Clock3 size={18} className="text-slate-600" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-900">
            Lifecycle timeline
          </h3>
        </div>

        <div className="space-y-0">
          <TimelineItem
            label="Boarding record created"
            value={formatDateTime(boarding.createdAt)}
            description="The boarding record was registered."
            active
          />

          <TimelineItem
            label="Boarding opened"
            value={formatDateTime(boarding.boardingStartedAt)}
            description="The recorded time boarding began."
            active={Boolean(boarding.boardingStartedAt)}
          />

          <TimelineItem
            label="Journey started"
            value={formatDateTime(boarding.journeyStartedAt)}
            description="The recorded journey start time."
            active={Boolean(boarding.journeyStartedAt)}
          />

          {boarding.cancelledAt && (
            <TimelineItem
              label="Boarding cancelled"
              value={formatDateTime(boarding.cancelledAt)}
              description="The recorded cancellation time."
              active
            />
          )}
        </div>
      </div>

      {/* Record metadata */}
      <div className="grid grid-cols-1 gap-4 border-t border-slate-200 px-5 py-4 sm:grid-cols-2 sm:px-6">
        <DetailItem
          icon={CalendarDays}
          label="Last updated"
          value={formatDateTime(boarding.updatedAt)}
        />

        <DetailItem
          icon={MapPin}
          label="Record status"
          value={status.label}
        />
      </div>
    </section>
  );
}

export default BoardingJourneyPanel;
