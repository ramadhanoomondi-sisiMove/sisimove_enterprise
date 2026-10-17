
import { Card } from "@/components/ui";
import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";
export interface VerificationResultsPanelProps {
  verification: VerificationApiResponse;
  className?: string;
}

const evidenceItems = [
  {
    key: "profilePhotoVerified",
    label: "Profile photo",
  },
  {
    key: "governmentIdVerified",
    label: "Government ID",
  },
  {
    key: "driverLicenseVerified",
    label: "Driver's licence",
  },
] as const;

export function VerificationResultsPanel({
  verification,
  className,
}: VerificationResultsPanelProps) {
  const verifiedCount = evidenceItems.filter(
    ({ key }) => verification[key],
  ).length;

  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby="verification-results-panel-title"
        className="space-y-4"
      >
        <div>
          <h2
            id="verification-results-panel-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Verification results
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Summary of the evidence verification flags recorded for this
            member.
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {verifiedCount} / {evidenceItems.length}
          </span>
          <span className="text-sm text-[var(--foreground-secondary)]">
            evidence items verified
          </span>
        </div>

        <ul className="divide-y divide-[var(--border-subtle)]">
          {evidenceItems.map(({ key, label }) => {
            const isVerified = verification[key];

            return (
              <li
                key={key}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="text-sm text-[var(--foreground-secondary)]">
                  {label}
                </span>

                <span
                  className={[
                    "inline-flex items-center rounded-full px-2.5 py-1",
                    "text-xs font-medium",
                    isVerified
                      ? "bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--background-muted)] text-[var(--foreground-muted)]",
                  ].join(" ")}
                >
                  {isVerified ? "Verified" : "Not verified"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </Card>
  );
}

export default VerificationResultsPanel;
