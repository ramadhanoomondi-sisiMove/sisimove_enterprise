// -----------------------------------------------------------------------------
// sisiMove — Verification Status Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the aggregate verification status.
// - Show the available rejection reason when relevant.
// - Display the last-reviewed timestamp when available.
// - Remain presentational; no status mutations.
//
// -----------------------------------------------------------------------------

import { Card } from "@/components/ui";

import { VerificationStatusBadge } from "../primitives";
import { VerificationRejectionReason } from "./verification-rejection-reason";

import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationStatusPanelProps {
  verification: VerificationApiResponse;
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDate(value?: string | null): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationStatusPanel({
  verification,
  className,
}: VerificationStatusPanelProps) {
  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby="verification-status-panel-title"
        className="space-y-4"
      >
        <div>
          <h2
            id="verification-status-panel-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Verification status
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Current lifecycle status of this verification record.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VerificationStatusBadge status={verification.status} />
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Last reviewed
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {formatDate(verification.lastReviewedAt)}
          </p>
        </div>

        {verification.status === "REJECTED" && (
          <VerificationRejectionReason
            reason={verification.rejectionReason}
          />
        )}
      </section>
    </Card>
  );
}

export default VerificationStatusPanel;