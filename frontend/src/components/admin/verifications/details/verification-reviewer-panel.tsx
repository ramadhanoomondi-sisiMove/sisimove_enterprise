
import { Card } from "@/components/ui";
import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";
export interface VerificationReviewerPanelProps {
  verification: VerificationApiResponse;
  className?: string;
}

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

export function VerificationReviewerPanel({
  verification,
  className,
}: VerificationReviewerPanelProps) {
  const hasBeenReviewed = Boolean(verification.lastReviewedAt);

  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby="verification-reviewer-panel-title"
        className="space-y-4"
      >
        <div>
          <h2
            id="verification-reviewer-panel-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Review information
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Available information about the latest review.
          </p>
        </div>

        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Review status
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {hasBeenReviewed ? "Review recorded" : "No review date recorded"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Last reviewed
            </dt>
            <dd className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {formatDate(verification.lastReviewedAt)}
            </dd>
          </div>
        </dl>

        <p className="border-t border-[var(--border-subtle)] pt-3 text-xs leading-5 text-[var(--foreground-muted)]">
          Reviewer identity is not available on this verification response.
        </p>
      </section>
    </Card>
  );
}

export default VerificationReviewerPanel;
