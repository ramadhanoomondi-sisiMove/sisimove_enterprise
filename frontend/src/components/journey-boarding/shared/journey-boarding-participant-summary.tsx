'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant Summary
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch a participant summary through the shared query hook.
// - Present participant profile, verification, trust, and experience information.
// - Present contact details only when included in the read model.
// - Handle loading, error, and retry states.
// - Reuse the same component for providers and passengers.
//
// Architectural rules:
// - HTTP execution remains in the API adapter.
// - Response mapping remains in the mapper layer.
// - React Query state and caching remain in the query hook.
// - The backend remains authoritative for contact visibility and verification.
// - No authorization or participant lifecycle rules belong here.
// -----------------------------------------------------------------------------

import Image from 'next/image';

import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Globe,
  Mail,
  MessageSquareText,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trophy,
  Waypoints,
} from 'lucide-react';

import {
  ErrorState,
  Skeleton,
} from '@/components/ui';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';

import {
  useJourneyBoardingParticipantSummary,
} from '@/features/journey-boarding/hooks/queries';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBoardingParticipantSummaryProps {
  /**
   * Public identifier of the journey boarding.
   */
  journeyBoardingPublicId: string;

  /**
   * Identity public identifier of the participant whose summary is requested.
   */
  participantIdentityPublicId: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatExpiryDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function ParticipantSummaryLoadingState() {
  return (
    <Card variant="default" padding="md">
      <div
        role="status"
        aria-label="Loading participant summary"
        aria-busy="true"
        className="flex flex-col gap-5"
      >
        <div className="flex items-start gap-4">
          <Skeleton
            className="size-16 shrink-0"
            radius="full"
          />

          <div className="grid min-w-0 flex-1 gap-2">
            <Skeleton className="h-5 w-40 max-w-full" />
            <Skeleton className="h-4 w-28 max-w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <Skeleton className="h-28 w-full" radius="lg" />
        <Skeleton className="h-36 w-full" radius="lg" />
        <Skeleton className="h-24 w-full" radius="lg" />
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingParticipantSummary({
  journeyBoardingPublicId,
  participantIdentityPublicId,
}: JourneyBoardingParticipantSummaryProps) {
  const normalizedJourneyBoardingPublicId =
    journeyBoardingPublicId.trim();

  const normalizedParticipantIdentityPublicId =
    participantIdentityPublicId.trim();

  const identifiersAreValid =
    normalizedJourneyBoardingPublicId.length > 0 &&
    normalizedParticipantIdentityPublicId.length > 0;

  const summaryQuery = useJourneyBoardingParticipantSummary({
    journeyBoardingPublicId:
      normalizedJourneyBoardingPublicId,
    participantIdentityPublicId:
      normalizedParticipantIdentityPublicId,
    enabled: identifiersAreValid,
  });

  if (!identifiersAreValid) {
    return (
      <ErrorState
        title="Participant unavailable"
        description="Valid journey and participant identifiers are required to load this summary."
      />
    );
  }

  if (summaryQuery.isPending) {
    return <ParticipantSummaryLoadingState />;
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <ErrorState
        title="Unable to load participant summary"
        description="We couldn't retrieve this participant's profile and trust information. Please try again."
        retryAction={{
          label: 'Try again',
          onClick: () => void summaryQuery.refetch(),
        }}
      />
    );
  }

  const summary = summaryQuery.data;
  const { participant, contact, verification, trust } = summary;

  const isVerified = verification.verified;
  const isVerificationActive = verification.active;

  const accountIsActive =
    participant.accountStatus.toLowerCase() === 'active';

  const verificationVariant = isVerified
    ? 'success'
    : isVerificationActive
      ? 'warning'
      : 'default';

  const accountStatusVariant = accountIsActive
    ? 'success'
    : 'default';

  return (
    <Card variant="default" padding="md">
      <section
        aria-label="Participant summary"
        className="flex min-w-0 flex-col gap-5"
      >
        {/* ----------------------------------------------------------------- */}
        {/* Profile Header                                                    */}
        {/* ----------------------------------------------------------------- */}

        <header className="surface-brand rounded-[var(--radius-xl)] p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-4">
            <Avatar
              src={participant.avatarUrl}
              alt={`${participant.handle} profile`}
              fallback={participant.handle}
              size="xl"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-lg font-semibold tracking-tight text-[var(--foreground)]">
                  {participant.handle}
                </h2>

                <Badge
                  variant={accountStatusVariant}
                  size="sm"
                  leadingContent={
                    accountIsActive ? (
                      <CheckCircle2
                        size={13}
                        aria-hidden="true"
                      />
                    ) : undefined
                  }
                >
                  {participant.accountStatus}
                </Badge>
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--foreground-secondary)]">
                <Globe
                  size={15}
                  aria-hidden="true"
                  className="shrink-0 text-[var(--foreground-muted)]"
                />
                <span>{participant.countryCode}</span>
              </p>

              {participant.bio && (
                <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-[var(--foreground-secondary)]">
                  {participant.bio}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* Verification                                                      */}
        {/* ----------------------------------------------------------------- */}

        <section
          aria-label="Participant verification"
          className="space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={19}
                aria-hidden="true"
                className="text-[var(--brand)]"
              />

              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Verification
              </h3>
            </div>

            <Badge
              variant={verificationVariant}
              leadingContent={
                isVerified ? (
                  <BadgeCheck size={14} aria-hidden="true" />
                ) : isVerificationActive ? (
                  <ShieldCheck size={14} aria-hidden="true" />
                ) : (
                  <ShieldAlert size={14} aria-hidden="true" />
                )
              }
            >
              {isVerified
                ? 'Verified'
                : isVerificationActive
                  ? 'Active'
                  : 'Inactive'}
            </Badge>
          </div>

          <div className="surface-muted grid grid-cols-1 gap-4 rounded-[var(--radius-lg)] p-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-xs text-[var(--foreground-muted)]">
                Verification status
              </p>

              <p className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
                {verification.status}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[var(--foreground-muted)]">
                Verification level
              </p>

              <p className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
                {verification.level}
              </p>
            </div>
          </div>

          <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
            {isVerificationActive
              ? 'Verification is currently active.'
              : 'Verification is not currently active.'}
          </p>

          {verification.expiresAt && (
            <p className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
              <CalendarClock
                size={14}
                aria-hidden="true"
                className="shrink-0"
              />

              <span>
                Expires {formatExpiryDate(verification.expiresAt)}
              </span>
            </p>
          )}
        </section>

        <Divider />

        {/* ----------------------------------------------------------------- */}
        {/* Trust and Experience                                              */}
        {/* ----------------------------------------------------------------- */}

        <section
          aria-label="Participant trust information"
          className="space-y-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
              <Trophy size={19} aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Trust and experience
              </h3>

              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Ratings and journey history
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Rating */}

            <div className="surface-muted min-w-0 rounded-[var(--radius-lg)] p-3">
              <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                <Star
                  size={15}
                  aria-hidden="true"
                  className={
                    trust.ratingCount > 0
                      ? 'fill-current text-[var(--warning)]'
                      : ''
                  }
                />

                <p className="text-xs">Rating</p>
              </div>

              <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums text-[var(--foreground)]">
                {trust.ratingCount > 0
                  ? trust.ratingAverage.toFixed(1)
                  : '—'}
              </p>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {trust.ratingCount > 0
                  ? 'Average rating'
                  : 'Not yet rated'}
              </p>
            </div>

            {/* Reviews */}

            <div className="surface-muted min-w-0 rounded-[var(--radius-lg)] p-3">
              <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                <MessageSquareText
                  size={15}
                  aria-hidden="true"
                />

                <p className="text-xs">Reviews</p>
              </div>

              <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums text-[var(--foreground)]">
                {trust.ratingCount}
              </p>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Ratings received
              </p>
            </div>

            {/* Completed journeys */}

            <div className="surface-muted min-w-0 rounded-[var(--radius-lg)] p-3">
              <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                <Waypoints
                  size={15}
                  aria-hidden="true"
                />

                <p className="text-xs">Journeys</p>
              </div>

              <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums text-[var(--foreground)]">
                {trust.completedJourneys}
              </p>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Completed
              </p>
            </div>

            {/* Trust level */}

            <div className="surface-muted min-w-0 rounded-[var(--radius-lg)] p-3">
              <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                <ShieldCheck
                  size={15}
                  aria-hidden="true"
                />

                <p className="text-xs">Trust level</p>
              </div>

              <p className="mt-2 break-words text-base font-semibold text-[var(--foreground)]">
                {trust.verificationLevel}
              </p>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Verification level
              </p>
            </div>
          </div>

          {/* Trust Badges */}

          {trust.badges.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <BadgeCheck
                  size={17}
                  aria-hidden="true"
                  className="text-[var(--brand)]"
                />

                Badges and recognition
              </h4>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {trust.badges.map((badge) => (
                  <li
                    key={badge.publicId}
                    className="flex min-w-0 items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-3 transition-colors hover:bg-[var(--background-subtle)]"
                  >
                    {badge.asset ? (
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--background-muted)]">
                        <Image
                          src={badge.asset.url}
                          alt={badge.asset.alt || ''}
                          fill
                          sizes="40px"
                          unoptimized
                          className="object-contain p-1"
                        />
                      </span>
                    ) : (
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
                        <Trophy size={19} aria-hidden="true" />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-medium text-[var(--foreground)]">
                        {badge.name}
                      </p>

                      {badge.description && (
                        <p className="mt-1 break-words text-sm leading-5 text-[var(--foreground-secondary)]">
                          {badge.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* Authorized Contact                                                */}
        {/* ----------------------------------------------------------------- */}

        {contact && (
          <>
            <Divider />

            <section
              aria-label="Participant contact information"
              className="space-y-3"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
                  <MessageSquareText
                    size={18}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Contact information
                  </h3>

                  <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                    Contact details available for this request
                  </p>
                </div>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <Mail
                    size={17}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--foreground-muted)]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[var(--foreground-muted)]">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm text-[var(--foreground)]">
                      {contact.email}
                    </p>
                  </div>
                </div>

                <Divider />

                <div className="mt-4 flex min-w-0 items-start gap-3">
                  <Phone
                    size={17}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--foreground-muted)]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[var(--foreground-muted)]">
                      Phone
                    </p>

                    <p className="mt-1 break-words text-sm text-[var(--foreground)]">
                      {contact.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Verification Disclaimer                                           */}
        {/* ----------------------------------------------------------------- */}

        <footer className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
          <ShieldAlert
            size={17}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[var(--foreground-muted)]"
          />

          <p className="text-xs leading-5 text-[var(--foreground-muted)]">
            {summary.verificationDisclaimer}
          </p>
        </footer>
      </section>
    </Card>
  );
}