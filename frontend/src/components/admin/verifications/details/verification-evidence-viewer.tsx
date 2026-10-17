
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui";
import { useVerificationEvidence } from "@/features/admin/verifications/hooks/use-verification-evidence";
import type { VerificationRequestApiResponse } from "@/features/admin/verifications/types/verification-api.types";

export interface VerificationEvidenceViewerProps {
  verificationPublicId: string;
  request: VerificationRequestApiResponse;
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

  // Determine the preview format from the actual file, not the
  // verification category (PROFILE_PHOTO, GOVERNMENT_ID, DRIVER_LICENSE).
  const contentType = evidence?.type.toLowerCase() ?? "";
  const isImage = contentType.startsWith("image/");
  const isPdf = contentType === "application/pdf";

  const canPreview =
    evidenceUrl !== null &&
    (isImage || isPdf) &&
    !previewError;

  const evidenceType = request.type.replaceAll("_", " ").toLowerCase();

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

        {canPreview && isImage && evidenceUrl ? (
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
            <Image
              src={evidenceUrl}
              alt={`Submitted ${evidenceType} evidence`}
              width={1200}
              height={900}
              unoptimized
              className="max-h-[32rem] w-full object-contain"
              onError={() => setPreviewError(true)}
            />
          </div>
        ) : null}

        {canPreview && isPdf && evidenceUrl ? (
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
            <iframe
              src={evidenceUrl}
              title={`Submitted ${evidenceType} evidence`}
              className="h-[32rem] w-full"
            />
          </div>
        ) : null}

        {!canPreview ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">
              {isPending
                ? "Loading private evidence..."
                : isError
                  ? "Private evidence could not be loaded. Check reviewer permissions and try again."
                  : previewError
                    ? "The evidence preview could not be displayed."
                    : evidence && evidence.size === 0
                      ? "The evidence file is empty."
                      : evidence
                        ? `Preview is not supported for this file type${contentType ? ` (${contentType})` : ""}.`
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
              {request.submittedAt
                ? new Intl.DateTimeFormat("en-KE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(request.submittedAt))
                : "Not available"}
            </dd>
          </div>
        </dl>
      </section>
    </Card>
  );
}

export default VerificationEvidenceViewer;
