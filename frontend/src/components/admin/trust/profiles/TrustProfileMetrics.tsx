/**
 * sisiMove — Trust Profile Metrics
 *
 * Summary metrics for an individual Trust profile.
 *
 * Responsibilities:
 * - Display established Trust profile performance metrics.
 * - Format counts, percentages, and average ratings consistently.
 * - Handle missing or invalid values safely.
 * - Reuse the shared design-system Card.
 *
 * Non-responsibilities:
 * - Fetching Trust profile data.
 * - Calculating new business metrics.
 * - Defining Trust or verification policies.
 */

import { Card } from "@/components/ui/card";
import type { TrustProfileModel } from "@/features/admin/trust/models/trust-profile.model";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustProfileMetricsProps {
  /**
   * Trust profile metrics from the mapped frontend model.
   */
  profile: Pick<
    TrustProfileModel,
    | "ratingAverage"
    | "ratingCount"
    | "completedJourneys"
    | "completionRate"
    | "cancelledJourneys"
    | "cancellationRate"
  >;

  /**
   * Additional classes for the metrics grid.
   */
  className?: string;
}

interface MetricDefinition {
  label: string;
  value: string;
  description?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatCount(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat().format(value);
}

function formatRating(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercentage(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return "—";
  }

  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

// -----------------------------------------------------------------------------
// Metric Card
// -----------------------------------------------------------------------------

function MetricCard({ metric }: { metric: MetricDefinition }) {
  return (
    <Card variant="default" padding="md" className="min-w-0">
      <p className="text-sm font-medium text-[var(--foreground-muted)]">
        {metric.label}
      </p>

      <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {metric.value}
      </p>

      {metric.description && (
        <p className="mt-1 text-xs leading-5 text-[var(--foreground-secondary)]">
          {metric.description}
        </p>
      )}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileMetrics({
  profile,
  className,
}: TrustProfileMetricsProps) {
  const metrics: MetricDefinition[] = [
    {
      label: "Average rating",
      value: formatRating(profile.ratingAverage),
      description: `${formatCount(profile.ratingCount)} ratings`,
    },
    {
      label: "Completed journeys",
      value: formatCount(profile.completedJourneys),
    },
    {
      label: "Completion rate",
      value: formatPercentage(profile.completionRate),
    },
    {
      label: "Cancelled journeys",
      value: formatCount(profile.cancelledJourneys),
    },
    {
      label: "Cancellation rate",
      value: formatPercentage(profile.cancellationRate),
    },
  ];

  return (
    <section
      aria-label="Trust profile metrics"
      className={["w-full", className ?? ""].join(" ")}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}

export default TrustProfileMetrics;
