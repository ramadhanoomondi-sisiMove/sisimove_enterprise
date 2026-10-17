
"use client";

import { useState } from "react";
import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";

export interface VerificationActionMenuProps {
  verification: VerificationApiResponse;
  onViewDetails?: (verification: VerificationApiResponse) => void;
  onApprove?: (verification: VerificationApiResponse) => void;
  onReject?: (verification: VerificationApiResponse) => void;
  isLoading?: boolean;
  className?: string;
}

export function VerificationActionMenu({
  verification,
  onViewDetails,
  onApprove,
  onReject,
  isLoading = false,
  className,
}: VerificationActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isPending = verification.status === "PENDING";

  const actions = [
    onViewDetails
      ? {
          label: "View details",
          run: () => onViewDetails(verification),
        }
      : null,
    isPending && onApprove
      ? {
          label: "Approve verification",
          run: () => onApprove(verification),
        }
      : null,
    isPending && onReject
      ? {
          label: "Reject verification",
          run: () => onReject(verification),
          destructive: true,
        }
      : null,
  ].filter(
    (
      action,
    ): action is {
      label: string;
      run: () => void;
      destructive?: boolean;
    } => action !== null,
  );

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={["relative inline-block text-left", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Actions
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-4 w-4"
        >
          <path
            d="m5 7.5 5 5 5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div
            role="menu"
            aria-label="Verification actions"
            className="absolute right-0 z-20 mt-2 min-w-52 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow-md)]"
          >
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                disabled={isLoading}
                onClick={() => {
                  setIsOpen(false);
                  action.run();
                }}
                className={[
                  "block w-full rounded px-3 py-2 text-left text-sm",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  action.destructive
                    ? "text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                    : "text-[var(--foreground)] hover:bg-[var(--background-subtle)]",
                ].join(" ")}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default VerificationActionMenu;
