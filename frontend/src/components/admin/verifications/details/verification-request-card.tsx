
import { Card } from "@/components/ui";
import type { VerificationRequestApiResponse } from "@/features/admin/verifications/types/verification-api.types";

export interface VerificationRequestCardProps {
  request: VerificationRequestApiResponse;
  onOpenEvidence?: (request: VerificationRequestApiResponse) => void;
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

function getStatusClasses(status: VerificationRequestApiResponse["status"]) {
  switch (status) {
    case "APPROVED":
      return "bg-[var(--success-soft)] text-[var(--success)]";
    case "REJECTED":
      return "bg-[var(--danger-soft)] text-[var(--danger)]";
    case "PENDING":
      return "bg-[var(--warning-soft)] text-[var(--warning)]";
    case "CANCELLED":
      return "bg-[var(--background-muted)] text-[var(--foreground-muted)]";
    default:
      return "bg-[var(--background-muted)] text-[var(--foreground-muted)]";
  }
}

export function VerificationRequestCard({
  request,
  onOpenEvidence,
  className,
}: VerificationRequestCardProps) {
  const evidenceType = request.type.replaceAll("_", " ");

  return (
    <Card padding="md" className={className}>
      <article className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {evidenceType}
            </h3>
            <p className="mt-1 break-all text-xs text-[var(--foreground-muted)]">
              Request ID: {request.publicId}
            </p>
          </div>

          <span
            className={[
              "inline-flex shrink-0 items-center rounded-full px-2.5 py-1",
              "text-xs font-medium",
              getStatusClasses(request.status),
            ].join(" ")}
          >
            {request.status}
          </span>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Submitted
            </dt>
            <dd className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {formatDate(request.submittedAt)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Reviewed
            </dt>
            <dd className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {formatDate(request.reviewedAt)}
            </dd>
          </div>

          {request.reviewedByPublicId && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Reviewed by
              </dt>
              <dd className="mt-1 break-all text-sm text-[var(--foreground-secondary)]">
                {request.reviewedByPublicId}
              </dd>
            </div>
          )}

          {request.rejectionReason && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Rejection reason
              </dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-[var(--foreground-secondary)]">
                {request.rejectionReason}
              </dd>
            </div>
          )}
        </dl>

        {onOpenEvidence && (
          <div className="border-t border-[var(--border-subtle)] pt-3">
            <button
              type="button"
              onClick={() => onOpenEvidence(request)}
              className="text-sm font-medium text-[var(--brand)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
            >
              View evidence
            </button>
          </div>
        )}
      </article>
    </Card>
  );
}

export default VerificationRequestCard;
