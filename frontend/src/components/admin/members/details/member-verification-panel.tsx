
"use client";

// -----------------------------------------------------------------------------
// sisiMove — Admin Member Verification Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display aggregate verification status and level.
// - Display accepted verification indicators and relevant timestamps.
// - Display evidence requests and their individual review statuses.
// - Allow admins to inspect private evidence for each request.
// - Distinguish loading, error, empty and populated states.
// - Never infer aggregate verification from an approved evidence request.
//
// Non-responsibilities:
// - Fetching verification records.
// - Approving or rejecting verification requests.
// - Defining backend verification contracts.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import type {
  MemberVerification,
  MemberVerificationRequest,
} from "@/features/admin/members/models/member-verification.model";

import {
  MemberVerificationBadge,
  type MemberVerificationStatus,
} from "@/components/admin/members/primitives/member-verification-badge";

import { MemberDataSection } from "@/components/admin/members/primitives/member-data-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/foundation/utils/cn";
import { VerificationEvidenceViewer } from "@/components/admin/verifications";
import { useVerificationActions } from "@/features/admin/verifications/hooks/use-verification-actions";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberVerificationPanelProps {
  readonly identityPublicId: string;
  readonly verification: MemberVerification | null;
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
  readonly className?: string;
}

interface VerificationRequestCardProps {
  readonly request: MemberVerificationRequest;
  readonly onViewEvidence: (request: MemberVerificationRequest) => void;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatTimestamp(value?: string | null): string {
  if (!value?.trim()) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatLabel(value?: string | null): string {
  if (!value?.trim()) return "Not specified";

  return value
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatBoolean(value: boolean): string {
  return value ? "Confirmed" : "Not confirmed";
}

function formatRequestStatus(value: string): string {
  const status = value.trim().toUpperCase();
  const labels: Record<string, string> = {
    PENDING: "Waiting for review",
    APPROVED: "Accepted",
    REJECTED: "Not accepted",
    CANCELLED: "Cancelled by member",
    CANCELED: "Cancelled by member",
    EXPIRED: "No longer valid",
  };
  return labels[status] ?? formatLabel(value);
}

// -----------------------------------------------------------------------------
// Verification Indicator
// -----------------------------------------------------------------------------

interface VerificationIndicatorProps {
  readonly label: string;
  readonly verified: boolean;
  readonly verifiedAt?: string;
}

function VerificationIndicator({
  label,
  verified,
  verifiedAt,
}: VerificationIndicatorProps): ReactNode {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </p>

        {verifiedAt ? (
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Verified on {formatTimestamp(verifiedAt)}
          </p>
        ) : null}
      </div>

      <span
        className={cn(
          "shrink-0 rounded-[var(--radius-full)] px-2 py-1 text-xs font-medium",
          verified
            ? "bg-[var(--success-soft)] text-[var(--success)]"
            : "bg-[var(--background-muted)] text-[var(--foreground-secondary)]",
        )}
      >
        {formatBoolean(verified)}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Evidence Request Card
// -----------------------------------------------------------------------------

function VerificationRequestCard({
  request,
  onViewEvidence,
}: VerificationRequestCardProps): ReactNode {
  const requestStatus = request.status.trim().toUpperCase();
  const isRejected = requestStatus === "REJECTED";

  return (
    <article className="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words text-sm font-semibold text-[var(--foreground)]">
            {formatLabel(request.type)}
          </h4>

          <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">
            Submission reference: {request.publicId}
          </p>
        </div>

        <span
          className="inline-flex shrink-0 rounded-[var(--radius-full)] bg-[var(--background-muted)] px-2 py-1 text-xs font-medium text-[var(--foreground-secondary)]"
          aria-label={`Submission status: ${formatRequestStatus(request.status)}`}
        >
          {formatRequestStatus(request.status)}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Submitted
          </dt>
          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatTimestamp(request.submittedAt)}
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Reviewed
          </dt>
          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatTimestamp(request.reviewedAt)}
          </dd>
        </div>

        {request.reviewedByPublicId ? (
          <div className="min-w-0">
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Reviewed by (reference)
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground)]">
              {request.reviewedByPublicId}
            </dd>
          </div>
        ) : null}

        {request.assetPublicId ? (
          <div className="min-w-0">
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Evidence file reference
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground)]">
              {request.assetPublicId}
            </dd>
          </div>
        ) : null}
      </dl>

      {isRejected && request.rejectionReason?.trim() ? (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-3">
          <p className="text-xs font-semibold text-[var(--danger)]">
            Why this submission was not accepted
          </p>

          <p className="mt-1 whitespace-pre-line break-words text-sm text-[var(--foreground)]">
            {request.rejectionReason.trim()}
          </p>
        </div>
      ) : null}

      <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onViewEvidence(request)}
          disabled={!request.assetPublicId?.trim()}
          aria-label={`View ${formatLabel(request.type)} evidence`}
        >
          Open submitted document
        </Button>

        {!request.assetPublicId?.trim() ? (
          <p className="mt-2 text-xs text-[var(--foreground-muted)]">
            This submission has no attached document available to view.
          </p>
        ) : null}
      </div>
    </article>
  );
}

