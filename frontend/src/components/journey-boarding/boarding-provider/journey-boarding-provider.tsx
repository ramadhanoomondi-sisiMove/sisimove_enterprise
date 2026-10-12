
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Provider
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Locate the provider participant within the boarding aggregate.
// - Present the provider's shared profile and trust summary.
// - Present the provider's current boarding status.
// - Keep provider profile presentation separate from boarding actions.
//
// Architectural rules:
// - No boarding lifecycle rules are implemented here.
// - The backend aggregate remains authoritative.
// - Profile and verification data come from the shared summary flow.
// - Actions remain owned by the boarding-actions components.
// - Public identifiers remain opaque.
// -----------------------------------------------------------------------------

import {
  BadgeCheck,
  CircleUserRound,
  Fingerprint,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import {
  JourneyBoardingParticipantRole,
  type JourneyBoarding,
  type JourneyBoardingParticipant,
} from '@/features/journey-boarding/models';

import { Badge, Card } from '@/components/ui';

import {
  JourneyBoardingParticipantSummary,
} from '../shared/journey-boarding-participant-summary';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingProviderProps {
  /**
   * Current Journey Boarding aggregate.
   */
  boarding: JourneyBoarding;

  /**
   * Optional provider participant override.
   */
  participant?: JourneyBoardingParticipant;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatParticipantStatus(status: string): string {
  return status
    .split('_')
    .map((part) =>
      part.length > 0
        ? part.charAt(0) + part.slice(1).toLowerCase()
        : part,
    )
    .join(' ');
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingProvider({
  boarding,
  participant,
}: JourneyBoardingProviderProps) {
  const providerParticipant =
    participant ??
    boarding.participants.find(
      (item) =>
        item.role === JourneyBoardingParticipantRole.PROVIDER,
    );

  const normalizedBoardingPublicId = boarding.publicId.trim();

  // The backend creates providerPublicId from the authenticated identity ID.
  const providerIdentityPublicId =
    boarding.providerPublicId?.trim() ?? '';

  const statusLabel = providerParticipant
    ? formatParticipantStatus(providerParticipant.status)
    : null;

  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-brand)] text-[var(--brand)]">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand)]">
                Journey team
              </p>

              <h2
                id="journey-boarding-provider-title"
                className="mt-1 text-base font-semibold text-[var(--foreground)]"
              >
                Provider
              </h2>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Provider profile and boarding information
              </p>
            </div>
          </div>

          {statusLabel && (
            <Badge variant="outline" size="sm">
              {statusLabel}
            </Badge>
          )}
        </div>
      }
    >
      {providerParticipant ? (
        <div className="flex flex-col gap-4">
          {/* Provider identity reference */}

          <div className="flex min-w-0 items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
              <CircleUserRound size={25} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Provider
                </p>

                <Badge
                  variant="default"
                  size="sm"
                  leadingContent={
                    <BadgeCheck size={13} aria-hidden="true" />
                  }
                >
                  Boarding role
                </Badge>
              </div>

              <div className="mt-2 flex items-start gap-2">
                <Fingerprint
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--foreground-muted)]"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Member public ID
                  </p>

                  <p
                    className="mt-1 break-all font-mono text-xs text-[var(--foreground-secondary)]"
                    title={providerParticipant.memberPublicId}
                  >
                    {providerParticipant.memberPublicId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shared provider profile, verification, and trust summary */}

          {normalizedBoardingPublicId && providerIdentityPublicId ? (
            <JourneyBoardingParticipantSummary
              journeyBoardingPublicId={normalizedBoardingPublicId}
              participantIdentityPublicId={providerIdentityPublicId}
            />
          ) : (
            <p className="text-sm text-[var(--foreground-secondary)]">
              Provider profile summary is unavailable.
            </p>
          )}

          {/* Existing boarding status */}

          <div className="flex items-start gap-3 border-t border-[var(--border)] pt-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
              <UserRound size={17} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--foreground)]">
                Participant status
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {statusLabel}
              </p>
            </div>
          </div>

          <p className="text-xs leading-5 text-[var(--foreground-muted)]">
            Profile and verification information are provided by the shared
            participant summary. Boarding status remains part of the
            Journey Boarding record.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-6 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
            <UserRound size={22} aria-hidden="true" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
            Provider participant unavailable
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--foreground-secondary)]">
            No provider participant could be found in this boarding record.
          </p>
        </div>
      )}
    </Card>
  );
}
