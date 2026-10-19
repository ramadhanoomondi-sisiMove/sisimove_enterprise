
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui";
import { useVerificationEvidence } from "@/features/admin/verifications/hooks/use-verification-evidence";

export interface VerificationEvidenceViewerRequest {
  publicId: string;
  verificationPublicId: string;
  assetPublicId: string;
  type: string;
  status: string;
  submittedAt: string;
}

export interface VerificationEvidenceViewerProps {
  verificationPublicId: string;
  request: VerificationEvidenceViewerRequest;
  className?: string;
}

export function VerificationEvidenceViewer({
  verificationPublicId,
  request,
  className,
}: VerificationEvidenceViewerProps) {
  const [previewError, setPreviewError] = useState(false);

  const {
    data: evidence,
    isPending,
    isError,
  } = useVerificationEvidence(
    verificationPublicId,
    request.publicId,
  );

  const evidenceUrl = useMemo(() => {
    if (!evidence || evidence.size === 0) {
      return null;
    }

    return URL.createObjectURL(evidence);
  }, [evidence]);

  useEffect(() => {
    return () => {
      if (evidenceUrl) {
        URL.revokeObjectURL(evidenceUrl);
      }
    };
  }, [evidenceUrl]);

  // Detect the actual file format instead of assuming it from
  // PROFILE_PHOTO, GOVERNMENT_ID, or DRIVER_LICENSE.
  const contentType = evidence?.type.toLowerCase() ?? "";
  const isImage = contentType.startsWith("image/");
  const isPdf = contentType === "application/pdf";

  const canPreview =
    evidenceUrl !== null &&
    (isImage || isPdf) &&
    !previewError;

  const evidenceType = request.type
    .replaceAll("_", " ")
    .toLowerCase();

  const formattedSubmittedAt = useMemo(() => {
    if (!request.submittedAt) {
      return "Not available";
    }

    const date = new Date(request.submittedAt);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }, [request.submittedAt]);

  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby="verification-evidence-viewer-title"
        className="space-y-4"
      >
        <div>
          <h2
            id="verification-evidence-viewer-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Evidence viewer
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Submitted evidence associated with this verification request.
          </p>
        </div>

        {isPending ? (
          <div
            role="status"
            className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4"
          >
            <p className="text-sm text-[var(--foreground)]">
              Loading private evidence...
            </p>
          </div>
        ) : null}

        {isError ? (
          <div
            role="alert"
            className="rounded-[var(--radius-md)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4"
          >
            <p className="text-sm font-medium text-[var(--foreground)]">
              Private evidence could not be loaded.
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Check reviewer permissions and your connection, then try again.
            </p>
          </div>
        ) : null}

        {canPreview && isImage && evidenceUrl ? (
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)]">
            <Image
              src={evidenceUrl}
              alt={`Submitted ${evidenceType} evidence`}
              width={1200}
              height={900}
              unoptimized
              className="max-h-[65vh] w-full object-contain"
              onError={() => setPreviewError(true)}
            />
          </div>
        ) : null}

        {canPreview && isPdf && evidenceUrl ? (
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
            <iframe
              src={evidenceUrl}
              title={`Submitted ${evidenceType} evidence`}
              className="h-[65vh] min-h-[24rem] w-full"
            />
          </div>
        ) : null}

        {!isPending && !isError && !canPreview ? (
          <div
            role="status"
            className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4"
          >
            <p className="text-sm font-medium text-[var(--foreground)]">
              {previewError
                ? "The evidence preview could not be displayed."
                : evidence && evidence.size === 0
                  ? "The evidence file is empty."
                  : evidence
                    ? `Preview is not supported for this file type${
                        contentType ? ` (${contentType})` : ""
                      }.`
                    : "Evidence preview is not available."}
            </p>

            <p className="mt-1 break-all text-sm text-[var(--foreground-secondary)]">
              Asset reference: {request.assetPublicId}
            </p>
          </div>
        ) : null}

        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Evidence type
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {request.type.replaceAll("_", " ")}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Request status
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {request.status}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Submitted
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {formattedSubmittedAt}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Request ID
            </dt>

            <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground-secondary)]">
              {request.publicId}
            </dd>
          </div>
        </dl>
      </section>
    </Card>
  );
}

export default VerificationEvidenceViewer;
