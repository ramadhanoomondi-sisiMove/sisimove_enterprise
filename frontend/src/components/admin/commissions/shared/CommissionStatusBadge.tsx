// src/components/admin/commissions/shared/CommissionStatusBadge.tsx
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Status Badge
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the lifecycle status of a commission.
// - Apply consistent semantic badge variants.
// - Reuse the shared design-system Badge primitive.
// - Keep commission status presentation consistent.
//
// -----------------------------------------------------------------------------

import {
  Badge,
} from '@/components/ui';

import type {
  BadgeVariant,
} from '@/components/ui';

import type {
  AdminCommissionStatus,
} from '@/features/admin/commissions';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommissionStatusBadgeProps {
  readonly status: AdminCommissionStatus;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

interface CommissionStatusConfig {
  readonly label: string;
  readonly variant: BadgeVariant;
}

const statusConfig: Record<
  AdminCommissionStatus,
  CommissionStatusConfig
> = {
  PENDING: {
    label: 'Pending',
    variant: 'warning',
  },

  ASSESSED: {
    label: 'Assessed',
    variant: 'success',
  },

  CANCELLED: {
    label: 'Cancelled',
    variant: 'danger',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionStatusBadge({
  status,
  className,
}: CommissionStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size="sm"
      className={className}
    >
      {config.label}
    </Badge>
  );
}