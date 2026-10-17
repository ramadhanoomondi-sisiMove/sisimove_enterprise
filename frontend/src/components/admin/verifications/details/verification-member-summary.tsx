// -----------------------------------------------------------------------------
// sisiMove — Verification Member Summary
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Identify the member associated with a verification aggregate.
// - Display the identity and verification public identifiers.
// - Use the existing design-system tokens and Card component.
// - Remain presentational; identity data fetching belongs to the parent.
//
// -----------------------------------------------------------------------------

import { Card } from "@/components/ui";

import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationMemberSummaryProps {
  verification: VerificationApiResponse;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationMemberSummary({
  verification,
  className,
}: VerificationMemberSummaryProps) {
  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby="verification-member-summary-title"
        className="space-y-4"
      >
        <div>
          <h2
            id="verification-member-summary-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Member summary
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Identity associated with this verification record.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Identity public ID
            </p>

            <p className="break-all text-sm font-medium text-[var(--foreground)]">
              {verification.identityPublicId || "Not available"}
            </p>
          </div>

          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Verification public ID
            </p>

            <p className="break-all text-sm font-medium text-[var(--foreground)]">
              {verification.publicId || "Not available"}
            </p>
          </div>
        </div>
      </section>
    </Card>
  );
}

export default VerificationMemberSummary;