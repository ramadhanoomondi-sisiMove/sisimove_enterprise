
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Type Icon
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Visually identify asset types throughout the admin interface.
 * - Use consistent icons and semantic colors.
 * - Support compact and regular display sizes.
 * - Remain independent of asset fetching and business logic.
 *
 * -----------------------------------------------------------------------------
 */

import {
  File,
  FileAudio,
  FileImage,
  FileVideo,
  type LucideIcon,
} from 'lucide-react';

import { AssetType } from '@/features/admin/assets/models';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export type AssetTypeIconSize = 'sm' | 'md' | 'lg';

export interface AssetTypeIconProps {
  readonly type: AssetType;
  readonly size?: AssetTypeIconSize;
  readonly className?: string;
  readonly decorative?: boolean;
}

// =============================================================================
// Configuration
// =============================================================================

interface AssetTypeIconConfig {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly colorClass: string;
}

const ASSET_TYPE_CONFIG: Record<AssetType, AssetTypeIconConfig> = {
  [AssetType.IMAGE]: {
    icon: FileImage,
    label: 'Image',
    colorClass: 'text-[var(--brand)] bg-[var(--brand-soft)]',
  },

  [AssetType.VIDEO]: {
    icon: FileVideo,
    label: 'Video',
    colorClass: 'text-violet-700 bg-violet-50',
  },

  [AssetType.AUDIO]: {
    icon: FileAudio,
    label: 'Audio',
    colorClass: 'text-amber-700 bg-amber-50',
  },

  [AssetType.DOCUMENT]: {
    icon: File,
    label: 'Document',
    colorClass: 'text-[var(--foreground-secondary)] bg-[var(--background-muted)]',
  },

  [AssetType.OTHER]: {
    icon: File,
    label: 'Other file',
    colorClass: 'text-[var(--foreground-muted)] bg-[var(--background-subtle)]',
  },
};

// =============================================================================
// Size Configuration
// =============================================================================

const SIZE_CLASSES: Record<
  AssetTypeIconSize,
  { readonly container: string; readonly icon: string }
> = {
  sm: {
    container: 'size-8 rounded-lg',
    icon: 'size-4',
  },

  md: {
    container: 'size-10 rounded-xl',
    icon: 'size-5',
  },

  lg: {
    container: 'size-12 rounded-xl',
    icon: 'size-6',
  },
};

// =============================================================================
// Component
// =============================================================================

export function AssetTypeIcon({
  type,
  size = 'md',
  className,
  decorative = false,
}: AssetTypeIconProps) {
  const config = ASSET_TYPE_CONFIG[type];
  const Icon = config.icon;
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        sizeClasses.container,
        config.colorClass,
        className,
      )}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : config.label}
      aria-hidden={decorative ? true : undefined}
    >
      <Icon
        className={sizeClasses.icon}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </span>
  );
}

export default AssetTypeIcon;
