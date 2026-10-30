
import { Badge } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

import type { AdminFinancialPaymentStatus } from "@/features/admin/finance/payments";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentStatusBadgeProps {
  status: AdminFinancialPaymentStatus;
  className?: string;
}

type StatusPresentation = {
  label: string;
  variant: "default" | "brand" | "success" | "warning" | "danger";
};

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

const STATUS_PRESENTATION: Record<
  AdminFinancialPaymentStatus,
  StatusPresentation
> = {
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "brand" },
  succeeded: { label: "Succeeded", variant: "success" },
  failed: { label: "Failed", variant: "danger" },
  cancelled: { label: "Cancelled", variant: "default" },
  expired: { label: "Expired", variant: "default" },
};

const FALLBACK_PRESENTATION: StatusPresentation = {
  label: "Unknown",
  variant: "default",
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const normalizedStatus =
    typeof status === "string" ? status.trim().toLowerCase() : "";

  const presentation =
    STATUS_PRESENTATION[
      normalizedStatus as AdminFinancialPaymentStatus
    ] ?? FALLBACK_PRESENTATION;

  return (
    <Badge
      variant={presentation.variant}
      size="sm"
      className={cn(className)}
    >
      {presentation.label}
    </Badge>
  );
}

export default PaymentStatusBadge;
