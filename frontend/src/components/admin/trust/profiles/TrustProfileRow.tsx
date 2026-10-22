"use client";

import type { KeyboardEvent, MouseEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TrustProfileSummaryModel } from "@/features/admin/trust/models/trust-profile.model";

// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Row
// -----------------------------------------------------------------------------
//
// Displays one trust profile in the admin directory.
//
// Responsibilities:
// - Present the profile's available trust and journey metrics.
// - Provide an accessible action to open the profile workspace.
// - Keep navigation controlled by the parent directory.
//
// Non-responsibilities:
// - Fetching profile data.
// - Performing trust or verification mutations.
// - Making authorization decisions.
// -----------------------------------------------------------------------------

export interface TrustProfileRowProps {
  profile: TrustProfileSummaryModel;
  onSelect: (profile: TrustProfileSummaryModel) => void;
  disabled?: boolean;
  className?: string;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

function formatRating(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : "—";
}

function formatPercentage(value: number): string {
  return Number.isFinite(value) ? `${value}%` : "—";
}

function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getStatusVariant(
  status: string,
): "default" | "brand" | "success" | "warning" | "danger" | "outline" {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "verified":
      return "success";

    case "pending":
    case "under_review":
      return "warning";

    case "suspended":
    case "rejected":
    case "blocked":
      return "danger";

    case "inactive":
    case "unverified":
      return "outline";

    default:
      return "default";
  }
}

function stopRowClick(event: MouseEvent<HTMLButtonElement>): void {
  event.stopPropagation();
}

export function TrustProfileRow({
  profile,
  onSelect,
  disabled = false,
  className,
}: TrustProfileRowProps) {
  const status = profile.status || "unknown";
  const verificationLevel = profile.verificationLevel || "unknown";

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(profile);
    }
  }

  return (
    <Card
      variant="outlined"
      padding="md"
      className={[
        "transition-colors",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-[var(--border-strong)] hover:bg-[var(--background-subtle)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Open trust profile ${profile.publicId}`}
        aria-disabled={disabled}
        onClick={() => {
          if (!disabled) onSelect(profile);
        }}
        onKeyDown={handleKeyDown}
        className="space-y-4 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Trust profile
            </p>

            <p className="break-all font-mono text-xs text-[var(--foreground-secondary)]">
              {profile.publicId}
            </p>

            <p className="break-all text-sm text-[var(--foreground-secondary)]">
              Member ID: {profile.memberPublicId}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusVariant(status)} size="sm">
              {status.replaceAll("_", " ")}
            </Badge>

            <Badge variant="outline" size="sm">
              {verificationLevel.replaceAll("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Metric
            label="Rating"
            value={formatRating(profile.ratingAverage)}
          />

          <Metric
            label="Reviews"
            value={formatNumber(profile.ratingCount)}
          />

          <Metric
            label="Completed journeys"
            value={formatNumber(profile.completedJourneys)}
          />

          <Metric
            label="Completion rate"
            value={formatPercentage(profile.completionRate)}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Cancellation rate: {formatPercentage(profile.cancellationRate)}
          </span>

          <span>Created {formatDate(profile.createdAt)}</span>

          <button
            type="button"
            disabled={disabled}
            onClick={(event) => {
              stopRowClick(event);
              onSelect(profile);
            }}
            className="inline-flex min-h-9 items-center justify-center gap-2 self-start rounded-md px-3 text-sm font-medium text-[var(--brand)] transition-colors hover:bg-[var(--brand-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            View profile
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-[var(--foreground-muted)]">{label}</p>

      <p className="truncate text-base font-semibold tabular-nums text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

export default TrustProfileRow;
