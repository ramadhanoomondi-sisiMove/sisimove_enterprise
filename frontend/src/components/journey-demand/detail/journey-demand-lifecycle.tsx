// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Lifecycle
// -----------------------------------------------------------------------------
//
// Presentation-only lifecycle summary for a public Journey Demand.
//
// Architecture rules:
// - Consumes the public Journey Demand projection.
// - Does not fetch data.
// - Does not perform mutations.
// - Does not reconstruct the backend lifecycle/state machine.
// - Does not infer missing lifecycle timestamps.
// - Does not manufacture business states.
// - Only renders lifecycle information explicitly exposed by the public model.
//
// Public lifecycle states:
//
//   OPEN
//   MATCHED
//   CONVERTED
//   FULFILLED
//
// Internal states such as DRAFT, CANCELLED and EXPIRED are not recreated here.
// -----------------------------------------------------------------------------

import {
  CheckCircle2,
  CircleDot,
  GitBranch,
  Sparkles,
} from "lucide-react";

import type { PublicJourneyDemand } from "@/features/journey-demand/models";

import { cn } from "@/foundation";

import { JourneyDemandStatusBadge } from "../shared/journey-demand-status-badge";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandLifecycleProps {
  readonly demand: PublicJourneyDemand;
  readonly emphasis?: "compact" | "default";
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandLifecycle({
  demand,
  emphasis = "default",
  className,
}: JourneyDemandLifecycleProps) {
  const isCompact = emphasis === "compact";

  return (
    <section
      aria-labelledby="journey-demand-lifecycle-heading"
      className={cn(
        "min-w-0",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-b",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
          isCompact
            ? "px-4 py-4"
            : "px-5 py-5 sm:px-6",
        )}
      >
        <div
          className={cn(
            "flex",
            "min-w-0",
            "items-start",
            "justify-between",
            "gap-4",
          )}
        >
          <div
            className={cn(
              "flex",
              "min-w-0",
              "items-start",
              "gap-3",
            )}
          >
            <div
              aria-hidden="true"
              className={cn(
                "flex",
                "size-9",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-[var(--radius-lg)]",
                "bg-[var(--brand-soft)]",
                "text-[var(--brand)]",
              )}
            >
              <GitBranch className="size-4" />
            </div>

            <div className="min-w-0">
              <p
                className={cn(
                  "text-[0.65rem]",
                  "font-bold",
                  "uppercase",
                  "tracking-[0.12em]",
                  "text-[var(--brand)]",
                )}
              >
                Demand lifecycle
              </p>

              <h2
                id="journey-demand-lifecycle-heading"
                className={cn(
                  "mt-1",
                  "font-extrabold",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                  isCompact
                    ? "text-base"
                    : "text-[clamp(1.05rem,1.8vw,1.3rem)]",
                )}
              >
                Where this travel request stands
              </h2>

              <p
                className={cn(
                  "mt-1",
                  "leading-6",
                  "text-[var(--foreground-muted)]",
                  isCompact ? "text-xs" : "text-sm",
                )}
              >
                {getStatusDescription(demand.status)}
              </p>
            </div>
          </div>

          <JourneyDemandStatusBadge
            status={demand.status}
            className="shrink-0"
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Current state                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "grid",
          "min-w-0",
          "grid-cols-1",
          "gap-4",
          "sm:grid-cols-[minmax(0,1fr)_auto]",
          isCompact
            ? "p-4"
            : "p-5 sm:p-6",
        )}
      >
        <div
          className={cn(
            "min-w-0",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--background-subtle)]",
            isCompact ? "p-4" : "p-5",
          )}
        >
          <div
            className={cn(
              "flex",
              "items-center",
              "gap-2",
              "text-xs",
              "font-semibold",
              "uppercase",
              "tracking-[0.08em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            <CircleDot
              aria-hidden="true"
              className="size-3.5 text-[var(--brand)]"
            />

            Current status
          </div>

          <p
            className={cn(
              "mt-2",
              "font-extrabold",
              "tracking-tight",
              "text-[var(--foreground)]",
              isCompact
                ? "text-lg"
                : "text-[clamp(1.25rem,2.2vw,1.6rem)]",
            )}
          >
            {getStatusLabel(demand.status)}
          </p>

          <p
            className={cn(
              "mt-1",
              "text-sm",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            This is the current public marketplace state of the Demand.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Lifecycle indicator                                               */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "flex",
            "min-w-0",
            "items-center",
            "justify-center",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--surface)]",
            isCompact
              ? "px-5 py-4"
              : "px-6 py-5",
          )}
        >
          <div className="text-center">
            <div
              aria-hidden="true"
              className={cn(
                "mx-auto",
                "flex",
                "size-10",
                "items-center",
                "justify-center",
                "rounded-full",
                getStatusIconBackground(demand.status),
                getStatusIconForeground(demand.status),
              )}
            >
              {getStatusIcon(demand.status)}
            </div>

            <p
              className={cn(
                "mt-2",
                "text-xs",
                "font-semibold",
                "text-[var(--foreground-secondary)]",
              )}
            >
              Public marketplace lifecycle
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* State reference                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-t",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          isCompact
            ? "px-4 py-3"
            : "px-5 py-4 sm:px-6",
        )}
      >
        <dl
          className={cn(
            "grid",
            "min-w-0",
            "grid-cols-1",
            "gap-3",
            "sm:grid-cols-2",
          )}
        >
          <div className="min-w-0">
            <dt
              className={cn(
                "text-xs",
                "font-semibold",
                "uppercase",
                "tracking-[0.06em]",
                "text-[var(--foreground-muted)]",
              )}
            >
              Current state
            </dt>

            <dd
              className={cn(
                "mt-1",
                "text-sm",
                "font-semibold",
                "text-[var(--foreground)]",
              )}
            >
              <span className="sr-only">
                The current demand status is{" "}
              </span>

              {getStatusLabel(demand.status)}
            </dd>
          </div>

          <div className="min-w-0">
            <dt
              className={cn(
                "text-xs",
                "font-semibold",
                "uppercase",
                "tracking-[0.06em]",
                "text-[var(--foreground-muted)]",
              )}
            >
              Lifecycle source
            </dt>

            <dd
              className={cn(
                "mt-1",
                "text-sm",
                "text-[var(--foreground-secondary)]",
              )}
            >
              Public Journey Demand projection
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

