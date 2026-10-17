
import { Card } from "@/components/ui";
import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";
import {
  VerificationLevelBadge,
  VerificationStatusBadge,
} from "../primitives";

export interface VerificationDetailHeaderProps {
  verification: VerificationApiResponse;
  onBack?: () => void;
  className?: string;
}

export function VerificationDetailHeader({
  verification,
  onBack,
  className,
}: VerificationDetailHeaderProps) {
  return (
    <Card padding="md" className={className}>
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to verification queue"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
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
                    d="M12.5 4.5 7 10l5.5 5.5M7.5 10H17"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Verification details
              </p>
              <h1 className="mt-1 break-all text-xl font-semibold text-[var(--foreground)]">
                {verification.identityPublicId}
              </h1>
              <p className="mt-1 break-all text-sm text-[var(--foreground-secondary)]">
                Verification ID: {verification.publicId}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <VerificationStatusBadge status={verification.status} />
            <VerificationLevelBadge level={verification.level} />
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-3">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Review the submitted evidence and recorded verification results
            before taking any action.
          </p>
        </div>
      </header>
    </Card>
  );
}

export default VerificationDetailHeader;
