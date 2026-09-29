// -----------------------------------------------------------------------------
// sisiMove — Journey Lifecycle
// -----------------------------------------------------------------------------
//
// Presents the authenticated Journey lifecycle state and lifecycle timestamps.
//
// Route boundary:
//
//     /my-journeys/[publicId]
//
// Projection:
//
//     MyJourney
//
// This component intentionally does not belong to the public Journey detail
// boundary because PublicJourney does not expose lifecycle information.
//
// Responsibilities:
// - present Journey status;
// - present lifecycle timestamps supplied by the backend;
// - present recorded publication, start, completion, cancellation, and
//   expiration events.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no lifecycle mutation;
// - no status inference;
// - no timestamp calculation;
// - no booking/completion orchestration;
// - no reconstruction of lifecycle state from timestamps.
//
// `MyJourney.status` is authoritative. The frontend does not derive the status
// from lifecycle timestamps.
//
// -----------------------------------------------------------------------------

import { useId } from "react";

import { cn } from "@/foundation";

import type { MyJourney } from "@/features/journey/models";

import { JourneyStatusBadge } from "../shared";

export interface JourneyLifecycleProps {
  readonly journey: Pick<
    MyJourney,
    | "status"
    | "publishedAt"
    | "startedAt"
    | "completionRequestedAt"
    | "completedAt"
    | "cancelledAt"
    | "expiredAt"
  >;
  readonly className?: string;
}

function formatLifecycleDate(value: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

interface LifecycleEventProps {
  readonly label: string;
  readonly value: string | null;
}

function LifecycleEvent({
  label,
  value,
}: LifecycleEventProps) {
  if (!value) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)]",
        "border border-[var(--border-subtle)]",
        "bg-[var(--surface)]",
        "p-3",
      )}
    >
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
        {formatLifecycleDate(value)}
      </p>
    </div>
  );
}

export function JourneyLifecycle({
  journey,
  className,
}: JourneyLifecycleProps) {
  const headingId = useId();

  return (
    <section
      className={cn(
        "w-full",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-4",
        className,
      )}
      aria-labelledby={headingId}
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          Lifecycle
        </p>

        <h2
          id={headingId}
          className="mt-1 text-lg font-semibold text-[var(--foreground)]"
        >
          Journey status
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          The current lifecycle state and recorded Journey events.
        </p>
      </div>

      <div
        className={cn(
          "rounded-[var(--radius-md)]",
          "bg-[var(--background-subtle)]",
          "p-4",
        )}
      >
        <JourneyStatusBadge status={journey.status} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <LifecycleEvent
          label="Published"
          value={journey.publishedAt}
        />

        <LifecycleEvent
          label="Started"
          value={journey.startedAt}
        />

        <LifecycleEvent
          label="Completion requested"
          value={journey.completionRequestedAt}
        />

        <LifecycleEvent
          label="Completed"
          value={journey.completedAt}
        />

        <LifecycleEvent
          label="Cancelled"
          value={journey.cancelledAt}
        />

        <LifecycleEvent
          label="Expired"
          value={journey.expiredAt}
        />
      </div>
    </section>
  );
}