
/**
 * sisiMove — Trust Profile Journey Metrics
 *
 * Journey performance metrics for an individual Trust profile.
 *
 * Responsibilities:
 * - Display journey counts and completion/cancellation rates.
 * - Show provider and passenger journey breakdowns.
 * - Distinguish missing metrics from genuine zero values.
 * - Format values consistently and safely.
 * - Reuse the shared design-system Card.
 *
 * Non-responsibilities:
 * - Fetching journey records.
 * - Calculating business metrics.
 * - Inferring journey outcomes from individual journey records.
 */

import { Card } from "@/components/ui/card";
import type { TrustProfileModel } from "@/features/admin/trust/models/trust-profile.model";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type JourneyMetricFields = Pick<
  TrustProfileModel,
  | "completedJourneys"
  | "providerJourneys"
  | "passengerJourneys"
  | "completedProviderJourneys"
  | "completedPassengerJourneys"
  | "cancelledJourneys"
  | "providerCancellations"
  | "passengerCancellations"
  | "completionRate"
  | "cancellationRate"
>;

export interface TrustProfileJourneyMetricsProps {
  /**
   * Journey metrics from the mapped Trust profile model.
   */
  profile: JourneyMetricFields;

  /**
   * Additional classes for the root element.
   */
  className?: string;
}

interface JourneyMetric {
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

function JourneyMetricCard({
  label,
  value,
  description,
}: JourneyMetric) {
  return (
    <Card variant="default" padding="md" className="min-w-0">
      <p className="text-sm font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs leading-5 text-[var(--foreground-secondary)]">
          {description}
        </p>
      )}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileJourneyMetrics({
  profile,
  className,
}: TrustProfileJourneyMetricsProps) {
  const metrics: JourneyMetric[] = [
    {
      label: "Total provider journeys",
      value: formatCount(profile.providerJourneys),
    },
    {
      label: "Completed provider journeys",
      value: formatCount(profile.completedProviderJourneys),
    },
    {
      label: "Provider cancellations",
      value: formatCount(profile.providerCancellations),
    },
    {
      label: "Total passenger journeys",
      value: formatCount(profile.passengerJourneys),
    },
    {
      label: "Completed passenger journeys",
      value: formatCount(profile.completedPassengerJourneys),
    },
    {
      label: "Passenger cancellations",
      value: formatCount(profile.passengerCancellations),
    },
    {
      label: "All completed journeys",
      value: formatCount(profile.completedJourneys),
    },
    {
      label: "Completion rate",
      value: formatPercentage(profile.completionRate),
    },
    {
      label: "Cancellation rate",
      value: formatPercentage(profile.cancellationRate),
      description: `${
        formatCount(profile.cancelledJourneys)
      } cancelled journeys`,
    },
  ];

  return (
    <section
      aria-label="Trust profile journey metrics"
      className={["w-full", className ?? ""].join(" ")}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Journey performance
        </h3>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Journey activity and completion outcomes by member role.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <JourneyMetricCard key={metric.label} {...metric} />
        ))}
      </div>
    </section>
  );
}

export default TrustProfileJourneyMetrics;
