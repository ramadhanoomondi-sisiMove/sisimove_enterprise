
"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui";
import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";
import {
  VerificationLevelBadge,
  VerificationStatusBadge,
} from "../primitives";

export interface VerificationQuickViewDrawerProps {
  verification: VerificationApiResponse | null;
  open: boolean;
  onClose: () => void;
  onViewDetails?: (verification: VerificationApiResponse) => void;
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

export function VerificationQuickViewDrawer({
  verification,
  open,
  onClose,
  onViewDetails,
  className,
}: VerificationQuickViewDrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !verification) {
    return null;
  }

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
      label: "Driver's licence",
      verified: verification.driverLicenseVerified,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/40"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-quick-view-title"
        className={[
          "absolute inset-y-0 right-0 flex w-full max-w-xl flex-col",
          "border-l border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] p-5">
          <div className="min-w-0">
            <h2
              id="verification-quick-view-title"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              Verification quick view
            </h2>
            <p className="mt-1 break-all text-sm text-[var(--foreground-secondary)]">
              {verification.identityPublicId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close verification quick view"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--foreground-secondary)] hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              className="h-5 w-5"
            >
              <path
                d="m5 5 10 10M15 5 5 15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <Card padding="md">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Verification ID
                </p>
                <p className="mt-1 break-all text-sm text-[var(--foreground)]">
                  {verification.publicId}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <VerificationStatusBadge status={verification.status} />
                <VerificationLevelBadge level={verification.level} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                    Created
                  </p>
                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    {formatDate(verification.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                    Last reviewed
                  </p>
                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    {formatDate(verification.lastReviewedAt)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <section aria-labelledby="quick-view-evidence-title" className="space-y-3">
            <h3
              id="quick-view-evidence-title"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              Evidence verification
            </h3>

            <Card padding="md">
              <ul className="divide-y divide-[var(--border-subtle)]">
                {evidence.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm text-[var(--foreground-secondary)]">
                      {item.label}
                    </span>

                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        item.verified
                          ? "bg-[var(--success-soft)] text-[var(--success)]"
                          : "bg-[var(--background-muted)] text-[var(--foreground-muted)]",
                      ].join(" ")}
                    >
                      {item.verified ? "Verified" : "Not verified"}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {verification.rejectionReason && (
            <Card padding="md">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Rejection reason
              </h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--foreground-secondary)]">
                {verification.rejectionReason}
              </p>
            </Card>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--border-subtle)] p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
          >
            Close
          </button>

          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(verification)}
              className="rounded-[var(--radius-md)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-foreground)] hover:bg-[var(--brand-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
            >
              View full details
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

export default VerificationQuickViewDrawer;
