
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Visibility Badge
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display an asset's visibility clearly.
 * - Distinguish public assets from private assets.
 * - Cover every AssetVisibility enum value.
 * - Reuse the shared sisiMove Badge component.
 *
 * Security:
 * - This badge is informational only.
 * - It does not grant access or change asset visibility.
 *
 * -----------------------------------------------------------------------------
 */

import { Badge } from '@/components/ui/badge';
import type { BadgeVariant } from '@/components/ui/badge';

import { AssetVisibility } from '@/features/admin/assets/models';

// =============================================================================
// Types
// =============================================================================

export interface AssetVisibilityBadgeProps {
  readonly visibility: AssetVisibility;
  readonly size?: 'sm' | 'md';
  readonly className?: string;
}

// =============================================================================
// Visibility Configuration
// =============================================================================

interface AssetVisibilityConfig {
  readonly label: string;
  readonly variant: BadgeVariant;
}

const ASSET_VISIBILITY_CONFIG: Record<
  AssetVisibility,
  AssetVisibilityConfig
> = {
  [AssetVisibility.PUBLIC]: {
    label: 'Public',
    variant: 'success',
  },

  [AssetVisibility.PRIVATE]: {
    label: 'Private',
    variant: 'warning',
  },
};

// =============================================================================
// Component
// =============================================================================

export function AssetVisibilityBadge({
  visibility,
  size = 'sm',
  className,
}: AssetVisibilityBadgeProps) {
  const config = ASSET_VISIBILITY_CONFIG[visibility];

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
    >
      {config.label}
    </Badge>
  );
}

export default AssetVisibilityBadge;
