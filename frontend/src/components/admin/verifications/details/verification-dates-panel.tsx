
import { Card } from "@/components/ui";
import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";

export interface VerificationDatesPanelProps {
  verification: VerificationApiResponse;
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

export function VerificationDatesPanel({
  verification,
  className,
}: VerificationDatesPanelProps) {
  const dates = [
    {
      label: "Date created",
      value: verification.createdAt,
    },
    {
      label: "Last updated",
      value: verification.updatedAt,
    },
    {
      label: "Last reviewed",
      value: verification.lastReviewedAt,
    },
    {
      label: "Verified at",
      value: verification.verifiedAt,
    },
  ];

  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby="verification-dates-panel-title"
        className="space-y-4"
      >
        <div>
          <h2
            id="verification-dates-panel-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Important dates
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Key timestamps recorded for this verification.
          </p>
        </div>

        <dl className="divide-y divide-[var(--border-subtle)]">
          {dates.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <dt className="text-sm text-[var(--foreground-secondary)]">
                {label}
              </dt>
              <dd className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                {formatDate(value)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Card>
  );
}

export default VerificationDatesPanel;
