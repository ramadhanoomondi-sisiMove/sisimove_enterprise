// -----------------------------------------------------------------------------
// sisiMove — Verification Queue Table
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render verification records in an accessible table.
// - Display status, level, evidence completion, and timestamps.
// - Support loading, empty, and error states.
// - Delegate record navigation to the parent component.
// - Perform no API calls or verification mutations.
//
// -----------------------------------------------------------------------------

"use client";

import {
  VerificationStatusBadge,
  VerificationLevelBadge,
} from "../primitives";

import {
  VerificationQueueSkeleton,
  VerificationEmptyState,
  VerificationErrorState,
} from "../feedback";

import {
  getVerificationQueueColumnValue,
  verificationQueueColumns,
} from "./verification-queue-columns";

import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";


// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationQueueTableProps {
  verifications: VerificationApiResponse[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onOpenVerification?: (verification: VerificationApiResponse) => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function EvidenceSummary({
  verification,
}: {
  verification: VerificationApiResponse;
}) {
  const evidence = [
    {
      label: "Profile photo",
      verified: verification.profilePhotoVerified,
    },
    {
      label: "Government ID",
      verified: verification.governmentIdVerified,
    },
    {
      label: "Driver license",
      verified: verification.driverLicenseVerified,
    },
  ];

  const verifiedCount = evidence.filter(
    (item) => item.verified,
  ).length;

  return (
    <div
      className="space-y-1"
      aria-label={`${verifiedCount} of ${evidence.length} evidence categories verified`}
    >
      <p className="text-sm font-medium text-[var(--foreground)]">
        {verifiedCount} of {evidence.length}
      </p>

      <div className="flex flex-wrap gap-1">
        {evidence.map((item) => (
          <span
            key={item.label}
            title={`${item.label}: ${item.verified ? "Verified" : "Not verified"}`}
            className={[
              "inline-block",
              "h-1.5",
              "w-6",
              "rounded-full",
              item.verified
                ? "bg-[var(--success)]"
                : "bg-[var(--background-muted)]",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationQueueTable({
  verifications,
  isLoading = false,
  error = null,
  onRetry,
  onOpenVerification,
  className,
}: VerificationQueueTableProps) {
  if (isLoading) {
    return <VerificationQueueSkeleton className={className} />;
  }

  if (error) {
    return (
      <VerificationErrorState
        description={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (verifications.length === 0) {
    return (
      <VerificationEmptyState
        title="No verification records"
        description="There are no verification records to display."
        className={className}
      />
    );
  }

  const columns = verificationQueueColumns;

  return (
    <div
      className={[
        "w-full",
        "overflow-hidden",
        "rounded-[var(--radius-lg)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <caption className="sr-only">
            Verification review queue
          </caption>

          <thead className="bg-[var(--background-muted)]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  title={column.description}
                  className={[
                    "px-4",
                    "py-3",
                    "text-xs",
                    "font-semibold",
                    "uppercase",
                    "tracking-wide",
                    "text-[var(--foreground-secondary)]",
                    column.hideOnMobile ? "hidden md:table-cell" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-subtle)]">
            {verifications.map((verification) => {
              const evidenceCount = getVerificationQueueColumnValue(
                verification,
                "evidence",
              );

              return (
                <tr
                  key={verification.publicId}
                  className={[
                    "transition-colors",
                    "hover:bg-[var(--background-subtle)]",
                  ].join(" ")}
                >
                  {/* Identity */}
                  <td className="px-4 py-4">
                    <div className="min-w-0 space-y-1">
                      <p className="break-all text-sm font-medium text-[var(--foreground)]">
                        {verification.identityPublicId}
                      </p>

                      <p className="break-all text-xs text-[var(--foreground-muted)]">
                        {verification.publicId}
                      </p>
                    </div>
                  </td>

                  {/* Aggregate status */}
                  <td className="px-4 py-4">
                    <VerificationStatusBadge
                      status={verification.status}
                    />
                  </td>

                  {/* Level */}
                  <td className="hidden px-4 py-4 md:table-cell">
                    <VerificationLevelBadge
                      level={verification.level}
                    />
                  </td>

                  {/* Evidence */}
                  <td className="hidden px-4 py-4 md:table-cell">
                    <EvidenceSummary verification={verification} />
                    <span className="sr-only">
                      {String(evidenceCount)} verified evidence categories
                    </span>
                  </td>

                  {/* Created date */}
                  <td className="px-4 py-4 text-sm text-[var(--foreground-secondary)]">
                    {formatDate(verification.createdAt)}
                  </td>

                  {/* Last reviewed */}
                  <td className="hidden px-4 py-4 text-sm text-[var(--foreground-secondary)] md:table-cell">
                    {formatDate(verification.lastReviewedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    {onOpenVerification ? (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenVerification(verification)
                        }
                        className={[
                          "inline-flex",
                          "min-h-9",
                          "items-center",
                          "justify-center",
                          "rounded-[var(--radius-md)]",
                          "px-3",
                          "text-sm",
                          "font-medium",
                          "text-[var(--brand)]",
                          "transition-colors",
                          "hover:bg-[var(--brand-soft)]",
                          "focus-visible:outline-2",
                          "focus-visible:outline-[var(--brand)]",
                          "focus-visible:outline-offset-2",
                        ].join(" ")}
                        aria-label={`View verification ${verification.publicId}`}
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-sm text-[var(--foreground-muted)]">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--border-subtle)] px-4 py-3">
        <p className="text-xs text-[var(--foreground-muted)]">
          Showing {verifications.length.toLocaleString()}{" "}
          {verifications.length === 1 ? "record" : "records"}
        </p>
      </div>
    </div>
  );
}

export default VerificationQueueTable;