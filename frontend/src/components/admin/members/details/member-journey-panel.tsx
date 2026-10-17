
"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";

import { useMemberJourneys } from "@/features/admin/members/hooks/use-member-journeys";
import { MemberDataSection } from "@/components/admin/members/primitives/member-data-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberJourneyPanelProps {
  /**
   * Public ID of the journey provider associated with this member.
   */
  readonly providerPublicId: string;
  readonly className?: string;
}

interface JourneyRoute {
  readonly originName: string;
  readonly destinationName: string;
}

interface JourneySchedule {
  readonly departureAt: string;
  readonly arrivalAt: string | null;
  readonly timezone: string;
}

interface JourneyCapacity {
  readonly totalSeats: number;
  readonly bookedSeats: number;
  readonly availableSeats: number;
}

interface JourneyPricing {
  readonly amount: number;
  readonly currency: string;
}

interface JourneyRecord {
  readonly publicId: string;
  readonly status: string;
  readonly publishedAt: string | null;
  readonly startedAt: string | null;
  readonly completedAt: string | null;
  readonly cancelledAt: string | null;
  readonly expiredAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly route: JourneyRoute | null;
  readonly schedule: JourneySchedule | null;
  readonly capacity: JourneyCapacity | null;
  readonly pricing: JourneyPricing | null;
}

// -----------------------------------------------------------------------------
// Runtime Validation
// -----------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableString(
  value: unknown,
): value is string | null {
  return value === null || isString(value);
}

function isFiniteNumber(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isRoute(value: unknown): value is JourneyRoute {
  return (
    isRecord(value) &&
    isString(value.originName) &&
    isString(value.destinationName)
  );
}

function isSchedule(value: unknown): value is JourneySchedule {
  return (
    isRecord(value) &&
    isString(value.departureAt) &&
    isNullableString(value.arrivalAt) &&
    isString(value.timezone)
  );
}

function parseCapacity(value: unknown): JourneyCapacity | null {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.totalSeats) ||
    !isFiniteNumber(value.bookedSeats)
  ) {
    return null;
  }

  const availableSeats = isFiniteNumber(value.availableSeats)
    ? value.availableSeats
    : value.totalSeats - value.bookedSeats;

  if (
    value.totalSeats < 0 ||
    value.bookedSeats < 0 ||
    availableSeats < 0
  ) {
    return null;
  }

  return {
    totalSeats: value.totalSeats,
    bookedSeats: value.bookedSeats,
    availableSeats,
  };
}

function isPricing(value: unknown): value is JourneyPricing {
  return (
    isRecord(value) &&
    isFiniteNumber(value.amount) &&
    isString(value.currency)
  );
}

/**
 * Validates the core journey fields and safely parses optional nested objects.
 *
 * The backend response contract must still be verified against the actual
 * JourneyResponseMapper implementation.
 */
function parseJourney(value: unknown): JourneyRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isString(value.publicId) ||
    !isString(value.status) ||
    !isNullableString(value.publishedAt) ||
    !isNullableString(value.startedAt) ||
    !isNullableString(value.completedAt) ||
    !isNullableString(value.cancelledAt) ||
    !isNullableString(value.expiredAt) ||
    !isString(value.createdAt) ||
    !isString(value.updatedAt)
  ) {
    return null;
  }

  const route = isRoute(value.corridor)
    ? value.corridor
    : null;

  const schedule = isSchedule(value.schedule)
    ? value.schedule
    : null;

  const capacity = parseCapacity(value.capacity);

  const pricing = isPricing(value.pricing)
    ? value.pricing
    : null;

  return {
    publicId: value.publicId,
    status: value.status,
    publishedAt: value.publishedAt,
    startedAt: value.startedAt,
    completedAt: value.completedAt,
    cancelledAt: value.cancelledAt,
    expiredAt: value.expiredAt,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    route,
    schedule,
    capacity,
    pricing,
  };
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatTimestamp(
  value?: string | null,
  timezone?: string,
): string {
  if (!value?.trim()) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  try {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }
}

