
import { Card } from "@/components/ui";
import type {
  VerificationApiResponse,
} from "@/features/admin/verifications/types/verification-api.types";
import { VerificationEvidenceViewer } from "./verification-evidence-viewer";

export interface VerificationEvidencePanelProps {
  verification: VerificationApiResponse;
  className?: string;
}

export function VerificationEvidencePanel({
  verification,
  className,
}: VerificationEvidencePanelProps) {
  const requests = verification.requests ?? [];

  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby="verification-evidence-panel-title"
        className="space-y-4"
      >
        <div>
          <h2
            id="verification-evidence-panel-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Submitted evidence
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Evidence requests associated with this verification record.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">
              No evidence requests found
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Evidence will appear here when a request is submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <VerificationEvidenceViewer
                key={request.publicId}
                request={request}
                verificationPublicId={verification.publicId}
              />
            ))}
          </div>
        )}
      </section>
    </Card>
  );
}

export default VerificationEvidencePanel;
