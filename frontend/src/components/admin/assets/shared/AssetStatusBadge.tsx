
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Status Badge
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Present asset lifecycle status consistently.
 * - Map backend AssetStatus values to semantic badge variants.
 * - Keep status styling aligned with the global design system.
 * - Provide accessible, readable status labels.
 *
 * -----------------------------------------------------------------------------
 */

import { Badge } from '@/components/ui/badge';

import { AssetStatus } from '@/features/admin/assets/models';

import type { BadgeVariant } from '@/components/ui/badge';

// =============================================================================
// Types
// =============================================================================

export interface AssetStatusBadgeProps {
  readonly status: AssetStatus;
  readonly size?: 'sm' | 'md';
  readonly className?: string;
}

// =============================================================================
// Status Configuration
// =============================================================================

interface AssetStatusConfig {
  readonly label: string;
  readonly variant: BadgeVariant;
}

const ASSET_STATUS_CONFIG: Record<
  AssetStatus,
  AssetStatusConfig
> = {
  [AssetStatus.UPLOADING]: {
    label: 'Uploading',
    variant: 'warning',
  },

  [AssetStatus.UPLOADED]: {
    label: 'Uploaded',
    variant: 'brand',
  },

  [AssetStatus.READY]: {
    label: 'Ready',
    variant: 'success',
  },

  [AssetStatus.ARCHIVED]: {
    label: 'Archived',
    variant: 'default',
  },

  [AssetStatus.DELETED]: {
    label: 'Deleted',
    variant: 'danger',
  },
};

// =============================================================================
// Component
// =============================================================================

export function AssetStatusBadge({
  status,
  size = 'sm',
  className,
}: AssetStatusBadgeProps) {
  const config = ASSET_STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
      aria-label={`Asset status: ${config.label}`}
    >
      {config.label}
    </Badge>
  );
}

export default AssetStatusBadge;
