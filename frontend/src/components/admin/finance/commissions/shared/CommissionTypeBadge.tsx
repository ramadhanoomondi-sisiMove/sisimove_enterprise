// src/components/admin/commissions/shared/CommissionTypeBadge.tsx
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Type Badge
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the category of a commission.
// - Apply consistent semantic badge variants.
// - Reuse the shared design-system Badge primitive.
// - Keep commission type presentation consistent.
//
// -----------------------------------------------------------------------------

import {
  Badge,
} from '@/components/ui';

import type {
  BadgeVariant,
} from '@/components/ui';

import type {
  AdminCommissionType,
} from '@/features/admin/finance/commissions';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommissionTypeBadgeProps {
  readonly type: AdminCommissionType;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

interface CommissionTypeConfig {
  readonly label: string;
  readonly variant: BadgeVariant;
}

const typeConfig: Record<
  AdminCommissionType,
  CommissionTypeConfig
> = {
  BOOKING: {
    label: 'Booking',
    variant: 'brand',
  },

  EARNING: {
    label: 'Earning',
    variant: 'default',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionTypeBadge({
  type,
  className,
}: CommissionTypeBadgeProps) {
  const config = typeConfig[type];

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