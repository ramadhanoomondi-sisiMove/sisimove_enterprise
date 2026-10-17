
import { Badge } from "@/components/ui/badge";

import type { BadgeVariant } from "@/components/ui/badge";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type VerificationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "REVOKED"
  | "REOPENED"
  | "CANCELLED";

export interface VerificationStatusBadgeProps {
  status: VerificationStatus | string;
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

const STATUS_PRESENTATION: Record<string, StatusPresentation> = {
  PENDING: {
    label: "Pending",
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
  EXPIRED: {
    label: "Expired",
    variant: "default",
  },
  REVOKED: {
    label: "Revoked",
    variant: "danger",
  },
  REOPENED: {
    label: "Reopened",
    variant: "brand",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "outline",
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationStatusBadge({
  status,
  size = "sm",
  className,
}: VerificationStatusBadgeProps) {
  const normalizedStatus = status.trim().toUpperCase();

  const presentation = STATUS_PRESENTATION[normalizedStatus] ?? {
    label: status
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase()) || "Unknown",
    variant: "default" as const,
  };

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
      aria-label={`Verification status: ${presentation.label}`}
    >
      {presentation.label}
    </Badge>
  );
}

export default VerificationStatusBadge;
