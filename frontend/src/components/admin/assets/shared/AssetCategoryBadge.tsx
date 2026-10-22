
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Category Badge
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display a readable label for each asset category.
 * - Apply consistent semantic badge styling.
 * - Cover every AssetCategory defined by the backend.
 * - Keep presentation logic separate from domain logic.
 *
 * -----------------------------------------------------------------------------
 */

import { Badge } from '@/components/ui/badge';
import type { BadgeVariant } from '@/components/ui/badge';

import { AssetCategory } from '@/features/admin/assets/models';

// =============================================================================
// Types
// =============================================================================

export interface AssetCategoryBadgeProps {
  readonly category: AssetCategory;
  readonly size?: 'sm' | 'md';
  readonly className?: string;
}

// =============================================================================
// Category Configuration
// =============================================================================

interface AssetCategoryConfig {
  readonly label: string;
  readonly variant: BadgeVariant;
}

const ASSET_CATEGORY_CONFIG: Record<
  AssetCategory,
  AssetCategoryConfig
> = {
  [AssetCategory.PROFILE_PHOTO]: {
    label: 'Profile photo',
    variant: 'brand',
  },

  [AssetCategory.COVER_PHOTO]: {
    label: 'Cover photo',
    variant: 'brand',
  },

  [AssetCategory.AVATAR]: {
    label: 'Avatar',
    variant: 'brand',
  },

  [AssetCategory.GOVERNMENT_ID]: {
    label: 'Government ID',
    variant: 'warning',
  },

  [AssetCategory.DRIVER_LICENSE]: {
    label: 'Driver license',
    variant: 'warning',
  },

  [AssetCategory.PASSPORT]: {
    label: 'Passport',
    variant: 'warning',
  },

  [AssetCategory.SELFIE]: {
    label: 'Selfie',
    variant: 'success',
  },

  [AssetCategory.VEHICLE_PHOTO]: {
    label: 'Vehicle photo',
    variant: 'default',
  },

  [AssetCategory.CHAT_ATTACHMENT]: {
    label: 'Chat attachment',
    variant: 'outline',
  },

  [AssetCategory.OTHER]: {
    label: 'Other',
    variant: 'default',
  },
};

// =============================================================================
// Component
// =============================================================================

export function AssetCategoryBadge({
  category,
  size = 'sm',
  className,
}: AssetCategoryBadgeProps) {
  const config = ASSET_CATEGORY_CONFIG[category];

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

export default AssetCategoryBadge;
