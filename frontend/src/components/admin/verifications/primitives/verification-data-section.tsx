
import { VerificationLevelBadge } from "../primitives/verification-level-badge";
import { VerificationStatusBadge } from "../primitives/verification-status-badge";
import { VerificationEvidenceIndicator } from "../primitives/verification-evidence-indicator";

import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationDataSectionProps {
  verification: VerificationApiResponse;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDate(value?: string): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationDataSection({
  verification,
  className,
}: VerificationDataSectionProps) {
  return (
    <section
      aria-labelledby="verification-data-heading"
      className={[
        "rounded-[var(--radius-xl)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-5 sm:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="verification-data-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Verification details
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Verification record and accepted evidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <VerificationStatusBadge status={verification.status} />
          <VerificationLevelBadge level={verification.level} />
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Verification ID
          </dt>
          <dd className="mt-1 break-all text-sm font-medium text-[var(--foreground)]">
            {verification.publicId}
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Identity ID
          </dt>
          <dd className="mt-1 break-all text-sm font-medium text-[var(--foreground)]">
            {verification.identityPublicId}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Verified at
          </dt>
          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatDate(verification.verifiedAt)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Last reviewed
          </dt>
          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatDate(verification.lastReviewedAt)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Created
          </dt>
          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatDate(verification.createdAt)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Last updated
          </dt>
          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatDate(verification.updatedAt)}
          </dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Accepted evidence
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <VerificationEvidenceIndicator
            label="Profile photo"
            verified={verification.profilePhotoVerified}
          />

          <VerificationEvidenceIndicator
            label="Government ID"
            verified={verification.governmentIdVerified}
          />

          <VerificationEvidenceIndicator
            label="Driver's license"
            verified={verification.driverLicenseVerified}
          />
        </div>
      </div>

      {verification.rejectionReason && (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-4">
          <h3 className="text-sm font-semibold text-[var(--danger)]">
            Review reason
          </h3>

          <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--foreground-secondary)]">
            {verification.rejectionReason}
          </p>
        </div>
      )}
    </section>
  );
}

export default VerificationDataSection;
