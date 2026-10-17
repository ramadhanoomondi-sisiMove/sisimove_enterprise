
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";
import { verificationsApi } from "@/features/admin/verifications/api/verifications.api";
import { useVerificationActions } from "@/features/admin/verifications/hooks/use-verification-actions";

import type {
  VerificationApiResponse,
  VerificationRequestApiResponse,
} from "@/features/admin/verifications/types/verification-api.types";

import {
  VerificationAccessDenied,
  VerificationDatesPanel,
  VerificationDetailHeader,
  VerificationEvidencePanel,
  VerificationLevelPanel,
  VerificationMemberSummary,
  VerificationRequestList,
  VerificationResultsPanel,
  VerificationReviewerPanel,
  VerificationStatusPanel,
  VerificationErrorState,
  VerificationDetailSkeleton,
} from "@/components/admin/verifications";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isForbiddenError(error: unknown): boolean {
  if (!isRecord(error)) {
    return false;
  }

  if (
    error.status === 403 ||
    error.statusCode === 403 ||
    error.code === "HTTP.FORBIDDEN"
  ) {
    return true;
  }

  if (!isRecord(error.response)) {
    return false;
  }

  const response = error.response;

  if (response.status === 403 || response.statusCode === 403) {
    return true;
  }

  if (!isRecord(response.data)) {
    return false;
  }

  return (
    response.data.statusCode === 403 ||
    response.data.code === "HTTP.FORBIDDEN"
  );
}

export default function VerificationDetailPage() {
  const params = useParams<{ verificationPublicId: string }>();
  const router = useRouter();
  const verificationPublicId = params.verificationPublicId;

  const actions = useVerificationActions();

  const [submittingRequestPublicId, setSubmittingRequestPublicId] =
    useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  const {
    data: verification,
    isPending,
    isError,
    error: verificationError,
    refetch,
  } = useQuery<VerificationApiResponse, Error>({
    queryKey: ["verifications", "detail", verificationPublicId],
    queryFn: () => verificationsApi.getByPublicId(verificationPublicId),
    enabled: Boolean(verificationPublicId),
  });

  function handleApprove(request: VerificationRequestApiResponse) {
    setActionError(null);
    setActionMessage(null);
    setSubmittingRequestPublicId(request.publicId);

    actions.approveRequest.mutate(
      {
        verificationPublicId,
        verificationRequestPublicId: request.publicId,
      },
      {
        onSuccess: async () => {
          await refetch();
          setActionMessage("Evidence request approved successfully.");
        },
        onError: (error) => {
          if (isForbiddenError(error)) {
            setIsAccessDenied(true);
            return;
          }

          setActionError(
            error instanceof Error
              ? error.message
              : "Unable to approve this evidence request.",
          );
        },
        onSettled: () => {
          setSubmittingRequestPublicId(null);
        },
      },
    );
  }

  function handleReject(
    request: VerificationRequestApiResponse,
    reason: string,
  ) {
    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      setActionError("A rejection reason is required.");
      return;
    }

    setActionError(null);
    setActionMessage(null);
    setSubmittingRequestPublicId(request.publicId);

    actions.rejectRequest.mutate(
      {
        verificationPublicId,
        verificationRequestPublicId: request.publicId,
        reason: normalizedReason,
      },
      {
        onSuccess: async () => {
          await refetch();
          setActionMessage("Evidence request rejected successfully.");
        },
        onError: (error) => {
          if (isForbiddenError(error)) {
            setIsAccessDenied(true);
            return;
          }

          setActionError(
            error instanceof Error
              ? error.message
              : "Unable to reject this evidence request.",
          );
        },
        onSettled: () => {
          setSubmittingRequestPublicId(null);
        },
      },
    );
  }

  if (isAccessDenied || (isError && isForbiddenError(verificationError))) {
    return (
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        <VerificationAccessDenied
          title="Verification access denied"
          description="Your account does not have permission to perform this action or access these verification records. Contact an administrator to request the required permissions."
          onGoBack={() => router.push(ADMIN_ROUTES.VERIFICATIONS)}
        />
      </main>
    );
  }

  if (isPending) {
    return <VerificationDetailSkeleton />;
  }

  if (isError) {
    return (
      <VerificationErrorState
        title="Unable to load verification details"
        description="The verification record could not be loaded. Check your connection and try again."
        onRetry={() => {
          void refetch();
        }}
        retryLabel="Try again"
      />
    );
  }

  if (!verification) {
    return (
      <VerificationErrorState
        title="Verification not found"
        description="No verification record was returned for this identifier."
        onRetry={() => router.push(ADMIN_ROUTES.VERIFICATIONS)}
        retryLabel="Back to verification queue"
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <VerificationDetailHeader
        verification={verification}
        onBack={() => router.push(ADMIN_ROUTES.VERIFICATIONS)}
      />

      {actionError && (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]"
        >
          {actionError}
        </div>
      )}

      {actionMessage && (
        <div
          role="status"
          className="rounded-[var(--radius-md)] border border-[var(--success)] bg-[var(--success-soft)] p-3 text-sm text-[var(--success)]"
        >
          {actionMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VerificationMemberSummary verification={verification} />
        <VerificationStatusPanel verification={verification} />
        <VerificationLevelPanel verification={verification} />
        <VerificationResultsPanel verification={verification} />
        <VerificationDatesPanel verification={verification} />
        <VerificationReviewerPanel verification={verification} />
      </div>

      <VerificationEvidencePanel verification={verification} />

      <VerificationRequestList
        verificationPublicId={verificationPublicId}
        requests={verification.requests ?? []}
        onApprove={handleApprove}
        onReject={handleReject}
        submittingRequestPublicId={submittingRequestPublicId}
      />
    </main>
  );
}
