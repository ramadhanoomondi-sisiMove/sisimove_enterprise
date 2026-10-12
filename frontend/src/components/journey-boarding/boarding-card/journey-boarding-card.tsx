
// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Card
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present Journey Boarding status and progress.
// - Summarize registered and boarded passengers.
// - Render passenger profile summaries and boarding statuses.
// - Preserve provider participant-management actions.
// - Preserve journey-level actions and technical identifiers.
//
// Architectural rules:
// - The boarding aggregate remains authoritative.
// - Profile and trust data come from the shared participant summary.
// - Boarding lifecycle rules remain in their existing action components.
// - No business logic is implemented in this presentation component.
// -----------------------------------------------------------------------------

import Link from 'next/link';

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Users,
} from 'lucide-react';

import {
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  JourneyBoardingStatus,
  type JourneyBoarding,
} from '@/features/journey-boarding/models';

import { Badge, Card } from '@/components/ui';

import { JourneyBoardingProgress } from '../boarding-progress/journey-boarding-progress';

import {
  JourneyBoardingParticipant,
} from '../boarding-participants';

import {
  MarkPassengerNoShowAction,
  RemoveParticipantAction,
  StartJourneyAction,
  CancelJourneyBoardingAction,
} from '../boarding-actions';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingCardProps {
  boarding: JourneyBoarding;
  isProvider?: boolean;
  href?: string;
  title?: string;
}

type BadgeVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

function getStatusPresentation(
  status: JourneyBoardingStatus,
): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case JourneyBoardingStatus.NOT_STARTED:
      return { label: 'Not started', variant: 'default' };

    case JourneyBoardingStatus.BOARDING:
      return { label: 'Boarding', variant: 'brand' };

    case JourneyBoardingStatus.STARTED:
      return { label: 'Started', variant: 'success' };

    case JourneyBoardingStatus.CANCELLED:
      return { label: 'Cancelled', variant: 'danger' };

    default:
      return { label: 'Unknown', variant: 'outline' };
  }
}

// -----------------------------------------------------------------------------
// Summary Metric
// -----------------------------------------------------------------------------

function SummaryMetric({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--foreground-secondary)]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-[var(--foreground-muted)]">
          {label}
        </p>

        <p className="mt-0.5 text-xl font-semibold tabular-nums text-[var(--foreground)]">
          {value}
        </p>

        <p className="truncate text-xs text-[var(--foreground-secondary)]">
          {detail}
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingCard({
  boarding,
  isProvider = false,
  href,
  title = 'Journey boarding',
}: JourneyBoardingCardProps) {
  const status = getStatusPresentation(boarding.status);

  const passengerParticipants = boarding.participants.filter(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PASSENGER,
  );

  const passengerCount = passengerParticipants.length;

  const boardedPassengerCount = passengerParticipants.filter(
    (participant) =>
      participant.status === JourneyBoardingParticipantStatus.BOARDED,
  ).length;

  const remainingPassengerCount = Math.max(
    0,
    passengerCount - boardedPassengerCount,
  );

  return (
    <Card
      variant="default"
      padding="md"
      interactive={Boolean(href)}
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-brand)] text-[var(--brand)]">
              <Users size={21} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {title}
              </h2>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Passenger boarding overview
              </p>

              <p className="mt-1 truncate font-mono text-xs text-[var(--foreground-muted)]">
                {boarding.publicId}
              </p>
            </div>
          </div>

          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Boarding progress */}

        <section
          aria-label="Boarding progress"
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <Clock3
              size={16}
              className="text-[var(--foreground-muted)]"
              aria-hidden="true"
            />

            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Boarding progress
            </h3>
          </div>

          <JourneyBoardingProgress boarding={boarding} />
        </section>

        {/* Passenger summary metrics */}

        <div className="grid grid-cols-2 gap-3">
          <SummaryMetric
            icon={<Users size={19} aria-hidden="true" />}
            label="Passengers"
            value={passengerCount}
            detail="Registered"
          />

          <SummaryMetric
            icon={<CheckCircle2 size={19} aria-hidden="true" />}
            label="Boarded"
            value={boardedPassengerCount}
            detail={`${remainingPassengerCount} remaining`}
          />
        </div>

        {/* Passenger list and shared profile summaries */}

        <section
          aria-labelledby={`boarding-passengers-${boarding.publicId}`}
          className="border-t border-[var(--border-subtle)] pt-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3
                id={`boarding-passengers-${boarding.publicId}`}
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                Passengers
              </h3>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {isProvider
                  ? 'Review passenger profiles and manage boarding'
                  : 'Registered journey participants'}
              </p>
            </div>

            <Badge variant="outline" size="sm">
              {passengerCount}
            </Badge>
          </div>

          {passengerParticipants.length === 0 ? (
            <div className="mt-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-6 text-center">
              <Users
                size={23}
                className="mx-auto text-[var(--foreground-muted)]"
                aria-hidden="true"
              />

              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                No passengers yet
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Registered passengers will appear here.
              </p>
            </div>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {passengerParticipants.map((participant) => (
                <li
                  key={participant.publicId}
                  className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-3"
                >
                  <JourneyBoardingParticipant
                    journeyBoardingPublicId={boarding.publicId}
                    participant={participant}
                  />

                  {/* Preserve provider-only participant actions */}

                  {isProvider && (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-3">
                      <MarkPassengerNoShowAction
                        boarding={boarding}
                        participant={participant}
                      />

                      <RemoveParticipantAction
                        boarding={boarding}
                        participant={participant}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Provider journey-level actions */}

        {isProvider && (
          <section
            aria-label="Journey boarding actions"
            className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-4"
          >
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Journey actions
            </h3>

            <StartJourneyAction boarding={boarding} />

            <CancelJourneyBoardingAction boarding={boarding} />
          </section>
        )}

        {/* Technical identifiers */}

        <details className="group border-t border-[var(--border-subtle)] pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-[var(--radius-md)] py-1 text-sm text-[var(--foreground-secondary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <span aria-hidden="true">#</span>
              Technical identifiers
            </span>

            <span className="text-xs text-[var(--foreground-muted)] group-open:hidden">
              Show
            </span>

            <span className="hidden text-xs text-[var(--foreground-muted)] group-open:inline">
              Hide
            </span>
          </summary>

          <dl className="mt-3 grid gap-3 rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-3">
            <div className="min-w-0">
              <dt className="text-xs text-[var(--foreground-muted)]">
                Journey ID
              </dt>

              <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                {boarding.journeyId}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-xs text-[var(--foreground-muted)]">
                Boarding ID
              </dt>

              <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                {boarding.publicId}
              </dd>
            </div>
          </dl>
        </details>

        {/* Optional navigation */}

        {href && (
          <div className="border-t border-[var(--border-subtle)] pt-4">
            <Link
              href={href}
              className={[
                'inline-flex min-h-10 w-full items-center justify-center gap-2',
                'rounded-[var(--radius-md)]',
                'border border-[var(--border-strong)]',
                'bg-transparent px-4 text-sm font-medium',
                'text-[var(--foreground)]',
                'transition-colors duration-150',
                'hover:bg-[var(--background-subtle)]',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2',
                'sm:w-auto',
              ].join(' ')}
            >
              View boarding
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
