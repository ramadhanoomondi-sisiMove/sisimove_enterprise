"use client";

// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Provider
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present the provider's shared profile and trust summary.
// - Present passenger profiles and authorized contact information.
// - Present current boarding participant status.
// - Preserve provider-only participant lifecycle actions.
//
// Architectural rules:
// - The backend aggregate remains authoritative.
// - Contact visibility remains controlled by the backend.
// - No boarding lifecycle rules are implemented here.
// - Public identifiers remain opaque.
// - Participant actions remain in their dedicated action components.
// -----------------------------------------------------------------------------

import {
  BadgeCheck,
  CircleUserRound,
  Fingerprint,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  JourneyBoardingParticipantRole,
  type JourneyBoarding,
  type JourneyBoardingParticipant,
} from "@/features/journey-boarding/models";

import { Badge, Card } from "@/components/ui";

import { JourneyBoardingParticipantSummary } from "../shared/journey-boarding-participant-summary";

import {
  MarkPassengerNoShowAction,
  RemoveParticipantAction,
} from "../boarding-actions";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingProviderProps {
  /** Current Journey Boarding aggregate. */
  boarding: JourneyBoarding;

  /** Optional provider participant override. */
  participant?: JourneyBoardingParticipant;

  /** Scheduled departure timestamp in ISO 8601 format. */
  departureAt?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatParticipantStatus(status: string): string {
  return status
    .split("_")
    .map((part) =>
      part.length > 0
        ? part.charAt(0) + part.slice(1).toLowerCase()
        : part,
    )
    .join(" ");
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingProvider({
  boarding,
  participant,
  departureAt,
}: JourneyBoardingProviderProps) {
  const providerParticipant =
    participant ??
    boarding.participants.find(
      (item) =>
        item.role === JourneyBoardingParticipantRole.PROVIDER,
    );

  const passengers = boarding.participants.filter(
    (item) =>
      item.role === JourneyBoardingParticipantRole.PASSENGER,
  );

  const normalizedBoardingPublicId = boarding.publicId.trim();

  // The backend creates providerPublicId from the authenticated identity ID.
  const providerIdentityPublicId =
    boarding.providerPublicId?.trim() ?? "";

  const statusLabel = providerParticipant
    ? formatParticipantStatus(providerParticipant.status)
    : null;

  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
              <ShieldCheck size={21} aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
                Journey team
              </p>

              <h2
                id="journey-boarding-provider-title"
                className="mt-1 text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg"
              >
                Provider
              </h2>

              <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
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
        <div className="flex min-w-0 flex-col gap-6">
          {/* Provider Identity */}

          <section
            aria-label="Provider identity"
            className="surface-brand rounded-[var(--radius-xl)] p-4 sm:p-5"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]">
                <CircleUserRound size={26} aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Provider
                  </h3>

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

                <div className="mt-3 flex min-w-0 items-start gap-2">
                  <Fingerprint
                    size={15}
                    className="mt-0.5 shrink-0 text-[var(--foreground-muted)]"
                    aria-hidden="true"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--foreground-muted)]">
                      Member public ID
                    </p>

                    <p
                      className="mt-1 break-all font-mono text-xs leading-5 text-[var(--foreground-secondary)]"
                      title={providerParticipant.memberPublicId}
                    >
                      {providerParticipant.memberPublicId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Provider Profile, Verification and Trust */}

          {normalizedBoardingPublicId &&
          providerIdentityPublicId ? (
            <JourneyBoardingParticipantSummary
              journeyBoardingPublicId={normalizedBoardingPublicId}
              participantIdentityPublicId={providerIdentityPublicId}
            />
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-subtle)] p-4">
              <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
                Provider profile summary is unavailable.
              </p>
            </div>
          )}

          {/* Single Passenger List */}

          <section
            aria-label="Journey passengers"
            className="space-y-4 border-t border-[var(--border)] pt-5"
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
                  <UsersRound size={19} aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Passengers
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                    Profiles, contact information and participant management
                  </p>
                </div>
              </div>

              <Badge variant="outline" size="sm">
                {passengers.length}{" "}
                {passengers.length === 1 ? "passenger" : "passengers"}
              </Badge>
            </div>

            {passengers.length > 0 ? (
              <div className="flex min-w-0 flex-col gap-4">
                {passengers.map((passenger, index) => (
                  <article
                    key={passenger.publicId}
                    aria-label={`Passenger ${index + 1}`}
                    className="min-w-0 space-y-3 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-3 transition-colors hover:border-[var(--border-strong)] sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--background-subtle)] text-xs font-semibold text-[var(--foreground-secondary)]">
                        {index + 1}
                      </span>

                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                        Passenger profile
                      </p>
                    </div>

                    <JourneyBoardingParticipantSummary
                      journeyBoardingPublicId={normalizedBoardingPublicId}
                      participantIdentityPublicId={passenger.memberPublicId}
                    />

                    {/* Provider-only participant lifecycle actions */}

                    <div
                      aria-label={`Actions for passenger ${index + 1}`}
                      className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-3 sm:flex-row sm:flex-wrap sm:items-center"
                    >
                      <MarkPassengerNoShowAction
                        boarding={boarding}
                        participant={passenger}
                        departureAt={departureAt}
                      />

                      <RemoveParticipantAction
                        boarding={boarding}
                        participant={passenger}
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-[var(--radius-xl)] border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-4 py-8 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground-muted)]">
                  <UsersRound size={21} aria-hidden="true" />
                </span>

                <h4 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                  No passengers yet
                </h4>

                <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--foreground-secondary)]">
                  No passengers are currently listed for this boarding.
                </p>
              </div>
            )}
          </section>

          {/* Provider Boarding Participant Status */}

          <section
            aria-label="Provider boarding status"
            className="flex min-w-0 items-start gap-3 border-t border-[var(--border)] pt-5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
              <UserRound size={18} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Participant status
              </h3>

              <div className="mt-2">
                {statusLabel && (
                  <Badge variant="outline" size="sm">
                    {statusLabel}
                  </Badge>
                )}
              </div>

              <p className="mt-2 text-xs leading-5 text-[var(--foreground-muted)]">
                Profile and verification information come from the shared
                participant summary. Boarding status remains part of the
                Journey Boarding record.
              </p>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-[var(--radius-xl)] border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-4 py-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground-muted)]">
            <UserRound size={23} aria-hidden="true" />
          </span>

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