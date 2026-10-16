
"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberDataSection } from "@/components/admin/members/primitives/member-data-section";
import { useMemberActivity } from "@/features/admin/members/hooks/use-member-activity";
import type { MemberTrustActivityEvent } from "@/features/admin/members/api/member-activity.api";
import { cn } from "@/foundation/utils/cn";

interface MemberActivityTimelineProps {
  memberPublicId: string;
  className?: string;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function humanize(value: string): string {
  return value
    .replaceAll("_", " ")
    .replaceAll(".", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function RelatedReference({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;

  return (
    <div className="min-w-0">
      <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-1 break-all text-sm text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function MetadataValue({ value }: { value: unknown }): ReactNode {
  if (value === null) return "null";

  if (value === undefined) return "—";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "Value unavailable";
  }
}

function ActivityEventCard({
  event,
}: {
  event: MemberTrustActivityEvent;
}) {
  const hasReferences = Boolean(
    event.journeyPublicId ||
      event.bookingPublicId ||
      event.ratingPublicId ||
      event.badgePublicId ||
      event.disputePublicId,
  );

  const metadataEntries = event.metadata
    ? Object.entries(event.metadata)
    : [];

  return (
    <article className="relative ml-2 border-l border-[var(--border)] pb-6 pl-6 last:border-l-transparent last:pb-0">
      <span
        aria-hidden="true"
        className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-[var(--brand)]"
      />

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="break-words text-sm font-semibold text-[var(--foreground)]">
              {humanize(event.type)}
            </h4>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {formatDate(event.createdAt)}
            </p>
          </div>

          <Badge variant="outline">Trust</Badge>
        </div>

        {event.reason && (
          <p className="mt-3 whitespace-pre-wrap break-words text-sm text-[var(--foreground-secondary)]">
            {event.reason}
          </p>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RelatedReference label="Event reference" value={event.publicId} />
          <RelatedReference label="Actor reference" value={event.actorPublicId} />
          <RelatedReference label="Trust profile ID" value={event.profileId} />
        </div>

        {hasReferences && (
          <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
            <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
              Related records
            </h5>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RelatedReference
                label="Journey"
                value={event.journeyPublicId}
              />
              <RelatedReference
                label="Booking"
                value={event.bookingPublicId}
              />
              <RelatedReference
                label="Rating"
                value={event.ratingPublicId}
              />
              <RelatedReference label="Badge" value={event.badgePublicId} />
              <RelatedReference
                label="Dispute"
                value={event.disputePublicId}
              />
            </div>
          </div>
        )}

        {metadataEntries.length > 0 && (
          <details className="mt-4 border-t border-[var(--border-subtle)] pt-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--foreground-secondary)]">
              Event metadata ({metadataEntries.length})
            </summary>

            <dl className="mt-3 space-y-3">
              {metadataEntries.map(([key, value]) => (
                <div key={key} className="min-w-0">
                  <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                    {humanize(key)}
                  </dt>
                  <dd className="mt-1 break-words text-sm text-[var(--foreground)]">
                    <MetadataValue value={value} />
                  </dd>
                </div>
              ))}
            </dl>
          </details>
        )}
      </div>
    </article>
  );
}

export function MemberActivityTimeline({
  memberPublicId,
  className,
}: MemberActivityTimelineProps) {
  const activityQuery = useMemberActivity(memberPublicId);
  const events = activityQuery.data;

  const sortedEvents = events
    ? [...events].sort((first, second) => {
        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();

        const safeFirst = Number.isFinite(firstTime) ? firstTime : 0;
        const safeSecond = Number.isFinite(secondTime) ? secondTime : 0;

        return safeSecond - safeFirst;
      })
    : [];

  return (
    <MemberDataSection
      title="Activity timeline"
      description="Trust-domain events returned by the available activity endpoint. This is not a complete member audit log."
      className={cn("space-y-4", className)}
    >
      {activityQuery.isPending ? (
        <div className="space-y-4" aria-label="Loading member activity">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4">
              <div className="mt-1 h-3 w-3 shrink-0 animate-pulse rounded-full bg-[var(--background-muted)]" />
              <div className="flex-1 animate-pulse rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
                <div className="h-4 w-36 rounded bg-[var(--background-muted)]" />
                <div className="mt-3 h-3 w-48 rounded bg-[var(--background-muted)]" />
              </div>
            </div>
          ))}
        </div>
      ) : activityQuery.isError ? (
        <div
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/30 p-4"
          role="alert"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Could not load member activity.
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            The request may have failed or your account may not have the
            required trust-profile:read permission.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void activityQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No Trust activity found
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            No events were returned for this member by the Trust activity
            endpoint. This does not prove that no other activity occurred.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--foreground-secondary)]">
              Most recent events first
            </p>
            <Badge variant="outline">
              {sortedEvents.length}{" "}
              {sortedEvents.length === 1 ? "event" : "events"}
            </Badge>
          </div>

          <div>
            {sortedEvents.map((event) => (
              <ActivityEventCard key={event.publicId} event={event} />
            ))}
          </div>
        </>
      )}
    </MemberDataSection>
  );
}

export default MemberActivityTimeline;