function formatStatus(value: string): string {
  return value
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusVariant(
  status: string,
): "success" | "warning" | "danger" | "outline" {
  switch (status.toUpperCase()) {
    case "PUBLISHED":
    case "FULL":
    case "BOARDING":
      return "success";

    case "COMPLETION_PENDING":
    case "IN_PROGRESS":
      return "warning";

    case "CANCELLED":
    case "EXPIRED":
      return "danger";

    default:
      return "outline";
  }
}

// -----------------------------------------------------------------------------
// Journey Field
// -----------------------------------------------------------------------------

function JourneyField({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}): ReactNode {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd className="break-words text-sm text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Journey Card
// -----------------------------------------------------------------------------

function JourneyCard({
  journey,
}: {
  readonly journey: JourneyRecord;
}): ReactNode {
  return (
    <article className="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="break-all font-mono text-sm font-semibold text-[var(--foreground)]">
            {journey.publicId}
          </h3>

          {journey.route ? (
            <p className="mt-2 break-words text-base font-medium text-[var(--foreground)]">
              {journey.route.originName}

              <span
                className="mx-2 text-[var(--foreground-muted)]"
                aria-hidden="true"
              >
                →
              </span>

              {journey.route.destinationName}
            </p>
          ) : (
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Route details unavailable
            </p>
          )}
        </div>

        <Badge variant={getStatusVariant(journey.status)} size="sm">
          {formatStatus(journey.status)}
        </Badge>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <JourneyField
          label="Departure"
          value={
            journey.schedule
              ? formatTimestamp(
                  journey.schedule.departureAt,
                  journey.schedule.timezone,
                )
              : "Not available"
          }
        />

        <JourneyField
          label="Arrival"
          value={
            journey.schedule
              ? formatTimestamp(
                  journey.schedule.arrivalAt,
                  journey.schedule.timezone,
                )
              : "Not available"
          }
        />

        <JourneyField
          label="Seat capacity"
          value={
            journey.capacity
              ? `${journey.capacity.bookedSeats} booked / ${journey.capacity.totalSeats} total`
              : "Not available"
          }
        />

        <JourneyField
          label="Available seats"
          value={
            journey.capacity
              ? journey.capacity.availableSeats.toLocaleString("en-KE")
              : "Not available"
          }
        />

        <JourneyField
          label="Pricing"
          value={
            journey.pricing
              ? `${journey.pricing.currency} ${journey.pricing.amount.toLocaleString("en-KE")}`
              : "Not available"
          }
        />

        <JourneyField
          label="Published at"
          value={formatTimestamp(journey.publishedAt)}
        />

        <JourneyField
          label="Started at"
          value={formatTimestamp(journey.startedAt)}
        />

        <JourneyField
          label="Completed at"
          value={formatTimestamp(journey.completedAt)}
        />

        <JourneyField
          label="Created at"
          value={formatTimestamp(journey.createdAt)}
        />
      </dl>
    </article>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberJourneyPanel({
  providerPublicId,
  className,
}: MemberJourneyPanelProps): ReactNode {
  const journeysQuery = useMemberJourneys(providerPublicId);

  const parsed = useMemo(() => {
    const raw: unknown = journeysQuery.data;

    if (!Array.isArray(raw)) {
      return {
        journeys: [] as JourneyRecord[],
        invalidCount: 0,
        hasArrayResponse: raw === undefined,
      };
    }

    const journeys: JourneyRecord[] = [];
    let invalidCount = 0;

    for (const item of raw) {
      const journey = parseJourney(item);

      if (journey) {
        journeys.push(journey);
      } else {
        invalidCount += 1;
      }
    }

    return {
      journeys,
      invalidCount,
      hasArrayResponse: true,
    };
  }, [journeysQuery.data]);

  return (
    <MemberDataSection
      title="Journeys"
      description="Journeys associated with this member/provider identity."
      className={className}
    >
      {journeysQuery.isPending ? (
        <div
          role="status"
          aria-label="Loading member journeys"
          className="space-y-3"
        >
          {[0, 1].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4"
            >
              <div className="h-4 w-44 rounded bg-[var(--background-muted)]" />
              <div className="mt-4 h-3 w-60 rounded bg-[var(--background-muted)]" />
              <div className="mt-4 h-3 w-36 rounded bg-[var(--background-muted)]" />
            </div>
          ))}

          <span className="sr-only">
            Loading member journeys…
          </span>
        </div>
      ) : journeysQuery.isError ? (
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Journeys could not be loaded.
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            The request may have failed or the current administrator may not
            have access to read these journeys.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void journeysQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : !parsed.hasArrayResponse ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--foreground-secondary)]">
          The journey endpoint did not return a readable collection.
        </p>
      ) : parsed.journeys.length === 0 && parsed.invalidCount === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No journeys available
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            The endpoint returned no journey records for this identity.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {parsed.invalidCount > 0 ? (
            <p className="rounded-[var(--radius-md)] border border-[var(--warning)]/25 bg-[var(--warning-soft)] p-3 text-sm text-[var(--foreground-secondary)]">
              {parsed.invalidCount} journey record
              {parsed.invalidCount === 1 ? " was" : "s were"} omitted because
              the response did not contain the required core fields. The
              backend response contract still needs confirmation.
            </p>
          ) : null}

          {parsed.journeys.map((journey) => (
            <JourneyCard
              key={journey.publicId}
              journey={journey}
            />
          ))}
        </div>
      )}

      {journeysQuery.isFetching && !journeysQuery.isPending ? (
        <p
          className={cn("mt-3 text-xs text-[var(--foreground-muted)]")}
          role="status"
        >
          Refreshing journeys…
        </p>
      ) : null}
    </MemberDataSection>
  );
}

export default MemberJourneyPanel;