// =============================================================================
// Status Presentation Helpers
// =============================================================================

function getStatusLabel(
  status: PublicJourneyDemand["status"],
): string {
  switch (status) {
    case "OPEN":
      return "Open";

    case "MATCHED":
      return "Matched";

    case "CONVERTED":
      return "Converted";

    case "FULFILLED":
      return "Fulfilled";

    default:
      return status;
  }
}

function getStatusDescription(
  status: PublicJourneyDemand["status"],
): string {
  switch (status) {
    case "OPEN":
      return "This Demand is currently visible as a travel need.";

    case "MATCHED":
      return "This Demand has been connected with Journey supply.";

    case "CONVERTED":
      return "This Demand has progressed into the next Journey process.";

    case "FULFILLED":
      return "This travel Demand has reached its fulfilled state.";

    default:
      return "The public Demand projection provides the current lifecycle state.";
  }
}

function getStatusIcon(
  status: PublicJourneyDemand["status"],
) {
  switch (status) {
    case "OPEN":
      return (
        <CircleDot
          aria-hidden="true"
          className="size-5"
        />
      );

    case "MATCHED":
      return (
        <GitBranch
          aria-hidden="true"
          className="size-5"
        />
      );

    case "CONVERTED":
      return (
        <Sparkles
          aria-hidden="true"
          className="size-5"
        />
      );

    case "FULFILLED":
      return (
        <CheckCircle2
          aria-hidden="true"
          className="size-5"
        />
      );

    default:
      return (
        <CircleDot
          aria-hidden="true"
          className="size-5"
        />
      );
  }
}

function getStatusIconBackground(
  status: PublicJourneyDemand["status"],
): string {
  switch (status) {
    case "FULFILLED":
      return "bg-[var(--success-soft)]";

    case "MATCHED":
    case "CONVERTED":
      return "bg-[var(--brand-soft)]";

    case "OPEN":
    default:
      return "bg-[var(--background-muted)]";
  }
}

function getStatusIconForeground(
  status: PublicJourneyDemand["status"],
): string {
  switch (status) {
    case "FULFILLED":
      return "text-[var(--success)]";

    case "MATCHED":
    case "CONVERTED":
      return "text-[var(--brand)]";

    case "OPEN":
    default:
      return "text-[var(--foreground-secondary)]";
  }
}