// -----------------------------------------------------------------------------
// Evidence Viewer Dialog
// -----------------------------------------------------------------------------

interface EvidenceDialogProps {
  readonly request: MemberVerificationRequest;
  readonly onClose: () => void;
}

function EvidenceDialog({
  request,
  onClose,
}: EvidenceDialogProps): ReactNode {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-evidence-dialog-title"
        className="my-auto w-full max-w-4xl rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] p-4 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3
              id="member-evidence-dialog-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              {formatLabel(request.type)} evidence
            </h3>

            <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">
              Submission reference: {request.publicId}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            aria-label="Close evidence viewer"
            autoFocus
          >
            Close
          </Button>
        </div>

        <VerificationEvidenceViewer
          verificationPublicId={request.verificationPublicId}
          request={request}
        />
      </section>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function VerificationLoadingState(): ReactNode {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-label="Loading verification details"
    >
      <div className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4">
        <div className="h-5 w-40 rounded bg-[var(--background-muted)]" />
        <div className="mt-3 h-4 w-28 rounded bg-[var(--background-muted)]" />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-16 rounded bg-[var(--background-muted)]"
            />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading verification details…</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberVerificationPanel({
  identityPublicId,
  verification,
  isLoading = false,
  error,
  onRetry,
  className,
}: MemberVerificationPanelProps): ReactNode {
  const [selectedEvidenceRequest, setSelectedEvidenceRequest] =
    useState<MemberVerificationRequest | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [requestRejectionReason, setRequestRejectionReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const actions = useVerificationActions();

  const isLifecycleActionPending =
    actions.reopen.isPending || actions.expire.isPending || actions.revoke.isPending;
  const isRequestActionPending =
    actions.approveRequest.isPending || actions.rejectRequest.isPending;
  const isGrantActionPending =
    actions.grantMember.isPending || actions.grantDriver.isPending;

  async function runLifecycleAction(
    action: "reopen" | "expire" | "revoke",
  ): Promise<void> {
    if (!verification || !identityPublicId.trim()) return;

    setActionError(null);
    setActionSuccess(null);

    const confirmationMessages: Record<typeof action, string> = {
      reopen: "Reopen this member’s verification so they can continue the process?",
      expire: "Mark this verification as expired? This affects the whole verification record, not just the driver’s licence.",
      revoke: "Revoke this member’s entire verification approval? This is terminal and cannot be reopened under the current backend rules.",
    };
    if (!window.confirm(confirmationMessages[action])) return;

    try {
      const variables = {
        verificationPublicId: verification.publicId,
        identityPublicId: identityPublicId.trim(),
      };

      if (action === "reopen") {
        await actions.reopen.mutateAsync(variables);
        setActionSuccess("The member can submit verification again.");
      } else if (action === "expire") {
        await actions.expire.mutateAsync(variables);
        setActionSuccess("The verification record has been marked as expired.");
      } else {
        const reason = revokeReason.trim();
        if (!reason) {
          setActionError("Enter a reason before revoking this verification.");
          return;
        }

        await actions.revoke.mutateAsync({ ...variables, reason });
        setRevokeReason("");
        setActionSuccess("The member’s verification has been revoked. The current backend does not allow reopening a revoked record.");
      }
    } catch (error: unknown) {
      setActionError(
        error instanceof Error
          ? error.message
          : `Unable to ${action} this verification.`,
      );
    }
  }

  async function runRequestAction(
    action: "approve" | "reject",
    request: MemberVerificationRequest,
  ): Promise<void> {
    if (!verification || !request.publicId || isRequestActionPending) return;

    const reason = requestRejectionReason.trim();
    if (action === "reject" && !reason) {
      setActionError("Enter a reason before declining this document.");
      return;
    }

    const typeLabel = formatLabel(request.type).toLowerCase();
    const confirmation = action === "approve"
      ? `Accept this ${typeLabel}? This accepts the document only; it does not automatically verify the member or driver.`
      : `Decline this ${typeLabel} and tell the member why?`;

    if (!window.confirm(confirmation)) return;

    setActionError(null);
    setActionSuccess(null);

    try {
      const variables = {
        verificationPublicId: verification.publicId,
        verificationRequestPublicId: request.publicId,
      };

      if (action === "approve") {
        await actions.approveRequest.mutateAsync(variables);
        setActionSuccess(`${formatLabel(request.type)} accepted. If this is driver-licence evidence, grant driver verification separately after the required checks pass.`);
      } else {
        await actions.rejectRequest.mutateAsync({ ...variables, reason });
        setRequestRejectionReason("");
        setActionSuccess(`${formatLabel(request.type)} declined. The member can submit replacement evidence if the backend workflow permits it.`);
      }
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : `Unable to ${action} this document.`,
      );
    }
  }

  async function runGrantAction(
    action: "member" | "driver",
    request: MemberVerificationRequest,
  ): Promise<void> {
    if (!verification || isGrantActionPending) return;

    const isMemberEvidence =
      request.type === "PROFILE_PHOTO" || request.type === "GOVERNMENT_ID";
    const isDriverEvidence = request.type === "DRIVER_LICENSE";
    if (
      request.status.trim().toUpperCase() !== "APPROVED" ||
      (action === "member" && !isMemberEvidence) ||
      (action === "driver" && !isDriverEvidence)
    ) {
      setActionError("Choose an approved document of the correct type. The backend will validate all other requirements.");
      return;
    }

    const confirmation = action === "member"
      ? "Grant member verification using this approved document? The backend will check the required member evidence."
      : "Grant driver verification using this approved driver’s licence? The backend will check that member verification is already granted.";

    if (!window.confirm(confirmation)) return;

    setActionError(null);
    setActionSuccess(null);

    try {
      const variables = {
        verificationPublicId: verification.publicId,
        verificationRequestPublicId: request.publicId,
      };

      if (action === "member") {
        await actions.grantMember.mutateAsync(variables);
        setActionSuccess("Member verification granted.");
      } else {
        await actions.grantDriver.mutateAsync(variables);
        setActionSuccess("Driver verification granted.");
      }
    } catch (error: unknown) {
      setActionError(
        error instanceof Error
          ? error.message
          : `Unable to grant ${action} verification.`,
      );
    }
  }

  function handleCloseEvidence(): void {
    setSelectedEvidenceRequest(null);
  }

  return (
    <>
      <MemberDataSection
        title="Verification"
        description="See what this member has submitted, what has been accepted, and whether their account is currently verified."
        className={className}
      >
        {isLoading ? (
          <VerificationLoadingState />
        ) : error ? (
          <div
            role="alert"
            className="rounded-[var(--radius-lg)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4"
          >
            <p className="text-sm font-medium text-[var(--foreground)]">
              We couldn’t load this member’s verification details.
            </p>

            <p className="mt-1 break-words text-sm text-[var(--foreground-secondary)]">
              {error}
            </p>

            {onRetry ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-3"
              >
                Reload details
              </Button>
            ) : null}
          </div>
        ) : !verification ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-8 text-center">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Verification has not been started
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              No verification aggregate was returned for this member. This
              does not establish whether the member has submitted evidence
              elsewhere.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Aggregate status */}
            <section className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[var(--foreground-muted)]">
                    Current verification status
                  </p>

                  <div className="mt-2">
                    <MemberVerificationBadge
                      status={
                        verification.status as MemberVerificationStatus
                      }
                      size="sm"
                    />
                  </div>

                  <p className="mt-3 text-sm text-[var(--foreground-secondary)]">
                    Verification type:{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {formatLabel(verification.level)}
                    </span>
                  </p>
                </div>

                <div className="min-w-0 text-sm sm:text-right">
                  <p className="text-xs font-medium text-[var(--foreground-muted)]">
                    Verification reference
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                    {verification.publicId}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                    Approved on
                  </dt>
                  <dd className="mt-1 text-sm text-[var(--foreground)]">
                    {formatTimestamp(
                      verification.verifiedAt ??
                        verification.memberVerifiedAt,
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                    Approval expires
                  </dt>
                  <dd className="mt-1 text-sm text-[var(--foreground)]">
                    {formatTimestamp(verification.expiresAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                    Last reviewed on
                  </dt>
                  <dd className="mt-1 text-sm text-[var(--foreground)]">
                    {formatTimestamp(verification.lastReviewedAt)}
                  </dd>
                </div>

                {verification.reviewedByPublicId ? (
                  <div>
                    <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                      Reviewed by (reference)
                    </dt>
                    <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground)]">
                      {verification.reviewedByPublicId}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {verification.rejectionReason?.trim() ? (
                <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-3">
                  <p className="text-xs font-semibold text-[var(--danger)]">
                    Why verification was declined
                  </p>

                  <p className="mt-1 whitespace-pre-line break-words text-sm text-[var(--foreground)]">
                    {verification.rejectionReason.trim()}
                  </p>
                </div>
              ) : null}
            </section>

            {/* Manage verification status actions */}
            <section className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Manage verification status
              </h3>
              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                These actions apply to the member’s whole verification record. The current backend does not expose a separate action to expire only a driver’s licence.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["REJECTED", "EXPIRED"].includes(verification.status.trim().toUpperCase()) ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void runLifecycleAction("reopen")}
                    disabled={isLifecycleActionPending}
                  >
                    {actions.reopen.isPending ? "Reopening…" : "Allow the member to try again"}
                  </Button>
                ) : null}

                {verification.status.trim().toUpperCase() === "VERIFIED" &&
                verification.expiresAt &&
                !Number.isNaN(new Date(verification.expiresAt).getTime()) &&
                new Date(verification.expiresAt).getTime() <= Date.now() ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void runLifecycleAction("expire")}
                    disabled={isLifecycleActionPending}
                  >
                    {actions.expire.isPending ? "Expiring…" : "End verification now"}
                  </Button>
                ) : null}

                {verification.status.trim().toUpperCase() === "VERIFIED" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setActionError(null);
                      setActionSuccess(null);
                      const form = document.getElementById("verification-revoke-form");
                      form?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }}
                    disabled={isLifecycleActionPending}
                  >
                    Withdraw verification
                  </Button>
                ) : null}
              </div>

              {verification.status.trim().toUpperCase() === "VERIFIED" ? (
                <div id="verification-revoke-form" className="mt-4 space-y-2">
                  <label htmlFor="verification-revoke-reason" className="block text-sm font-medium text-[var(--foreground)]">
                    Why are you withdrawing this approval?
                  </label>
                  <textarea
                    id="verification-revoke-reason"
                    value={revokeReason}
                    onChange={(event) => setRevokeReason(event.target.value)}
                    rows={3}
                    maxLength={1000}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-3 text-sm text-[var(--foreground)]"
                    placeholder="Explain the reason in plain language. This will be recorded for audit purposes."
                    disabled={isLifecycleActionPending}
                  />
                  <Button
                    type="button"
                    onClick={() => void runLifecycleAction("revoke")}
                    disabled={isLifecycleActionPending || !revokeReason.trim()}
                  >
                    {actions.revoke.isPending ? "Revoking…" : "Confirm withdrawal"}
                  </Button>
                </div>
              ) : null}

              {verification.status.trim().toUpperCase() === "REVOKED" ? (
                <p className="mt-3 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-3 text-sm text-[var(--foreground)]">
                  This verification has been revoked. Under the current backend rules, revocation is final: it cannot be reopened. A separate new-verification workflow would be required if the business rules are changed to allow that.
                </p>
              ) : null}

              {verification.status.trim().toUpperCase() === "VERIFIED" &&
              verification.expiresAt &&
              new Date(verification.expiresAt).getTime() > Date.now() ? (
                <p className="mt-3 text-xs text-[var(--foreground-muted)]">
                  This verification is not yet due to expire. The backend only permits expiry once the recorded expiration time has been reached.
                </p>
              ) : null}

              {actionError ? (
                <p role="alert" className="mt-3 break-words text-sm text-[var(--danger)]">
                  {actionError}
                </p>
              ) : null}
              {actionSuccess ? (
                <p role="status" className="mt-3 text-sm text-[var(--success)]">
                  {actionSuccess}
                </p>
              ) : null}
            </section>

            {/* Accepted verification indicators */}
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                What has been verified
              </h3>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                These indicators reflect the values returned by the
                Verification aggregate.
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                <VerificationIndicator
                  label="Profile photo"
                  verified={verification.profilePhotoVerified}
                  verifiedAt={verification.profilePhotoVerifiedAt}
                />

                <VerificationIndicator
                  label="National ID or other government ID"
                  verified={verification.governmentIdVerified}
                  verifiedAt={verification.governmentIdVerifiedAt}
                />

                <VerificationIndicator
                  label="Driver’s licence"
                  verified={verification.driverLicenseVerified}
                  verifiedAt={verification.driverLicenseVerifiedAt}
                />
              </div>
            </section>

            {/* Submitted evidence requests */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Documents submitted by the member
                </h3>

                <span className="text-xs text-[var(--foreground-muted)]">
                  {verification.requests.length}{" "}
                  {verification.requests.length === 1
                    ? "request"
                    : "requests"}
                </span>
              </div>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Each request has its own review status. An approved request
                does not by itself establish aggregate verification.
              </p>

              {verification.requests.length === 0 ? (
                <div className="mt-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-6 text-center">
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    No evidence requests are recorded on this verification
                    aggregate.
                  </p>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {verification.requests.map((request) => {
                    const requestStatus = request.status.trim().toUpperCase();
                    const isPendingRequest = requestStatus === "PENDING";
                    const isApprovedRequest = requestStatus === "APPROVED";
                    const isMemberEvidence =
                      request.type === "PROFILE_PHOTO" || request.type === "GOVERNMENT_ID";
                    const isDriverEvidence = request.type === "DRIVER_LICENSE";
                    const aggregateStatus = verification.status.trim().toUpperCase();
                    const canGrantMember =
                      aggregateStatus === "PENDING" &&
                      verification.level === "NONE" &&
                      isApprovedRequest &&
                      isMemberEvidence;
                    const canGrantDriver =
                      aggregateStatus === "VERIFIED" &&
                      verification.level === "MEMBER" &&
                      isApprovedRequest &&
                      isDriverEvidence;

                    return (
                      <div key={request.publicId} className="space-y-3">
                        <VerificationRequestCard
                          request={request}
                          onViewEvidence={setSelectedEvidenceRequest}
                        />

                        {isPendingRequest ? (
                          <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              Review this submission
                            </p>
                            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                              Accepting or declining a document is separate from granting member or driver verification.
                            </p>
                            {requestStatus === "PENDING" ? (
                              <div className="mt-3 space-y-2">
                                <label
                                  htmlFor={`request-rejection-reason-${request.publicId}`}
                                  className="block text-sm font-medium text-[var(--foreground)]"
                                >
                                  Reason if declining this document
                                </label>
                                <textarea
                                  id={`request-rejection-reason-${request.publicId}`}
                                  value={requestRejectionReason}
                                  onChange={(event) => setRequestRejectionReason(event.target.value)}
                                  rows={2}
                                  maxLength={1000}
                                  disabled={isRequestActionPending}
                                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-3 text-sm text-[var(--foreground)]"
                                  placeholder="Explain what is missing or needs correction"
                                />
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    onClick={() => void runRequestAction("approve", request)}
                                    disabled={isRequestActionPending || isLifecycleActionPending || isGrantActionPending}
                                  >
                                    {actions.approveRequest.isPending ? "Accepting…" : "Accept document"}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => void runRequestAction("reject", request)}
                                    disabled={isRequestActionPending || isLifecycleActionPending || isGrantActionPending || !requestRejectionReason.trim()}
                                  >
                                    {actions.rejectRequest.isPending ? "Declining…" : "Decline document"}
                                  </Button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {canGrantMember ? (
                          <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              Grant member verification
                            </p>
                            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                              This approved document may be used for member verification. The backend checks that all required member evidence has been accepted.
                            </p>
                            <Button
                              type="button"
                              className="mt-3"
                              onClick={() => void runGrantAction("member", request)}
                              disabled={isGrantActionPending || isLifecycleActionPending || isRequestActionPending}
                            >
                              {actions.grantMember.isPending ? "Granting member verification…" : "Grant member verification"}
                            </Button>
                          </div>
                        ) : null}

                        {canGrantDriver ? (
                          <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              Grant driver verification
                            </p>
                            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                              This approved driver’s licence can be used to request driver-level verification. Member verification must already be active.
                            </p>
                            <Button
                              type="button"
                              className="mt-3"
                              onClick={() => void runGrantAction("driver", request)}
                              disabled={isGrantActionPending || isLifecycleActionPending || isRequestActionPending}
                            >
                              {actions.grantDriver.isPending ? "Granting driver verification…" : "Grant driver verification"}
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </MemberDataSection>

      {selectedEvidenceRequest ? (
        <EvidenceDialog
          request={selectedEvidenceRequest}
          onClose={handleCloseEvidence}
        />
      ) : null}
    </>
  );
}

export default MemberVerificationPanel;
