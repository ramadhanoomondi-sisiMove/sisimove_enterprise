
import { Card } from "@/components/ui";
import { VerificationLevelBadge } from "../primitives";
import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";
export interface VerificationLevelPanelProps {
  verification: VerificationApiResponse;
  className?: string;
}

const levelDescriptions: Record<VerificationApiResponse["level"], string> = {
  NONE: "No verification level has been assigned.",
  MEMBER: "Member-level verification.",
  DRIVER: "Driver-level verification.",
};

export function VerificationLevelPanel({
  verification,
  className,
}: VerificationLevelPanelProps) {
  return (
    <Card padding="md" className={className}>
      <section
        aria-labelledby="verification-level-panel-title"
        className="space-y-4"
      >
        <div>
          <h2
            id="verification-level-panel-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Verification level
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            The level currently assigned to this verification record.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VerificationLevelBadge level={verification.level} />
        </div>

        <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
          {levelDescriptions[verification.level]}
        </p>
      </section>
    </Card>
  );
}

export default VerificationLevelPanel;
