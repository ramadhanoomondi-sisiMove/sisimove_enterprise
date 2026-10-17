
import { Badge } from "@/components/ui/badge";

import type { BadgeVariant } from "@/components/ui/badge";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationRequestStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

interface StatusPresentation {
  label: string;
  variant: BadgeVariant;
}

/**
 * Presentation mappings for verification request statuses.
 *
 * Keep these values aligned with VerificationRequestStatus in the backend.
 */
const STATUS_PRESENTATION: Record<string, StatusPresentation> = {
  PENDING: {
    label: "Pending review",
    variant: "warning",
  },
  APPROVED: {
    label: "Approved",
    variant: "success",
  },
  REJECTED: {
    label: "Rejected",
    variant: "danger",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "outline",
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationRequestStatusBadge({
  status,
  size = "sm",
  className,
}: VerificationRequestStatusBadgeProps) {
  const normalizedStatus = status.trim().toUpperCase();

  const presentation = STATUS_PRESENTATION[normalizedStatus] ?? {
    label:
      normalizedStatus
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase()) ||
      "Unknown",
    variant: "default" as const,
  };

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
      aria-label={`Verification request status: ${presentation.label}`}
    >
      {presentation.label}
    </Badge>
  );
}

export default VerificationRequestStatusBadge;
