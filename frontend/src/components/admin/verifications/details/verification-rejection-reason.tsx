// -----------------------------------------------------------------------------
// sisiMove — Verification Rejection Reason
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display an aggregate-level or request-level rejection reason.
// - Avoid rendering an empty rejection section.
// - Use existing design-system components and frozen global tokens.
// - Remain presentational; no verification mutations.
//
// -----------------------------------------------------------------------------

import { Card } from "@/components/ui";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationRejectionReasonProps {
  reason?: string | null;
  title?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationRejectionReason({
  reason,
  title = "Rejection reason",
  className,
}: VerificationRejectionReasonProps) {
  const normalizedReason = reason?.trim();

  if (!normalizedReason) {
    return null;
  }

  return (
    <Card
      padding="md"
      className={className}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className={[
            "flex",
            "h-9",
            "w-9",
            "shrink-0",
            "items-center",
            "justify-center",
            "rounded-[var(--radius-md)]",
            "bg-[var(--danger-soft)]",
            "text-[var(--danger)]",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            className="h-5 w-5"
          >
            <path
              d="M10 6v4m0 3h.01M3.5 16.5h13L10 3.5l-6.5 13Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            {title}
          </h3>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--foreground-secondary)]">
            {normalizedReason}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default VerificationRejectionReason;