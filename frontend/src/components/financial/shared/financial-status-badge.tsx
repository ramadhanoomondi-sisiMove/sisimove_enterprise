// -----------------------------------------------------------------------------
// sisiMove — Financial Status Badge
// -----------------------------------------------------------------------------
//
// Financial-specific status presentation built on top of the shared UI Badge.
//
// Responsibilities:
// - Translate financial semantic tones into the global Badge variants.
// - Provide a financial vocabulary at the feature boundary.
// - Keep financial components from depending directly on UI styling details.
//
// Architectural boundary:
//
// This component does NOT:
// - own financial business rules;
// - determine whether a status is valid;
// - map backend enums automatically;
// - call APIs;
// - manage status transitions.
//
// The financial feature supplies the label and semantic tone.
// The global Badge owns the actual visual presentation.
//
// Dependency direction:
//
//   FinancialStatusBadge
//          ↓
//        Badge
//          ↓
//       Design System
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { Badge } from '@/components/ui/badge';

import type { BadgeSize, BadgeVariant } from '@/components/ui/badge';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type FinancialStatusTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger';

export interface FinancialStatusBadgeProps
  extends Omit<ComponentPropsWithoutRef<typeof Badge>, 'variant' | 'children'> {
  /**
   * Human-readable financial status.
   *
   * Examples:
   *
   *   Active
   *   Pending
   *   Processing
   *   Completed
   *   Failed
   */
  label: string;

  /**
   * Semantic financial status tone.
   *
   * This describes presentation semantics only.
   * It does not perform domain status interpretation.
   */
  tone?: FinancialStatusTone;

  /**
   * Badge size inherited from the shared UI primitive.
   */
  size?: BadgeSize;
}

// -----------------------------------------------------------------------------
// Tone → Badge Variant
// -----------------------------------------------------------------------------

const toneToBadgeVariant: Record<
  FinancialStatusTone,
  BadgeVariant
> = {
  neutral: 'default',
  brand: 'brand',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

// -----------------------------------------------------------------------------
// Financial Status Badge
// -----------------------------------------------------------------------------

export function FinancialStatusBadge({
  label,
  tone = 'neutral',
  size = 'md',
  ...props
}: FinancialStatusBadgeProps) {
  return (
    <Badge
      {...props}
      variant={toneToBadgeVariant[tone]}
      size={size}
    >
      {label}
    </Badge>
  );
}