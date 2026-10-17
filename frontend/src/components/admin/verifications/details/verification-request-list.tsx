
import { Card } from "@/components/ui";
import type { VerificationRequestApiResponse } from "@/features/admin/verifications/types/verification-api.types";
import { VerificationRequestCard } from "./verification-request-card";
import { VerificationRequestReviewPanel } from "./verification-request-review-panel";

export interface VerificationRequestListProps {
  verificationPublicId: string;
  requests: VerificationRequestApiResponse[];
  onOpenEvidence?: (request: VerificationRequestApiResponse) => void;
  onApprove?: (request: VerificationRequestApiResponse) => void;
  onReject?: (
    request: VerificationRequestApiResponse,
    reason: string,
  ) => void;
  submittingRequestPublicId?: string | null;
  title?: string;
  description?: string;
  className?: string;
}

export function VerificationRequestList({
  verificationPublicId,
  requests,
  onOpenEvidence,
  onApprove,
  onReject,
  submittingRequestPublicId,
  title = "Verification requests",
  description = "Review the evidence requests associated with this verification.",
  className,
}: VerificationRequestListProps) {
  return (
    <section
      aria-labelledby="verification-request-list-title"
      className={["space-y-4", className].filter(Boolean).join(" ")}
    >
      <div>
        <h2
          id="verification-request-list-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          {title}
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          {description}
        </p>
      </div>

      {requests.length === 0 ? (
        <Card padding="md">
          <div className="py-3">
            <p className="text-sm font-medium text-[var(--foreground)]">
              No verification requests
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              No evidence requests are available for this verification record.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const isSubmitting =
              submittingRequestPublicId === request.publicId;

            return (
              <div key={request.publicId} className="space-y-3">
                <VerificationRequestCard
                  request={request}
                  onOpenEvidence={onOpenEvidence}
                />

                <VerificationRequestReviewPanel
                  verificationPublicId={verificationPublicId}
                  request={request}
                  onApprove={onApprove}
                  onReject={onReject}
                  isSubmitting={isSubmitting}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default VerificationRequestList;
