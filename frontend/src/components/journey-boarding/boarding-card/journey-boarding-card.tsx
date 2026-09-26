// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Card
// -----------------------------------------------------------------------------
//
// Presents a compact Journey Boarding summary for reusable authenticated
// operational surfaces.
//
// Responsibilities:
// - Present the essential Journey Boarding identity and lifecycle state.
// - Present boarding progress.
// - Present participant counts.
// - Provide an optional navigation action through `href`.
//
// Non-responsibilities:
// - Does not fetch Journey Boarding data.
// - Does not perform mutations.
// - Does not manage lifecycle transitions.
// - Does not render the complete boarding operation surface.
// - Does not resolve traveller/profile information.
// - Does not invent Journey or booking data.
//
// Architectural rules:
// - The component consumes the frontend JourneyBoarding model only.
// - Backend aggregate state remains authoritative.
// - Public identifiers remain opaque strings.
// - Navigation is delegated to the supplied href.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import {
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  JourneyBoardingStatus,
  type JourneyBoarding,
} from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  Badge,
  Card,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

import { JourneyBoardingProgress } from '../boarding-progress/journey-boarding-progress';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBoardingCardProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;

  /**
   * Optional destination for opening the full boarding surface.
   *
   * When omitted, the card remains informational and does not render a
   * navigation action.
   */
  href?: string;

  /**
   * Optional card heading.
   *
   * Defaults to "Journey boarding".
   */
  title?: string;
}

// -----------------------------------------------------------------------------
// Presentation helpers
// -----------------------------------------------------------------------------

function getStatusPresentation(status: JourneyBoardingStatus): {
  label: string;
  variant:
    | 'default'
    | 'brand'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline';
} {
  switch (status) {
    case JourneyBoardingStatus.NOT_STARTED:
      return {
        label: 'Not started',
        variant: 'default',
      };

    case JourneyBoardingStatus.BOARDING:
      return {
        label: 'Boarding',
        variant: 'brand',
      };

    case JourneyBoardingStatus.STARTED:
      return {
        label: 'Started',
        variant: 'success',
      };

    case JourneyBoardingStatus.CANCELLED:
      return {
        label: 'Cancelled',
        variant: 'danger',
      };

    default:
      return {
        label: 'Unknown',
        variant: 'outline',
      };
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingCard({
  boarding,
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

  return (
    <Card
      variant="default"
      padding="md"
      interactive={Boolean(href)}
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-[var(--foreground)]">
              {title}
            </h2>

            <p className="mt-1 truncate font-mono text-xs text-[var(--foreground-muted)]">
              {boarding.publicId}
            </p>
          </div>

          <Badge
            variant={status.variant}
            size="sm"
          >
            {status.label}
          </Badge>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* ----------------------------------------------------------------- */}
        {/* Boarding progress                                                  */}
        {/* ----------------------------------------------------------------- */}

        <JourneyBoardingProgress boarding={boarding} />

        {/* ----------------------------------------------------------------- */}
        {/* Participant summary                                                */}
        {/* ----------------------------------------------------------------- */}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] px-3 py-2">
            <p className="text-xs text-[var(--foreground-muted)]">
              Passengers
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {passengerCount}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] px-3 py-2">
            <p className="text-xs text-[var(--foreground-muted)]">
              Boarded
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {boardedPassengerCount}
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Boarding identifiers                                               */}
        {/* ----------------------------------------------------------------- */}

        <div className="border-t border-[var(--border-subtle)] pt-3">
          <dl className="grid gap-2 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs text-[var(--foreground-muted)]">
                Journey
              </dt>

              <dd className="mt-0.5 truncate font-mono text-xs text-[var(--foreground-secondary)]">
                {boarding.journeyId}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-xs text-[var(--foreground-muted)]">
                Boarding
              </dt>

              <dd className="mt-0.5 truncate font-mono text-xs text-[var(--foreground-secondary)]">
                {boarding.publicId}
              </dd>
            </div>
          </dl>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Navigation                                                         */}
        {/* ----------------------------------------------------------------- */}

        {href && (
          <div className="border-t border-[var(--border-subtle)] pt-3">
            <Link
              href={href}
              className={[
                'inline-flex',
                'min-h-9',
                'w-full',
                'items-center',
                'justify-center',
                'rounded-[var(--radius-md)]',
                'border',
                'border-[var(--border-strong)]',
                'bg-transparent',
                'px-3',
                'text-sm',
                'font-medium',
                'text-[var(--foreground)]',
                'whitespace-nowrap',
                'transition-colors',
                'duration-150',
                'ease-out',
                'hover:bg-[var(--background-subtle)]',
                'hover:border-[var(--foreground-subtle)]',
                'active:bg-[var(--background-muted)]',
                'focus-visible:outline-2',
                'focus-visible:outline-[var(--brand)]',
                'focus-visible:outline-offset-2',
                'sm:w-auto',
              ].join(' ')}
            >
              View boarding
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}