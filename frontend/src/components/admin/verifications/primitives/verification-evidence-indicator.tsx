
import { Badge } from "@/components/ui/badge";

import type { BadgeVariant } from "@/components/ui/badge";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationEvidenceIndicatorProps {
  label: string;
  verified: boolean;
  size?: "sm" | "md";
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationEvidenceIndicator({
  label,
  verified,
  size = "sm",
  className,
}: VerificationEvidenceIndicatorProps) {
  const variant: BadgeVariant = verified ? "success" : "default";
  const statusLabel = verified ? "Verified" : "Not verified";

  return (
    <Badge
      variant={variant}
      size={size}
      className={className}
      aria-label={`${label}: ${statusLabel}`}
      title={`${label}: ${statusLabel}`}
      leadingContent={
        <span aria-hidden="true">
          {verified ? "✓" : "—"}
        </span>
      }
    >
      {label}: {statusLabel}
    </Badge>
  );
}

export default VerificationEvidenceIndicator;
