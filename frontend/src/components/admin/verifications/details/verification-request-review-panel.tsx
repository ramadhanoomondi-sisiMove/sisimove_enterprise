
"use client";

import { useState } from "react";

import { Button, Card, Textarea } from "@/components/ui";
import { VerificationConfirmationDialog } from "@/components/admin/verifications/feedback/verification-confirmation-dialog";
import { VerificationEvidenceViewer } from "@/components/admin/verifications/details/verification-evidence-viewer";

import type { VerificationRequestApiResponse } from "@/features/admin/verifications/types/verification-api.types";

export interface VerificationRequestReviewPanelProps {
  verificationPublicId: string;
  request: VerificationRequestApiResponse;
  onApprove?: (request: VerificationRequestApiResponse) => void;
  onReject?: (
    request: VerificationRequestApiResponse,
    reason: string,
  ) => void;
  isSubmitting?: boolean;
  className?: string;
}

export function VerificationRequestReviewPanel({
  verificationPublicId,
  request,
  onApprove,
  onReject,
  isSubmitting = false,
  className,
}: VerificationRequestReviewPanelProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "APPROVE" | "REJECT" | null
  >(null);

  const isPending = request.status === "PENDING";
  const canApprove = isPending && Boolean(onApprove);
  const canReject = isPending && Boolean(onReject);
  const normalizedReason = rejectionReason.trim();

  function handleConfirm() {
    if (isSubmitting || !confirmationAction) {
      return;
    }

    if (confirmationAction === "APPROVE") {
      if (!canApprove || !onApprove) {
        return;
      }

      onApprove(request);
      setConfirmationAction(null);
      return;
    }

    if (!canReject || !onReject || !normalizedReason) {
      return;
    }

    onReject(request, normalizedReason);
    setConfirmationAction(null);
    setShowRejectionForm(false);
    setRejectionReason("");
  }

  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby={`verification-review-${request.publicId}`}
        className="space-y-4"
      >
        <div>
          <h2
            id={`verification-review-${request.publicId}`}
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Review evidence request
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Review the submitted evidence before deciding whether to approve
            or reject this request.
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3">
          <p className="text-sm font-medium text-[var(--foreground)]">
            {request.type.replaceAll("_", " ")}
          </p>

          <p className="mt-1 break-all text-xs text-[var(--foreground-muted)]">
            Request ID: {request.publicId}
          </p>

          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            Current status: {request.status}
          </p>
        </div>

        <VerificationEvidenceViewer
          key={request.publicId}
          verificationPublicId={verificationPublicId}
          request={request}
        />

        {!isPending && (
          <p className="text-sm text-[var(--foreground-muted)]">
            This request is no longer pending and cannot be reviewed here.
          </p>
        )}

        {isPending && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {canApprove && (
                <Button
                  type="button"
                  onClick={() => setConfirmationAction("APPROVE")}
                  disabled={isSubmitting}
                >
                  Approve request
                </Button>
              )}

              {canReject && !showRejectionForm && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowRejectionForm(true)}
                  disabled={isSubmitting}
                >
                  Reject request
                </Button>
              )}
            </div>

            {canReject && showRejectionForm && (
              <div className="space-y-3">
                <Textarea
                  label="Rejection reason"
                  value={rejectionReason}
                  onChange={(event) =>
                    setRejectionReason(event.target.value)
                  }
                  placeholder="Explain why this evidence cannot be approved."
                  required
                  disabled={isSubmitting}
                />

                <p className="text-xs text-[var(--foreground-muted)]">
                  A reason is required before you can confirm rejection.
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowRejectionForm(false);
                      setRejectionReason("");
                      setConfirmationAction(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setConfirmationAction("REJECT")}
                    disabled={!normalizedReason || isSubmitting}
                  >
                    Continue to rejection confirmation
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {request.rejectionReason && (
          <div className="border-t border-[var(--border-subtle)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Recorded rejection reason
            </h3>

            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[var(--foreground-secondary)]">
              {request.rejectionReason}
            </p>
          </div>
        )}

        <VerificationConfirmationDialog
          open={confirmationAction !== null}
          onOpenChange={(open) => {
            if (!open && !isSubmitting) {
              setConfirmationAction(null);
            }
          }}
          onConfirm={handleConfirm}
          title={
            confirmationAction === "REJECT"
              ? "Confirm evidence rejection"
              : "Confirm evidence approval"
          }
          description={
            confirmationAction === "REJECT"
              ? `You are about to reject this ${request.type.replaceAll("_", " ").toLowerCase()} request. Reason: ${normalizedReason}`
              : `Confirm that you have reviewed the evidence and want to approve this ${request.type.replaceAll("_", " ").toLowerCase()} request.`
          }
          confirmLabel={
            confirmationAction === "REJECT"
              ? "Confirm rejection"
              : "Approve request"
          }
          cancelLabel="Go back"
          isLoading={isSubmitting}
          isDestructive={confirmationAction === "REJECT"}
        />
      </section>
    </Card>
  );
}

export default VerificationRequestReviewPanel;
