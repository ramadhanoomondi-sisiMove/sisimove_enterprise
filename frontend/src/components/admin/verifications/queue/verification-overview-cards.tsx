// -----------------------------------------------------------------------------
// sisiMove — Verification Overview Cards
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Summarize verification records by status.
// - Present consistent overview metrics for the admin verification workspace.
// - Remain presentational; data fetching belongs in the parent or query hook.
//
// -----------------------------------------------------------------------------

"use client";

import { Card, Skeleton } from "@/components/ui";
import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationOverviewCardsProps {
  verifications: VerificationApiResponse[];
  isLoading?: boolean;
  className?: string;
}

interface OverviewMetric {
  label: string;
  value: number;
  description: string;
  tone: "default" | "warning" | "success" | "danger";
}

// -----------------------------------------------------------------------------
// Metric styling
// -----------------------------------------------------------------------------

const toneClasses: Record<OverviewMetric["tone"], string> = {
  default: "text-[var(--foreground)]",
  warning: "text-[var(--warning)]",
  success: "text-[var(--success)]",
  danger: "text-[var(--danger)]",
};

// -----------------------------------------------------------------------------
// Loading state
// -----------------------------------------------------------------------------

function VerificationOverviewCardsSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-label="Loading verification overview"
      role="status"
      className={["grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="sr-only">Loading verification overview…</span>

      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} padding="md">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-40 max-w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationOverviewCards({
  verifications,
  isLoading = false,
  className,
}: VerificationOverviewCardsProps) {
  if (isLoading) {
    return <VerificationOverviewCardsSkeleton className={className} />;
  }

  const total = verifications.length;
  const pending = verifications.filter(
    (item) => item.status === "PENDING",
  ).length;
  const verified = verifications.filter(
    (item) => item.status === "VERIFIED",
  ).length;
  const rejected = verifications.filter(
    (item) => item.status === "REJECTED",
  ).length;

  const metrics: OverviewMetric[] = [
    {
      label: "Total verifications",
      value: total,
      description: "Records in the loaded dataset",
      tone: "default",
    },
    {
      label: "Pending review",
      value: pending,
      description: "Awaiting a verification decision",
      tone: "warning",
    },
    {
      label: "Verified",
      value: verified,
      description: "Successfully verified records",
      tone: "success",
    },
    {
      label: "Rejected",
      value: rejected,
      description: "Records marked as rejected",
      tone: "danger",
    },
  ];

  return (
    <div
      className={[
        "grid",
        "grid-cols-1",
        "gap-4",
        "sm:grid-cols-2",
        "xl:grid-cols-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {metrics.map((metric) => (
        <Card key={metric.label} padding="md">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              {metric.label}
            </p>

            <p
              className={[
                "text-3xl",
                "font-semibold",
                "tracking-tight",
                toneClasses[metric.tone],
              ].join(" ")}
            >
              {metric.value.toLocaleString()}
            </p>

            <p className="text-xs leading-5 text-[var(--foreground-muted)]">
              {metric.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default VerificationOverviewCards;